// import * as d3 from 'd3';
declare const d3v5: any;

import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { cloneDeep, cloneDeepWith, round } from 'lodash-es';

import { BaseChartComponent } from '../common/base-chart.component';
import { ChartService } from '../../../services/chart.service';
import { ColorService } from '../../../services/color.service';

export interface ISunburstData {
  unit: string;
  rows: number; // Total number of rows of data
  highestLevel; // Is it a site level Or portfolio level
  distribution; // For all the data
  id : string;
  siteId: string;
  readings: Array<{ id: string, parentId: string, name: string, value: string, topLevelParentId: string }>;
  // topLevelParentId - is the same across one entire set of readings, helps in color selection
}


interface ISelection {
  parent: {
    name: string,
    value: number
  };
  children: Array<{ name: string, value: number }>;
  childColor: string;
  others?: {
    name: string,
    value: number
  };
  hasOthers: boolean;
}


@Component({
  selector: 'puc-sunburst',
  templateUrl: './sunburst.component.html',
  styleUrls: ['./sunburst.component.scss']
})
export class SunburstComponent extends BaseChartComponent implements OnInit {

  @Input() maxChildrenInList = 10;
  chartData: ISunburstData;

  root;
  colors;

  stratify;
  stratifiedData;

  formatNumber;
  partition;

  arc;
  middleArcLine;

  radius: number;
  maxRadius: number;

  selection: ISelection;

  focusedChild;
  filteredData: ISunburstData;

  selectedPath;

  constructor(chartElement: ElementRef,
    private colorService: ColorService,
    private chartService: ChartService) {
    super(chartElement);
  }


  // type would be site, floor, portfolio
  modifyData() {
    let dataToConsider = [];

    // Since the keys in the distribution are siteIds. So if there are more than one siteIds, then we want to go uptill Portfolio
    if (Object.keys(this.chartData.distribution).length > 1) {
      dataToConsider = [];
      for(const key of Object.keys(this.chartData.distribution)) {
        dataToConsider.push(...cloneDeep(this.chartData.distribution[key]));
      }

      let totalValue = 0;
      dataToConsider = dataToConsider.map(entry => {
        if (entry.parentId === '' || entry.parentId === -1) {
          totalValue += entry.value;
          entry.parentId = -1;
        }
        return entry;
      });

      // Now add a top level entry
      dataToConsider.push({
        id: '-1', label: 'Portfolio', parentId: '', type: 'portfolio', value: totalValue
      });
    } else if (this.chartData.highestLevel === 'site') {
      dataToConsider = this.chartData.distribution[this.chartData.id];
    } else {
      dataToConsider = this.chartData.distribution[this.chartData.siteId];
    }

    console.log(dataToConsider);

    const readings = [];

    const filters = ['portfolio', 'site', 'floor', 'ccu', 'equip', 'room'];
    for (const filter of filters) {
      const filteredData = dataToConsider.filter(_data => _data.type === filter);
      // if (filter !== 'equip') {
        filteredData.forEach(elem => {
          readings.push({ name: elem.label, parentId: elem.parentId , value: round(elem.value, 2), id: elem.id, type: filter });
        });
      // } else {
      //   filteredData.forEach(elem => {
      //     for (const parentId of elem.parentIds) {
      //       readings.push({ name: elem.label, parentId: parentId.id , value: round(elem.value, 2),
      //         id: elem.id, type: 'equip', parentType: parentId.type});
      //     }
      //   });
      // }
    }

    this.chartData.rows = readings.length;
    this.chartData.readings = readings;
  }


  setUpUtilities() {
    this.stratify = d3v5.stratify()
      .id(d => d['id'])
      .parentId(d => d['parentId']);

    this.formatNumber = d3v5.format(',.2f');
    this.partition = d3v5.partition();
  }


  stratifyData() {
    // this.stratifiedData = this.stratify(this.chartData.readings);
    this.stratifiedData = this.stratify(this.changeSelectedPath());
    console.log(this.stratifiedData);
  }


  setUpRoot() {
    this.root = d3v5.hierarchy(this.stratifiedData)
      .sum((d: any) => d.descendants().length > 1 ? 0 : (d.data.value ? d.data.value : 0));
    console.log(this.root);
  }


  /*********** Scales ******************/
  setXScale() {
    this.xScale = d3v5.scaleLinear().range([0, 2 * Math.PI]).clamp(true);
  }


  setYScale() {
    this.yScale = d3v5.scaleSqrt().range([this.maxRadius * .1, this.maxRadius]);
  }

  /***** Scales ********/


  private setColorScale() {
    let colorSet;

    // const topLevelId = this.root.data.data.id;
    const heightOfTree = this.root.height;
    const colorCode = (this.colorSet && this.colorSet.color) ? this.colorSet.color : '#E95E6F';
    const hexColorRepr = this.colorService.hexTorgb(colorCode);
    colorSet = this.colorService.generateOpacityArray(hexColorRepr, .4, (heightOfTree + 1));
    this.colors = colorSet;

    // if (this.chartData.highestLevel === 'site') {
    //   const topLevelId = this.root.data.data.id;
    //   const heightOfTree = this.root.height;
    //   const colorCode = (this.colorSet && this.colorSet[topLevelId]) ? this.colorSet[topLevelId] : '#E95E6F';
    //   const hexColorRepr = this.colorService.hexTorgb(colorCode);
    //   colorSet = this.colorService.generateOpacityArray(hexColorRepr, .4, (heightOfTree + 1));
    //   this.colors = colorSet;
    // }

    // this.colors = d3v5.scaleOrdinal(d3v5.schemeSpectral[this.root.children.length + 1]);
    // // Below is an example of using custom colors
    // // this.colorScale = d3v5.scaleOrdinal().domain([0,1,2,3]).range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']);
  }


  private setDimensions() {
    this.radius = this.width / 2;
    this.maxRadius = (Math.min(this.width, this.height) / 2) - 5;

    console.log(this.radius, this.maxRadius);
  }


  createChart() {
    console.log('Sunburst - createChart');
    if (this.chartData && Object.keys(this.chartData).length) {

      super.removeExistingChartFromParent();

      this.modifyData();

      this.setUpUtilities();
      this.stratifyData();
      this.setUpRoot();

      this.setColorScale();
      this.setDimensions();
      // this.processData();

      this.setXScale();
      this.setYScale();

      this.setUpDrawingFunctions();

      super.setupChart();

      this.addSvgHandlers();
      this.addGraphicsElement();

      this.addSlices();

      this.addTopLevelInfo();

      this.focusInitially();
    }
  }


  private setUpDrawingFunctions() {
    this.arc = d3v5.arc()
      .startAngle((d: any) => this.xScale(d.x0))
      .endAngle((d: any) => this.xScale(d.x1))
      .padAngle((d: any) => Math.min((this.xScale(d.x1 - d.x0)) / 2, 0.001))
      .padRadius(this.maxRadius / 2)
      .innerRadius((d: any) => Math.max(0, this.yScale(d.y0)))
      .outerRadius((d: any) => Math.max(0, this.yScale(d.y1)));


    this.middleArcLine = d => {
      const halfPi = Math.PI / 2;
      const angles = [this.xScale(d.x0) - halfPi, this.xScale(d.x1) - halfPi];
      const r = Math.max(0, (this.yScale(d.y0) + this.yScale(d.y1)) / 2);

      const middleAngle = (angles[1] + angles[0]) / 2;
      const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
      if (invertDirection) { angles.reverse(); }

      const path = d3v5.path();
      path.arc(0, 0, r, angles[0], angles[1], invertDirection);
      return path.toString();
    };
  }


  addGraphicsElement() {
    this.gSvg = this.svg.append('g').attr('transform', 'translate(' + this.maxRadius + ',' + this.maxRadius + ')');
    // this.gSvg = this.svg.append('g').attr('transform', 'translate(0, 0)');
  }


  // Reset zoom on canvas click
  addSvgHandlers() {
    this.svg.on('click', () => this.focusOn());
  }


  private addSlices() {
    const slice = this.gSvg.selectAll('g.sunburstSlice')
      .data(
        this.partition(this.root)
          .descendants()
          // Bring down the size of the white circle, y defines the radius
          .map(d => { d.y0 = d.y0 - .2; d.y1 = d.y1 - .2; return d; })
          .filter(d => {
            // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
            return d.depth && d.x1 - d.x0 > 0.001;
          })
      );

    slice.exit().remove();

    const newSlice = slice.enter().append('g').attr('class', 'sunburstSlice');
    const unit = (this.chartData && this.chartData.unit) ? this.chartData.unit : '';
    newSlice.append('title').text(d => d.data.data.name + '\n' + this.formatNumber(d.value) + ' ' + unit);

    // Main Arc which represents the slice
    const path = newSlice.append('path')
      .attr('class', 'sunburstMainArc')
      // .attr('fill', d => { while (d.depth > 1) { d = d.parent; } return this.colors[d.depth]; })
      .attr('fill', d => this.colors[d.depth])
      .attr('d', this.arc);

    let animateElement = null;

    // Adding listeners on each of the path element, click, mouseover and mouseout
    path.filter(d => d.children)
      .style('cursor', 'pointer')
      .on('click', d => {
        d3v5.event.stopPropagation();
        this.focusOn(d);
      });


    const self = this;

    path.filter(d => d.children)
      .on('mouseover', function (child) {
        self.setSelections(child);
        animateElement = d3v5.select(this)
          .append('animate')
          .attr('attributeName', 'fill')
          .attr('dur', '3s')
          .attr('values', (d: any) => {
            const colorOfPath = self.colors[d.depth];
            return `${colorOfPath};${self.colorService.darkenColor(colorOfPath, 10)};${colorOfPath}; ${self.colorService.darkenColor(colorOfPath, 10)};${colorOfPath}`;
          })
          .attr('repeatCount', 'indefinite');
      });


    path.filter(d => d.children)
      .on('mouseout', _ => {
        self.setSelections(this.focusedChild);
        if (animateElement) {
          animateElement.remove();
        }
      });


    // Hidden arc for the text
    newSlice.append('path')
      .attr('class', 'sunburstHiddenArc')
      .attr('id', (_, i) => `hiddenArc${i}`)
      .attr('d', this.middleArcLine);

    const text = newSlice.append('text')
      .attr('class', 'sunburstNormalText')
      .attr('display', d => this.textFits(d, 1) ? null : 'none');

    text.append('textPath')
      .attr('startOffset', '50%')
      .attr('xlink:href', (_, i) => `#hiddenArc${i}`)
      .text(d => d.data.data.name);
  }


  private focusInitially() {
    const descendants = this.partition(this.root).descendants().filter(child => {
      return child.data?.data?.type === this.chartData.highestLevel
        && child.data?.data?.id === this.chartData.id
    });
    if (descendants.length > 0) {
      this.focusOn(descendants[0]);
      this.setSelections(descendants[0]);
    } else {
      this.setSelections();
    }
  }


  private textFits(d, visibleDepth) {
    const CHAR_SPACE = 6;

    const deltaAngle = this.xScale(d.x1) - this.xScale(d.x0);
    const r = Math.max(0, (this.yScale(d.y0) + this.yScale(d.y1)) / 2);
    const perimeter = r * deltaAngle;

    return d.depth <= visibleDepth && d.data.data.name.length * CHAR_SPACE < perimeter;
  }


  // Reset to top-level if no data point specified
  private focusOn(d = { depth: 0, x0: 0, x1: 1, y0: 0, y1: 1 }) {
    console.log(d);
    this.focusedChild = d;

    console.log(this.gSvg.select('g.sunBurstMainText'));
    this.gSvg.select('g.sunBurstMainText').remove();

    const transition = this.svg.transition()
      .duration(750)
      .tween('scale', () => {
        const xd = d3v5.interpolate(this.xScale.domain(), [d.x0, d.x1]);
        const yd = d3v5.interpolate(this.yScale.domain(), [d.y0, 1]);
        return t => { this.xScale.domain(xd(t)); this.yScale.domain(yd(t)); };
      });

    transition.selectAll('path.sunburstMainArc')
      .attrTween('d', data => () => this.arc(data));

    transition.selectAll('path.sunburstHiddenArc')
      .attrTween('d', data => () => this.middleArcLine(data));

    transition.selectAll('text')
      .attrTween('display', des => () => this.textFits(des, d.depth + 1) ? null : 'none');

    setTimeout(() => {
      if (d.y1 === 1) {
        this.addTopLevelInfo();
      }
    }, 680);

    this.moveStackToFront(d);
    this.setSelections(d);
  }


  private setSelections(d?) {
    if (!d || d.y1 === 1) {
      d = this.root;
    }

    let others;
    let hasOthers = false;

    const parent = {
      name: d.data.data.name,
      value: d.data.data.value
    };

    const children = [];

    for (const child of d.children) {
      children.push({
        name: child.data.data.name,
        value: child.data.data.value
      });
    }

    children.sort((child1, child2) => child2.value - child1.value);

    if (children.length > this.maxChildrenInList) {
      let combinedValue = 0;
      const excessChildren = children.splice(this.maxChildrenInList, children.length - this.maxChildrenInList);
      for (const child of excessChildren) {
        combinedValue += child.value;
      }

      // children.push({
      //   name: 'others',
      //   value: combinedValue
      // });
      others = {
        name: 'others',
        value: round(combinedValue, 2)
      };

      hasOthers = true;
    }

    this.selection = {
      parent,
      children,
      childColor: this.colors[d.depth],
      others,
      hasOthers
    };
  }


  private moveStackToFront(elD) {
    const self = this;
    this.svg.selectAll('.sunburstSlice').filter(d => d === elD)
      .each(function (d) {
        this.parentNode.appendChild(this);
        if (d.parent) {
          self.moveStackToFront(d.parent);
        }
      });
  }


  private addTopLevelInfo() {
    this.gSvg.select('g.sunBurstMainText').remove();
    const unit = (this.chartData && this.chartData.unit) ? this.chartData.unit : '';
    this.gSvg.append('g')
      .attr('class', 'sunBurstMainText')
      .selectAll('text')
      .data(this.root.descendants().filter(d => d.depth === 0))
      .join('text')
      .attr('dy', '0.75em')
      .append('tspan')
      .attr('x', d => this.xScale(d.x0) / 2)
      .attr('dy', '0em')
      .text(d => d.data.data.name)
      .append('tspan')
      .attr('x', d => this.xScale(d.x0) / 2)
      .attr('dy', '1.35em')
      .text(d => `${this.formatNumber(d.value)} ${unit}`);
  }


  changeSelectedPath(event?) {
    const value = (event && event.value) || this.selectedPath || 'floor';
    const ignoreTheOtherParent = value === 'floor' ? 'ccu' : 'floor';
    this.selectedPath = value;
    // this.filteredData = cloneDeepWith(this.chartData);
    const filteredReadings = this.chartData.readings.filter((reading: any) => {
      if (ignoreTheOtherParent === 'floor') {
        // We choose everything but floor and room
        return reading.type !== 'floor' && reading.type !== 'room';
      } else if (ignoreTheOtherParent === 'ccu') {
        // We choose everything but ccu and equip
        return reading.type !== 'ccu' && reading.type !== 'equip';
      }
    });

    if (event && event.value) {
      this.createChart();
    } else {
      return filteredReadings;
    }
  }
}
