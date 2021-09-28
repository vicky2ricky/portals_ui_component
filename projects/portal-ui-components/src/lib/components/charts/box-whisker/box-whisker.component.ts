// import * as d3 from 'd3';
declare const d3v5: any;

import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BaseChartComponent } from '../common/base-chart.component';
import { ChartService } from '../../../services/chart.service';
import { round } from 'lodash-es';

interface IBoxWhisker {
  unit: string;
  category: string;
  data: Array<{ name: string, value: number, floors: Array<any>, actualData?: Array<any> }>;
}


@Component({
  selector: 'puc-box-whisker',
  templateUrl: './box-whisker.component.html',
  styleUrls: ['./box-whisker.component.scss']
})
export class BoxWhiskerComponent extends BaseChartComponent implements OnInit {

  @Input() whiskersHeight?= 16;

  quartiles: number[];
  whiskers: number[];
  q1: number;
  q3: number;
  median: number;
  min: number;
  max: number;
  interQuantileRange: number;

  chartData: IBoxWhisker;
  whiskerData: Array<number> = [];

  isChartRendered = false;

  showChart = true;
  singleSiteMsg = 'Please select more than &nbsp; <b>one buildings</b> &nbsp; or <b>a building with more than one floor</b> to see the Chart.';

  @Output() siteClick: EventEmitter<any> = new EventEmitter();

  constructor(chartElement: ElementRef, private chartService: ChartService) {
    super(chartElement);
    this.margin = { top: 0, right: 20, bottom: 0, left: 10 };
  }

  ngOnInit(): void {

  }

  private processData() {
    // if (this.chartData.data.length == 1) {
    //   const data = this.chartData.data[0].actualData;
    //   this.whiskerData = data.map(d => d.value).sort(d3v5.ascending);
    // } else {
    //   const data = (this.chartData && this.chartData.data && Array.isArray(this.chartData.data)) ?
    //     this.chartData.data : [];
    //   this.whiskerData = data.map(d => d.value).sort(d3v5.ascending);
    // }

    const data = (this.chartData && this.chartData.data && Array.isArray(this.chartData.data)) ?
        this.chartData.data : [];
    this.whiskerData = data.map(d => d.value).sort(d3v5.ascending);
    console.log(this.whiskerData);
  }

  private computeStatistics() {
    const data = this.whiskerData;

    if (this.whiskerData.length > 1) {
      this.quartiles = [d3v5.quantile(data, .25), d3v5.quantile(data, .5), d3v5.quantile(data, .75)];
      this.whiskers = [d3v5.min(data), d3v5.max(data)];
    } else {
      this.quartiles = [0, 0, 0];
      this.whiskers = [0, d3v5.max(data)];
    }

    this.quartiles = this.quartiles.map(quartile => Math.round(quartile * 100)/100);
    this.q1 = this.quartiles[0];
    this.median = this.quartiles[1];
    this.q3 = this.quartiles[2];
    this.interQuantileRange = this.q3 - this.q1;


    this.whiskers = this.whiskers.map(whisker => Math.round(whisker * 100)/100);
    this.min = this.whiskers[0];
    this.max = this.whiskers[1];

    console.log(this.quartiles, this.whiskers);
  }


  /***** Scales *********/
  setXScale() {
    this.xScale = this.chartService.createScaleLinearNotNice(
      this.min,
      this.max,
      this.margin['left'],
      this.width - this.margin['right']);
  }

  /***** Scales *********/

  createChart() {
    console.log('createChart - Site Comparison Chart');
    if (this.chartData && Object.keys(this.chartData).length) {
      this.isChartRendered = false;
      this.processData();
      this.computeStatistics();
      super.createChart();

      this.showChart = true;

      this.addWhiskers();
      this.addCenterHorizontalLine();
      this.addBoxRectangle();
      this.addQuartiles();

      this.setUpBars();
    }
  }


  setupChart() {
    // if (this.chartData.data.length == 1) {
    //   this.height = 0;
    // }
    this.svg = d3v5.select(this.hostElement).select('.content').append('svg')
        // .attr('viewBox', `0 0 ${this.width} ${this.height}`)
        .attr('class', this.baseChartClass)
        .attr('width', this.width)
        .attr('height', this.height);
  }


  private addWhiskers() {
    const whiskerLineGrps = this.gSvg.selectAll('.whiskers')
      .data(this.whiskers)
      .enter().append('g')
      .attr('class', 'whiskers')
      .attr('transform', (d, i) => {
        console.log(d);
        console.log(this.xScale(d));
        return 'translate(' + this.xScale(d) + ',' + (this.chartHeight / 2 - this.whiskersHeight / 2) + ')';
      });

    whiskerLineGrps.append('line')
      .attr('x2', 0)
      .attr('y2', d => this.whiskersHeight)
      .attr('class', 'whiskerLine');

    whiskerLineGrps.append('text')
      .attr('x', 0)
      .attr('y', this.whiskersHeight + 16)
      .attr('text-anchor', (d, i) => i === 0 ? 'start' : 'end')
      .text(d => d + ' ' + this.chartData.unit)
      .attr('class', 'whisketBoxText')
      // .attr('transform', (d, i) => i === 0 ? 'rotate(-30)' : 'rotate(0)');
  }

  private addCenterHorizontalLine() {
    this.gSvg.append('line')
      .attr('x1', this.xScale(this.whiskers[0]))
      .attr('y1', this.chartHeight / 2)
      .attr('x2', this.xScale(this.whiskers[1]))
      .attr('y2', this.chartHeight / 2)
      .attr('class', 'whiskerLine');
  }

  private addBoxRectangle() {
    const whiskerFill = (this.colorSet && this.colorSet['whiskerFill']) ? this.colorSet['whiskerFill'] : '#f9f9f9';
    const whiskerStroke = (this.colorSet && this.colorSet['whiskerStroke']) ? this.colorSet['whiskerStroke'] : '#acacac';
    this.gSvg.append('g')
      .append('rect')
      .attr('width', this.xScale(this.quartiles[2]) - this.xScale(this.quartiles[0]))
      .attr('height', this.whiskersHeight)
      .attr('x', this.xScale(this.quartiles[0]))
      .attr('y', this.chartHeight / 2 - this.whiskersHeight / 2)
      .attr('fill', whiskerFill)
      .attr('stroke', whiskerStroke)
      .attr('stroke-width', 1);
  }

  private addQuartiles() {
    const quartileLineGrps = this.gSvg.selectAll('.quartiles')
      .data(this.quartiles)
      .enter().append('g')
      .attr('class', 'quartiles')
      .attr('transform', (d, i) => {
        return 'translate(' + this.xScale(d) + ',' + (this.chartHeight / 2 - this.whiskersHeight / 2) + ')';
      });

    quartileLineGrps.append('line')
      .attr('x2', 0)
      .attr('y2', d => this.whiskersHeight)
      .attr('class', 'whiskerLine');

    quartileLineGrps.append('rect')
      .attr('transform', d => `translate(-5 , 0)`)
      .attr('width', 10)
      .attr('height', this.whiskersHeight)
      .attr('fill', 'none')
      .attr('class', 'hover-region')
      .attr('pointer-events', 'all')

      .on('mouseover', (d, i) => this.mouseOver(d, i, this))
      .on('mouseleave', (d, i) => this.mouseLeave(d, this));

    // quartileLineGrps
    //   .on('mouseover', (d, i) => this.mouseOver(d, i, this))
    //   .on('mouseleave', (d, i) => this.mouseLeave(d, this));

    // quartileLineGrps.append('text')
    //   .attr('x', 0)
    //   .attr('y', - this.whiskersHeight + 8)
    //   // .attr('y', this.whiskersHeight + 16)
    //   .attr('text-anchor', 'start')
    //   .text(d => round(d, 2) + ' ' + this.chartData.unit)
    //   .attr('class', 'whisketBoxText')
    //   .attr('transform', (d, i) => 'rotate(-30)');
  }

  addGraphicsElement() {
    this.gSvg = this.svg.append('g').attr('transform', `translate( 0, ${this.margin['top']})`);
  }

  setUpBars() {
    if (this.chartData && this.chartData.data && Array.isArray(this.chartData.data)) {
      this.chartData.data.sort((d1, d2) => d2.value - d1.value);
    }
    this.isChartRendered = true;
  }

  siteClicked(siteInfo) {
    this.siteClick.emit(siteInfo);
  }

  mouseOver(d, i, self) {
    // const mouseCoords = (d3v5.mouse(d3v5.event.currentTarget));
    // console.log(mouseCoords);

    let htmlContent = `<ul class="chartToolTip boxWhisker toolTipList">`;
    htmlContent += `<li class="whisketBoxText">${round(d, 2)} ${this.chartData.unit}</li>`;
    htmlContent += '</ul>';

    // this.xScale(d) + ',' + (this.chartHeight / 2 - this.whiskersHeight / 2)
    // console.log(i);

    this.toolTip
      .style('opacity', .88)
      .style('visibility', 'visible')
      .style('z-index', 110)
      .style('top', (this.chartHeight / 2 - (2 * this.whiskersHeight + 4)) + 'px')
      .style('left', this.xScale(d) + 'px')
      .html(htmlContent);
  }

}
