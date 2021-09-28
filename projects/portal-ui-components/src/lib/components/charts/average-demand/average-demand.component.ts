// import * as d3 from 'd3';
declare const d3v5: any;

import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit } from '@angular/core';

import { BaseChartComponent } from '../common/base-chart.component';
import { ChartService } from '../../../services/chart.service';
import { ColorService } from '../../../services/color.service';

export interface IAverageDemand {
  unit: string;
  rows: number;
  label: string;
  readings: Array<{ label: string, value: number }>;
}

@Component({
  selector: 'puc-average-demand',
  templateUrl: './average-demand.component.html',
  styleUrls: ['./average-demand.component.scss']
})
export class AverageDemandComponent extends BaseChartComponent implements OnInit {

  chartData: IAverageDemand;
  @Input() barHeight;

  yTicks = 6;
  yTicksLabels = ['0', '5', '11', '17', '23'];

  xDomain;
  colorScale;


  constructor(chartElement: ElementRef,
    private colorService: ColorService,
    private chartService: ChartService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone) {
    super(chartElement);
    this.margin = { top: 10, right: 10, bottom: 20, left: 50 };
  }


  ngOnInit(): void {

  }


  processData() {
    // this.chartData.readings.reverse();
  }


  /***** Scales *********/

  setXScale() {
    this.xDomain = this.getXDomain(this.chartData.readings);
    this.xScale = this.chartService.createScaleLinear(
      0, this.xDomain[1], this.margin['left'], this.width - this.margin['right']);
  }


  setYScale() {
    // const domain = this.getYDomain(this.chartData.readings);
    // console.log(domain);

    this.yScale = this.chartService.createScaleBand(
      this.chartData.rows, this.height - this.margin['bottom'], this.margin['top'], 0.5);
  }

  /***** Scales *********/

  createChart(): void {

    const self = this;

    console.log('createChart - Average Demand Chart');
    if (this.chartData && Object.keys(this.chartData).length) {

      this.cd.reattach();
      this.ngZone.runOutsideAngular(() => {

        this.processData();
        super.createChart();

        this.generateColorScale();
        this.generateBarChart();

        this.cd.detectChanges();
        this.cd.detach();
      });
    }
  }



  generateColorScale() {
    const colorCode = this.getColor();
    const rgbVersionDark = this.colorService.hexTorgb(colorCode);

    const colorArray = this.colorService.generateOpacityArray(rgbVersionDark, .15, 12).reverse();
    console.log(colorArray);

    this.colorScale = d3v5.scaleQuantize()
      .domain([this.xDomain[0], this.xDomain[1]])
      .range(colorArray);
  }


  generateBarChart() {
    this.gSvg.append('g')
      .selectAll('rect')
      .data(this.chartData.readings)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', this.xScale(0))
      .attr('y', (_, i) => this.yScale(i))
      .attr('width', d => this.xScale(d.value) - this.xScale(0))
      .attr('height', this.yScale.bandwidth())
      .attr('fill', d => this.colorScale(d.value))
      .on('mouseover', (d, i) => this.mouseOver(d, i, this))
      .on('mousemove', (d, i) => this.mouseMove(d, i, this))
      .on('mouseleave', (d, i) => this.mouseLeave(d, this));
  }


  plotYAxes() {
    this.svg.append('g')
      .attr('class', 'axis axis--y averageChart--y')
      .attr('transform', `translate( ${this.margin['left']}, 0)`)
      .call(d3v5
        .axisLeft(this.yScale)
        .tickSizeOuter(0)
        .ticks(this.yTicks)
        .tickFormat((i: number) => {
          const label = this.yTicksLabels.includes(i.toString()) ? this.chartData.readings[i].label : '';
          return label;
        })
      )
      .append('text')
      // .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end');
  }



  getXDomain(readings) {
    const maxValue = (Array.isArray(readings) && readings.length) ?
      d3v5.max(readings, r => r['value']) : 0;
    return [0, maxValue];
  }



  getYDomain(readings) {
    return readings.map(r => r.label);
  }


  addGraphicsElement() {
    this.gSvg = this.svg.append('g').attr('transform', 'translate(' + 0 + ',' + 0 + ')');
  }


  mouseOver(d, i, self) {
    if (this.toolTip) {

      let htmlContent = `<div class="chartToolTip">`;
      htmlContent += `<div> <b>Time </b> : ${d.label} </div>`;
      htmlContent += `<div> <b>${this.chartData.label} </b> : ${d.value ? d.value : '--'}  ${this.chartData.unit} </div>`;
      htmlContent += '</div>';

      this.toolTip
        .style('opacity', .88)
        .style('visibility', 'visible')
        .style('z-index', 110)
        .html(htmlContent);
    }
  }


  mouseMove(d, i, self) {
    if (this.toolTip) {
      const mouseCoords = (d3v5.mouse(d3v5.event.currentTarget));
      if (super.isFirefox()) {
        this.toolTip
          .style('top', d3v5.event.layerY + 'px')
          .style('left', d3v5.event.layerX + 'px');
      } else {
        if (i <= 3) {
          this.toolTip
            .style('top', mouseCoords[1] - 60 + 'px')
            .style('left', `${mouseCoords[0] + 10}px`);

        } else {
          this.toolTip
            .style('top', mouseCoords[1] + 'px')
            .style('left', `${mouseCoords[0] + 10}px`);
        }
      }
    }
  }

  getColor() {
    if (this.colorSet && Object.keys(this.colorSet).length && this.colorSet.baseColor) {
      return this.colorSet.baseColor;
    } else {
      return '#EF9453';
    }
  }

}
