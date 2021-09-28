// import * as d3 from 'd3';
declare const d3v5: any;

import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { BaseChartComponent } from '../common/base-chart.component';
import { ChartService } from '../../../services/chart.service';

@Component({
  selector: 'puc-reference-line-chart',
  template: '',
  styleUrls: ['./reference-line-chart.component.scss']
})
export class ReferenceLineChartComponent extends BaseChartComponent implements OnInit {

  eventRect;
  @Input() isDebug = false;

  constructor(chartElement: ElementRef, public chartService: ChartService) {
    super(chartElement);
    this.margin = { top: 10, right: 10, bottom: 20, left: 50 };
  }

  ngOnInit(): void {
  }


  public addPointerEventsRect() {
    const self = this;

    this.eventRect = this.gSvg.append('rect') // this.gSvg.append('rect')
      .attr('transform', `translate( ${this.margin.left}, ${this.margin.top})`)
      .attr('width', this.chartWidth)
      .attr('height', this.chartHeight)
      .attr('fill', 'none')
      .attr('class', 'hover-region')
      .attr('pointer-events', 'all')

      .on('mouseover', _ => self.mouseOver())
      .on('mousemove', d => self.mouseMove())
      .on('mouseleave', _ => self.mouseLeave(self));
    this.addReferenceLine();
  }


  mouseOver() {
    if (this.toolTip) {
      this.toolTip
        .style('opacity', .84)
        .style('visibility', 'visible');

      this.referenceLine
        .style('opacity', .84)
        .style('visibility', 'visible');
    }
  }


  mouseMove() {
    if (this.toolTip) {
      const tooltipData = [];

      // d3.mouse - converts the global coordinates into the local ones.
      const mouseCoords = (d3v5.mouse(d3v5.event.currentTarget));
      // console.log(mouseCoords);

      // adding margin left to the mouse coords, since the xScale starts at that value
      const xPosition = this.xScale.invert(mouseCoords[0] + this.margin.left + 5);
      // const yPosition = this.yScale.invert(mouseCoords[1]);

      // The closest element is the element to the right
      const closestElement = d3v5.bisectLeft(this.chartData.readings.map(reading => reading.index), xPosition, 1);

      // const d0 = this.chartData.readings[closestElement === 0 ? 0 : closestElement - 1];
      // const d1 = this.chartData.readings[closestElement];

      const d = this.chartData.readings[closestElement === 0 ? 0 : closestElement - 1];
      // const inclinationAway = Math.abs(xPosition - Math.floor(xPosition));

      // if (this.isDebug) {
      //   console.log(mouseCoords, this.chartWidth, xPosition, closestElement, d);
      // }

      for (const column of this.chartData.columns) {

        // const readingDiff = d1[column] - d0[column];

        // const value = inclinationAway === 0 ? ((d1[column] != null && d1[column] >= 0) ? +d1[column].toFixed(2) : null)
        //   : ((d0[column] != null && d0[column] >= 0) ? +(d0[column]).toFixed(2) : null);

        // const value = (+d[column] || 0).toFixed(2);
        const value = (d[column] != null && d[column] >= 0) ? +(d[column]).toFixed(2) : null;

        tooltipData.push({
          column,
          name: this.chartData.mappings[column],
          value
        });
      }

      // console.log(tooltipData);
      const xValDate = this.chartService.getXValDate(this.chartData.groupBy, d);

      let htmlContent = `<ul class="chartToolTip toolTipList">`;
      htmlContent = xValDate !== '' ? htmlContent + `<li>@ ${xValDate}</li>` : htmlContent

      tooltipData.map(row => {
        htmlContent += `<li style = "color : ${this.colorSet[row.column]}">
        ${row.name} &nbsp; <b>${(row.value || row.value == 0) ? row.value : '--'}  ${this.chartData.unit} </b></li>`;
      });
      htmlContent += '</ul>';

      this.toolTip
        .html(htmlContent);
      if (super.isFirefox()) {
        // Calcualted the size based on the widget width and mouse event to adjust the tooltip
        const size = (this.width / 100) * 65 > d3v5.event.layerX + 100 ? d3v5.event.layerX : d3v5.event.layerX - 200;
        this.toolTip
          .style('top', d3v5.event.layerY + 'px')
          .style('left', size + 'px');
      } else {
        if (closestElement > .64 * this.chartData.rows) {
          this.toolTip
            // .style('top', mouseCoords[1] - 10 + 'px')
            .style('top', `${this.margin.top + 10}px`)
            .style('left', mouseCoords[0] - 235 + 'px');
        } else {
          this.toolTip
            // .style('top', mouseCoords[1] - 10 + 'px')
            .style('top', `${this.margin.top + 10}px`)
            .style('left', `${mouseCoords[0] + this.margin.left + 15}px`);
        }
        this.referenceLine.attr('stroke', '#dedede')
          .attr('x1', this.xScale(Math.floor(xPosition)))
          .attr('x2', this.xScale(Math.floor(xPosition)))
          .attr('stroke-dasharray', '2.5')
          .attr('y1', `${this.margin.top}px`)
          .attr('y2', `${this.height - this.margin.bottom}px`);
      }
      // this.referenceLine
      //   .style('top', `${this.margin.top}px`)
      //   .style('left', `${mouseCoords[0] + this.margin.left - 2}px`);
    }
  }


  mouseLeave(self) {
    if (this.toolTip) {
      this.toolTip
        .style('visibility', 'hidden');

      this.referenceLine
        .style('visibility', 'hidden');
    }
    if (this.referenceLine) {
      this.referenceLine.attr('stroke', 'none');
    }
  }

  setReferenceLine() {


  }
  addReferenceLine() {
    this.referenceLine = this.gSvg
      .append('line');
  }

}
