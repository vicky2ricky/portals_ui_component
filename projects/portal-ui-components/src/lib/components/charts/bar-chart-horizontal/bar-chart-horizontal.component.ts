// import * as d3 from 'd3';
declare const d3v5: any;

import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { BaseChartComponent } from '../common/base-chart.component';
import { ChartService } from '../../../services/chart.service';
import { IBarChart } from '../../../models/IBarChart';

@Component({
    selector: 'puc-bar-chart-horizontal',
    templateUrl: './bar-chart-horizontal.component.html',
    styleUrls: ['./bar-chart-horizontal.component.scss']
})
export class BarChartHorizontalComponent extends BaseChartComponent implements OnInit {
    chartData: IBarChart;
    @Input() barWidth;
    xTicks = 4;
    stackedValues;

    randomClassName;

    constructor(chartElement: ElementRef, private chartService: ChartService) {
        super(chartElement);
        this.margin = { top: 10, right: 10, bottom: 20, left: 70 };
    }

    ngOnInit() {

    }

    processData() {
        this.stackedValues = d3v5.stack().keys(this.chartData.columns)(this.chartData.readings);
    }

    /* Scales */
    setXScale() {
        const domain = this.getXDomain(this.stackedValues);
        const xTicksInfo = this.chartService.getSmartTicks(domain[1]);
        this.xTicks = xTicksInfo.count;
        this.xScale = this.chartService.createScaleLinear(
            domain[0], xTicksInfo.endPoint, this.margin.left + 10, this.width - this.margin['right'] - 10);
    }

    setYScale() {
        this.yScale = this.chartService.createScaleBand(
            this.chartData.rows, this.height - this.margin['bottom'], this.margin['top'], 0.4);
    }
    /* ends */

    createChart(): void {
        console.log('createChart - Horizontal Bar Chart');
        if (this.chartData && Object.keys(this.chartData).length) {
            this.processData();
            this.randomClassName = this.chartService.createRandomClassName('bchYAxisGroup');

            super.createChart();
            this.generateBarData();
        }
    }

    getXDomain(readings) {
        let maxValue = (Array.isArray(readings) && readings.length) ?
            d3v5.max(readings, dataByParameter => d3v5.max(dataByParameter, d => d[1])) : 0;
        // if (maxValue > 1) {
        //     maxValue = Math.ceil(maxValue / 10) * 10
        // } else {
        //     maxValue = Math.ceil((maxValue + Number.EPSILON) * 10) / 10
        // }
        if (maxValue > 1) {
            if (maxValue < 10) {
                maxValue = Math.ceil(maxValue);
            } else {
                maxValue = Math.ceil(maxValue / 10) * 10;
            }
        } else {
            // maxValue = Math.ceil((maxValue + Number.EPSILON) * 10) / 10
            maxValue = Math.ceil(maxValue * 10) / 10
        }
        return [0, maxValue];
    }

    plotXAxes() {
        this.svg.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate( 0, ${this.height - this.margin['bottom']})`)
            .call(d3v5
                .axisBottom(this.xScale)
                .tickSize(6)
                .tickSizeOuter(0)
                .tickFormat(d => d > 0 ? (d < 1 ? d3v5.format('')(d) : d3v5.format('.2s')(d)) + ' ' + this.chartData.unit : ''))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end');
    }

    plotYAxes() {
        this.svg.append('g')
            .attr('class', `${this.randomClassName} axis axis--y`)
            .attr('transform', `translate( ${this.margin['left']}, 0)`)
            .call(d3v5
                .axisLeft(this.yScale)
                .tickSize(4)
                .tickSizeOuter(0)
                // .tickFormat((d: number) => (d % 6 === 0 || this.chartData.rows <= 6 || this.chartData.rows == (d - 1))
                //     ? this.chartData.labels[d] : '')
                .tickFormat(
                    (d: number) => {
                        if (d % 1 === 0 && d < this.chartData.rows) {
                            return this.chartService.generateXLabel(this.chartData.groupBy, this.chartData.readings[d], d);
                        }
                    })
            );

        this.addYTicks();
    }


    addYTicks() {
        this.chartService.addXTicks(
            `.${this.randomClassName} .tick`, this.chartData.groupBy, this.yScale.bandwidth(), this.chartData.rows, 0, 'bch');
    }

    private generateBarData(): void {
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
            .attr('x', (d: any) => this.xScale(d[0]))
            .attr('y', (_, i) => this.yScale(i))
            .attr('width', (d: any) => this.xScale(d[1]) - this.xScale(d[0]))
            .attr('height', this.yScale.bandwidth())
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
    }

    mouseOver(d, i, self) {
        if (this.toolTip) {
            // console.log(d, i);
            const columnData = this.chartData.readings[i];
            const xValDate = this.chartService.getXValDate(this.chartData.groupBy, columnData);

            let htmlContent = `<ul class="chartToolTip toolTipList">`;
            htmlContent = xValDate !== '' ? htmlContent + `<li>@ ${xValDate}</li>` : htmlContent

            const columns = (this.chartData &&
                this.chartData.columns &&
                Array.isArray(this.chartData.columns)) ? this.chartData.columns : [];
            for (const column of columns) {
                htmlContent += `<li style = "color : ${this.colorSet[column]}">
                ${this.chartData.mappings[column]} &nbsp;&nbsp; <b>${columnData[column] ? columnData[column] : '--'} ${this.chartData.unit} </b></li>`;
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
        if (this.toolTip) {
            const mouseCoords = (d3v5.mouse(d3v5.event.currentTarget));

            // Calcualted the size based on the widget width and mouse event to adjust the tooltip
            const size = (this.width / 100) * 65 > d3v5.event.layerX + 100 ? d3v5.event.layerX : d3v5.event.layerX - 200;
            if (super.isFirefox()) {
                this.toolTip
                    .style('top', d3v5.event.layerY + 'px')
                    .style('left', size + 'px');
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

}
