// import * as d3 from 'd3';
declare const d3v5: any;

import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit } from '@angular/core';

import { ChartService } from '../../../services/chart.service';
import { IAreaChart } from '../../../models/IAreaChart';
import { ReferenceLineChartComponent } from '../reference-line-chart/reference-line-chart.component';

@Component({
    selector: 'puc-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent extends ReferenceLineChartComponent implements OnInit {

    @Input() editClass;

    chartData: IAreaChart;
    seriesData: Array<{ key: string, data: Array<{ index: number, value: number }> }>;

    yTicks = 4;

    paths;

    randomClassName;

    constructor(
        chartElement: ElementRef,
        chartService: ChartService,
        private cd: ChangeDetectorRef,
        private ngZone: NgZone) {
        super(chartElement, chartService);
        this.margin = { top: 10, right: 40, bottom: 60, left: 50 };
    }

    ngOnInit(): void {

    }


    private processData() {
        this.seriesData = this.chartData.columns.map(colName => {
            return {
                key: colName,
                data: this.chartData.readings.map(d => {
                    return {
                        index: d.index,
                        value: d[colName] === null ? null : +d[colName]
                    };
                })
            };
        });
    }


    /***** Scales *********/

    setXScale() {
        const hasReadings = (this.chartData.readings && Array.isArray(this.chartData.readings) && this.chartData.readings.length) ?
            true : false;
        const startIdx = hasReadings ?
            this.chartData.readings[0].index : 0;
        const endIdx = hasReadings ?
            this.chartData.readings[this.chartData.readings.length - 1].index : 0;
        this.xScale = this.chartService.createScaleLinearNotNice(
            startIdx,
            endIdx,
            this.margin['left'] + 10,
            this.width - this.margin['right'] - 10);
    }


    setYScale() {
        const domain = this.getYDomain(this.seriesData);
        const yTicksInfo = this.chartService.getSmartTicks(domain[1]);
        this.yTicks = yTicksInfo.count;
        // console.log(domain);

        this.yScale = this.chartService.createScaleLinear(
            domain[0], yTicksInfo.endPoint, this.height - this.margin['bottom'], this.margin['top']);
    }

    /***** Scales *********/


    createChart(): void {

        const self = this;

        console.log('createChart - Line Chart');
        if (this.chartData && Object.keys(this.chartData).length) {

            this.cd.reattach();
            this.ngZone.runOutsideAngular(() => {

                this.processData();
                this.randomClassName = this.chartService.createRandomClassName('lineXAxisGroup');

                super.createChart();

                this.generateLineData();
                this.addPointerEventsRect();

                this.cd.detectChanges();
                this.cd.detach();
            });
        }
    }


    private generateLineData() {
        const line = d3v5.line()
            .defined((d: any) => { return d.value != null })
            .x(d => this.xScale(d['index']))
            .y(d => this.yScale(Number(d['value'])));

        const lines = this.gSvg.selectAll('lines')
            .data(this.seriesData)
            .enter()
            .append('g')
            .attr('class', 'lineGroup');

        this.paths = lines.append('path')
            .attr('class', 'chartLine')
            .style('fill', 'none')
            .style('stroke', d => this.getColor(d.key))
            .attr('stroke-width', 1.5)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('d', d => line(d.data));

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
          .attr('class', `${this.randomClassName} ${this.editClass} axis axis--x`)
          .attr('transform', `translate( 0, ${this.height - this.margin['bottom']})`)
          .call(d3v5
              .axisBottom(this.xScale)
              .tickSize(6)
              .tickSizeOuter(0)
              .tickFormat((d: any) => {
                if (d % 1 === 0 && d < this.chartData.readings.length) {
                  return this.chartService.generateXLabel(this.chartData.groupBy, this.chartData.readings[d], d);
                }
              })
          )

      this.setXTicks();
    }


    setXTicks() {
      const ticks = d3v5.selectAll(`.${this.randomClassName}.${this.editClass} .tick`);
      const isHourly = this.chartData.groupBy && this.chartData.groupBy.toLowerCase() === 'hourly';
      ticks.each( function(_, i) {
        const currentTransform = d3v5.select(this).attr('transform');
        d3v5.select(this).attr('transform', `${currentTransform} rotate(${isHourly ? -45 : 0})`);
        d3v5.select(this).select('text').attr('text-anchor', isHourly ? 'end' : 'middle');
      });
    }


    plotYAxes() {
        this.svg.append('g')
            .attr('class', 'axis axis--y')
            .attr('transform', `translate( ${this.margin['left']}, 0)`)
            .call(d3v5
                .axisLeft(this.yScale)
                .tickSize(0)
                .ticks(this.yTicks)
                .tickFormat(d => d > 0 ? (d < 1 ? d3v5.format('')(d) : d3v5.format('.2s')(d)) + ' ' + this.chartData.unit : '')
            )
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end');
    }


    getYDomain(series) {
        if (!series) {
            return [0, 0];
        }

        const maxValue = d3v5.max(series, (s: any) => d3v5.max(s.data, d => d['value']));
        const minValue = d3v5.min(series, (s: any) => d3v5.min(s.data, d => d['value']));

        return this.chartService.modifyMaxValueY(maxValue, minValue);
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
    }

}
