// import * as d3 from 'd3';
declare const d3v5: any;

import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit } from '@angular/core';

import { BaseChartComponent } from '../common/base-chart.component';
import { ChartService } from '../../../services/chart.service';
import { IAreaChart } from '../../../models/IAreaChart';
import { ReferenceLineChartComponent } from '../reference-line-chart/reference-line-chart.component';

@Component({
    selector: 'puc-area-chart',
    templateUrl: './area-chart.component.html',
    styleUrls: ['./area-chart.component.scss']
})
export class AreaChartComponent extends ReferenceLineChartComponent implements OnInit {

    @Input() editClass;

    chartData: IAreaChart;
    stackedValues: Array<any>;

    curve = d3v5.curveLinear;
    area;
    yTicks = 4;
    eventRect;

    randomClassName;

    constructor(
        chartElement: ElementRef,
        chartService: ChartService,
        private cd: ChangeDetectorRef,
        private ngZone: NgZone) {
        super(chartElement, chartService);
        this.margin = { top: 10, right: 10, bottom: 20, left: 50 };
    }

    ngOnInit(): void {

    }


    private processData() {
        this.stackedValues = d3v5.stack().keys(this.chartData.columns)(this.chartData.readings);
        // console.log(this.stackedValues);
    }


    /***** Scales *********/
    setXScale() {
        const hasReadings = (this.chartData.readings && Array.isArray(this.chartData.readings) && this.chartData.readings.length) ?
            true : false;
        const startIdx = hasReadings ?
            this.chartData.readings[0].index : 0;
        const endIdx = hasReadings ?
            this.chartData.readings[this.chartData.readings.length - 1].index : 0;
        this.xScale = this.chartService.createScaleLinear(
            startIdx,
            endIdx,
            this.margin['left'] + 10,
            this.width - this.margin['right'] - 10);
    }

    setYScale() {
        const domain = this.getYDomain(this.stackedValues);
        const yTicksInfo = this.chartService.getSmartTicks(domain[1]);
        this.yTicks = yTicksInfo.count;
        // console.log(domain);

        this.yScale = this.chartService.createScaleLinear(
            domain[0], yTicksInfo.endPoint, this.height - this.margin['bottom'], this.margin['top']);
    }

    /***** Scales *********/


    createChart(): void {
        console.log('createChart - Area Chart');
        if (this.chartData && Object.keys(this.chartData).length) {

            this.cd.reattach();
            this.ngZone.runOutsideAngular(() => {
                this.processData();
                this.randomClassName = this.chartService.createRandomClassName('areaXAxisGroup');

                super.createChart();

                this.generateAreaCurves();
                this.addPointerEventsRect();

                this.cd.detectChanges();
                this.cd.detach();
            });
        }
    }


    private generateAreaCurves() {
        this.area = d3v5.area()
            .defined((d: any) => d[1] != null)
            .curve(this.curve)
            .x(d => this.xScale(d['data'].index))
            .y0(d => this.yScale(d[0]))
            // .y0(d => this.yScale(this.yDomain[0]))
            .y1(d => this.yScale(Number(d[1])));


        this.gSvg
            .selectAll('path')
            .data(this.stackedValues)
            .join('path')
            .attr('class', 'area-path')
            .attr('fill', data => this.getColor(data.key))
            .attr('stroke-width', .5)
            .style('stroke', '#FFF')
            .attr('d', this.area)
            .append('title')
            .text(data => data.key);
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
                    .tickFormat(_ => '')
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
            );

        this.setXTicks();
    }


    setXTicks() {
      const ticks = d3v5.selectAll(`.${this.randomClassName}.${this.editClass} .tick`);
      const isHourly = this.chartData.groupBy === 'hourly';
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
            .attr('text-anchor', 'end');
    }


    /**
     * readings
     * max of all the values across all of the stacked values
     */
    getYDomain(readings) {
        if (!readings) {
            return [0, 0];
        }
        const maxValue = d3v5.max(readings, dataByView => d3v5.max(dataByView, d => d[1]));
        return this.chartService.modifyMaxValueY(maxValue);
    }


    getColor(key) {
        console.log('get Color : ', key);
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

