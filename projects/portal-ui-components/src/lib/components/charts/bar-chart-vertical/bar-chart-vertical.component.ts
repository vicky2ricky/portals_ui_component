// import * as d3 from 'd3';
declare const d3v5: any;

import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit } from '@angular/core';

import { BaseChartComponent } from '../common/base-chart.component';
import { ChartService } from '../../../services/chart.service';
import { IBarChart } from '../../../models/IBarChart';

@Component({
  selector: 'puc-bar-chart-vertical',
  templateUrl: './bar-chart-vertical.component.html',
  styleUrls: ['./bar-chart-vertical.component.scss']
})
export class BarChartVerticalComponent extends BaseChartComponent implements OnInit {
  chartData: IBarChart;
  @Input() barWidth;
  @Input() barPadding = 0.4;
  @Input() editClass;
  yTicks = 4;
  stackedValues;

  randomClassName;

  constructor(
    chartElement: ElementRef,
    private chartService: ChartService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone) {
    super(chartElement);
    this.margin = { top: 10, right: 10, bottom: 60, left: 50 };
  }

  ngOnInit() {

  }

  processData() {
    this.stackedValues = d3v5.stack().keys(this.chartData.columns)(this.chartData.readings);
  }

  /* Scales */
  setXScale() {
    this.xScale = this.chartService.createScaleBand(
      this.chartData.rows, this.margin.left + 10, this.width - this.margin['right'] - 10, this.barPadding);
  }

  setYScale() {
    const domain = this.getYDomain(this.stackedValues);
    const yTicksInfo = this.chartService.getSmartTicks(domain[1]);
    this.yTicks = yTicksInfo.count;
    // this.yScale = this.chartService.createScaleLinear(
    //   domain[0], yTicksInfo.endPoint, this.height - this.margin['bottom'], this.margin['top']);

    this.yScale = this.chartService.createScaleLinear(
      domain[0], domain[1], this.height - this.margin['bottom'], this.margin['top']);
  }
  /* ends */

  createChart(): void {
    console.log('createChart - Vertical Bar Chart');
    if (this.chartData && Object.keys(this.chartData).length) {

      this.cd.reattach();
      this.ngZone.runOutsideAngular(() => {

        this.processData();
        this.randomClassName = this.chartService.createRandomClassName('bcvXAxisGroup');

        super.createChart();
        this.generateBarData();

        this.cd.detectChanges();
        this.cd.detach();
      });
    }
  }

  getYDomain(readings) {
    const maxValue = (Array.isArray(readings) && readings.length) ?
      d3v5.max(readings, dataByParameter => d3v5.max(dataByParameter, d => d[1])) : 0;
    return this.chartService.modifyMaxValueY(maxValue);
  }

  make_y_gridlines() {
    return d3v5.axisLeft(this.yScale)
      .ticks(this.yTicks);
  }

  addGridLines() {
    this.svg.append('g')
      .attr('class', 'chartGrid')
      .attr('transform', `translate( ${this.margin['left']}, 0)`)
      .call(
        this.make_y_gridlines()
          .tickSize(-this.chartWidth)
          .tickFormat((domain) => '')
      );
  }

  plotXAxes() {
    this.svg.append('g')
      .attr('class', `${this.randomClassName} ${this.editClass} axis axis--x bcv no-visibility`)
      .attr('transform', `translate( 0, ${this.height - this.margin['bottom']})`)
      .call(d3v5
        .axisBottom(this.xScale)
        .tickSize(6)
        .tickSizeOuter(0)
        .tickFormat(
          (d: number) => {
            if (d % 1 === 0 && d < this.chartData.rows) {
              return this.chartService.generateXLabel(this.chartData.groupBy, this.chartData.readings[d], d);
            }
          })
      )
    // .tickFormat((d: number) => (d % 6 === 0 || this.chartData.rows <= 6 || this.chartData.rows == d - 1) ?
    //   this.chartData.labels[d] : '')

    this.addXTicks();
  }


  addXTicks() {
    this.chartService.addXTicks(
      `.${this.randomClassName}.${this.editClass} .tick`, this.chartData.groupBy, this.xScale.bandwidth(), this.chartData.rows, -45, 'bcv')
  }

  plotYAxes() {
    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', `translate( ${this.margin['left']}, 0)`)
      .call(d3v5
        .axisLeft(this.yScale)
        .tickSize(0)
        .ticks(this.yTicks)
        .tickFormat(d => d > 0 ? (d < 1 ? d3v5.format('')(d) : d3v5.format('.2s')(d)) + ' ' + this.chartData.unit : ''))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end');
  }

  generateBarData(): void {

    // const height = this.height - this.margin.bottom;

    const barGroups = this.gSvg
      .selectAll('.barGroup')
      .data(this.stackedValues)
      .enter()
      .append('g')
      .attr('class', 'barGroup')
      .attr('fill', d => this.getColor(d.key));
    barGroups
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => this.xScale(i))
      .attr('y', (d: any) => this.yScale(d[1]))
      .attr('width', this.xScale.bandwidth())
      .attr('height', (d: any) => this.yScale(d[0]) - this.yScale(d[1]))
      // .attr('height', (d: any) => height - this.yScale(d[1]))
      .on('mouseover', (d, i) => this.mouseOver(d, i, this))
      .on('mousemove', (d, i) => this.mouseMove(d, i, this))
      .on('mouseleave', (d, i) => this.mouseLeave(d, this));
  }

  getColor(key) {
    if (this.colorSet && Object.keys(this.colorSet).length && this.colorSet[key]) {
      return this.colorSet[key];
    } else {
      return '#EF9453';
    }
  }

  addGraphicsElement() {
    this.gSvg = this.svg.append('g').attr('transform', 'translate(' + 0 + ',' + 0 + ')');
    // this.gSvg = this.svg.append('g').attr('transform', 'translate(' + 0 + ',' + this.margin['top'] + ')');
  }

  mouseOver(d, i, self) {
    if (this.toolTip) {

      const rowData = this.chartData.readings[i];

      const xValDate = this.chartService.getXValDate(this.chartData.groupBy, rowData);
      // const xValDate = new Date(rowData.date).toDateString() + ' ' +
      //   new Date(rowData.date).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })

      let htmlContent = `<ul class="chartToolTip toolTipList">`;
      htmlContent = xValDate !== '' ? htmlContent + `<li>@ ${xValDate}</li>` : htmlContent

      const columns = (this.chartData &&
        this.chartData.columns &&
        Array.isArray(this.chartData.columns)) ? this.chartData.columns : [];
      for (const column of columns) {
        htmlContent += `<li style = "color : ${this.colorSet[column]}"> ${this.chartData.mappings[column]} &nbsp;&nbsp; <b>${rowData[column] ? rowData[column] : '--'} ${this.chartData.unit} </b></li>`;
      }
      htmlContent += '</ul>';
      this.toolTip
        .style('opacity', .88)
        .style('visibility', 'visible')
        .style('z-index', 110)
        .html(htmlContent);
    }
  }

  mouseMove(d, i, self) {
    // console.log(i, this.chartData.rows);
    const thresholdToSwitchToolTip = Math.floor(.7 * this.chartData.rows);

    if (this.toolTip) {
      const mouseCoords = (d3v5.mouse(d3v5.event.currentTarget));
      // console.log(mouseCoords);

      const leftCoord = i > thresholdToSwitchToolTip ? mouseCoords[0] - 235 + 'px' : mouseCoords[0] + 10 + 'px';

      const heightOfTooltip = (Object.keys(d.data).length - 1) * 24;
      const minTopCoord = this.chartHeight - heightOfTooltip;

      const topCoord = mouseCoords[1] < minTopCoord ? mouseCoords[1] : minTopCoord;

      // Calcualted the size based on the widget width and mouse event to adjust the tooltip
      const size = (this.width / 100) * 65 > d3v5.event.layerX + 100 ? d3v5.event.layerX : d3v5.event.layerX - 200;
      if (super.isFirefox()) {
        this.toolTip
          .style('top', d3v5.event.layerY + 'px')
          .style('left', size + 'px');
      } else {
        this.toolTip
          .style('top', topCoord + 'px')
          .style('left', leftCoord);
      }
    }
  }

}


// if (closestElement > .64 * this.chartData.rows) {
//   this.toolTip
//     .style('top', mouseCoords[1] - 10 + 'px')
//     .style('left', mouseCoords[0] - 125 + 'px');
// } else {
//   this.toolTip
//     .style('top', mouseCoords[1] - 10 + 'px')
//     .style('left', `${mouseCoords[0] + this.margin.left + 15}px`);
// }
