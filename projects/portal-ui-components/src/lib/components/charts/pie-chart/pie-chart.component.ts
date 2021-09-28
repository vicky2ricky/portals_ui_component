// import * as d3 from 'd3';
declare const d3v5: any;

import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { BaseChartComponent } from '../common/base-chart.component';
import { IPieChart } from '../../../models/IPieChart';

@Component({
  selector: 'puc-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent extends BaseChartComponent implements OnInit {

  @Input() donut = false;
  @Input() showBreakup = false;
  @Input() showParentInTooltip = false;

  chartData: IPieChart;

  // Arcs & pie
  private pie: any;
  radius: number;

  pieData: Array<any>[];
  total: number | string;

  constructor(chartElement: ElementRef) {
    super(chartElement);
    this.margin = { top: 10, right: 10, bottom: 0, left: 16 };
  }


  ngOnInit() {

  }


  processData() {
    const data = (this.chartData && this.chartData.data && Array.isArray(this.chartData.data)) ?
      this.chartData.data : [];
    const keyValueTransformedData = d3v5.entries(data);
    this.pieData = this.pie(keyValueTransformedData);
    this.total = (this.chartData && this.chartData.total) ? this.chartData.total : (d3v5.sum(data, d => d.reading)).toFixed(2);
  }


  setUpParameters() {
    this.radius = Math.min(this.chartWidth, this.chartHeight) / 2;
    this.pie = d3v5.pie().value((d: any) => d.value.reading);
  }


  createChart() {
    console.log('createChart - Pie/Donut Chart');
    if (this.chartData && Object.keys(this.chartData).length) {

      this.setUpParameters();
      this.processData();
      super.createChart();
      if (this.donut && !this.showBreakup) {
        this.addCenterText();
      }

      this.drawPie();
    }
  }

  drawPie() {
    const self = this;
    const arcs = this.gSvg
      .selectAll('.arc')
      .data(this.pieData)
      .enter()
      .append('path')
      .attr('fill', d => d.data.value.color)
      .attr('stroke', '#FFF')
      .attr('stroke-width', 1)
      .style('opacity', 1)
      .on('mouseover', function (d, i) { self.mouseOver(d, i, this); })
      .on('mousemove', _ => self.mouseMove())
      .on('mouseleave', function (d, i) { self.mouseLeave(d, this); });

    arcs
      .attr('d', d3v5.arc()
        .innerRadius(this.donut ? (3 * this.radius / 4) : 0)
        .outerRadius(this.radius));

  }


  addGraphicsElement() {
    this.gSvg = this.svg.append('g').attr('transform',
      `translate( ${this.width / 2} , ${this.height / 2})`);
  }

  mouseOver(d, i, self) {
    if (this.toolTip) {
      let htmlContent = `<div class="chartToolTip pieTip" style = 'color : ${d.data.value.color};'>`;
      htmlContent += `<div> <b>${d.data.value.label} </b> : ${d.data.value.reading} ${this.chartData.unit} </div>`;
      if (this.showParentInTooltip) {
        htmlContent += `<div class="capitalize"> <b>${this.chartData.partitions[d.data.value.parentId]} </b></div>`;
      }
      htmlContent += '</div>';
      this.toolTip
        .style('opacity', .78)
        .style('visibility', 'visible')

        .html(htmlContent);
    }
  }

  mouseMove() {
    if (this.toolTip) {
      const mouseCoords = (d3v5.mouse(d3v5.event.currentTarget));
      // Calcualted the width based on the mouse event and chart width
      const width = (this.width / 100) * 98 > d3v5.event.layerX + 100 ? 200 : 150;
      if (super.isFirefox()) {
        // Calcualted the size based on the widget width and mouse event to adjust the tooltip
        const size = (this.width / 100) * 65 > d3v5.event.layerX + 100 ? d3v5.event.layerX : d3v5.event.layerX - 100;
        this.toolTip
          .style('top', d3v5.event.layerY + 'px')
          .style('left', d3v5.event.layerX + 'px')
          .style('width', size + 'px');
      } else {
        this.toolTip
          .style('top', mouseCoords[1] + this.radius + 40 + 'px')
          .style('left', `${mouseCoords[0] + this.radius + 30}px`)
          .style('width', this.width <= 520 ? 200 + 'px' : width + 'px');
      }
    }
  }


  addCenterText() {
    let htmlContent = `<div class="centerText">`;
    htmlContent += `<h2>${this.total} ${this.chartData.unit}</h2>`;
    htmlContent += `<small style="text-transform: uppercase;">Total Energy</small>`;

    this.gSvg
      .append('text')
      .attr('x', 0)
      .attr('y', -4)
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .text(`${this.total} ${this.chartData.unit}`)
      .attr('class', 'donutFirstLine');

    this.gSvg
      .append('text')
      .attr('x', 0)
      .attr('y', +16)
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .text(`Total ${this.chartData.category || ''}`)
      .attr('class', 'donutSecondLine');
  }

}
