// import * as d3 from 'd3';
declare const d3v5: any;

import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { ArrayUtil } from '../../../utils';
import { BaseChartComponent } from '../common/base-chart.component';
import { ChartService } from '../../../services/chart.service';
import { IHeatmapChart } from '../../../models/IHeatmapChart';
import { round } from 'lodash-es';
import sortBy from 'lodash-es/sortBy';

@Component({
    selector: 'puc-heatmap-chart',
    templateUrl: './heatmap-chart.component.html',
    styleUrls: ['./heatmap-chart.component.scss']
})
export class HeatmapChartComponent extends BaseChartComponent implements OnInit {

    @Input() editClass;
    chartData: IHeatmapChart;

    @Input() showAggregate = false;
    @Input() colorArray;
    // @Input() notApplicableColor;

    seriesData: Array<any> = [];

    maxValue: any = 0;
    colorScale;
    noValColor: any;

    randomClassName;

    aggregateNormalSubtraction = 100;
    aggregateHourlySubtraction = 80;

    constructor(chartElement: ElementRef,
        private chartService: ChartService,
    ) {
        super(chartElement)
        this.margin = { top: 10, right: 10, bottom: 20, left: 60 };
    }


    ngOnInit(): void {
    }


    private processData() {
        const keys = (this.chartData && this.chartData.columns) ? this.chartData.columns : [];
        if (this.chartData.readings && Array.isArray(this.chartData.readings) && this.chartData.readings.length) {
            this.seriesData = this.chartData.readings.map((row) => {
                for (const key of Object.keys(row)) {
                    if (keys.indexOf(key) > -1) {
                        row['value'] = row[key];
                    }
                }
                return row;
            });
        } else {
            this.seriesData = [];
        }
    }


    getMaxValue(series) {
        if (!series || (Array.isArray(series) && series.length === 0)) {
            return 0;
        } else {
            const maxValue = d3v5.max(series, (d: any) => +d.value);
            return maxValue;
        }
    }


    /***** Scales *********/

    setXScale() {
        const domain = this.chartData.labels;
        const chartWidth = (this.showAggregate) ? this.chartWidth - 100 : this.chartWidth;
        this.xScale = this.chartService.createScaleBand(domain, 0, chartWidth).padding(0.1);
        // this.xScale = this.chartService.createScaleBand(this.chartData.rows, 0, chartWidth).padding(0.1);
    }


    setYScale() {
        const names = sortBy(this.seriesData, 'name').map((item) => item['name'] + ':' + item['id']);
        const chartHeight = (this.showAggregate) ? this.chartHeight - 100 : this.chartHeight;
        this.yScale = this.chartService.createScaleBand(names, 0, chartHeight).padding(0.1);
    }


    generateColorScale() {
        this.maxValue = this.getMaxValue(this.seriesData);
        // const heatmapColor = this.getColor(this.chartData.columns[0]);
        // const rgbColor = this.colorService.hexTorgb(heatmapColor);
        // const colorArray = this.colorService.generateOpacityArray(rgbColor, .15, 7).reverse();
        // this.noValColor = this.notApplicableColor;
        // colorArray.splice(0,1);
        this.colorScale = d3v5.scaleQuantize()
            .domain([0, this.maxValue])
            .range(this.colorArray);
    }

    /***** Scales *********/


    createChart(): void {
        console.log('createChart - Heatmap Chart');
        if (this.chartData && Object.keys(this.chartData).length) {
            this.processData();
            this.randomClassName = this.chartService.createRandomClassName('heatmapXAxisGroup');

            if (this.colorArray) {
                super.createChart();
                this.generateColorScale();
                this.generateHeatmap();
            }
        }
    }


    setReferenceLine() {
    }


    addGraphicsElement() {
        const transformX = this.xAxis ? this.margin.left : 0;
        this.gSvg = this.svg.append('g').attr('transform', `translate(${transformX},0)`);
    }


    private generateHeatmap(): void {
        if (this.showAggregate) {
            this.generateHorizontalBar();
            this.generateVerticalBar();
        }
        this.generateHeatmapCells();

    }


    getTotal(data) {
        return data.reduce((sum, it) => sum += it.value ? Number(it.value) : 0, 0);
    }



    getCellColor(val) {
        // if (val === 0) {
        //     return this.noValColor;
        // } else {
        return this.colorScale(val);
        // }
    }


    generateHeatmapCells() {
        this.gSvg.selectAll()
            .data(this.seriesData)
            .enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('x', (d) => this.xScale(d.key))
            .attr('y', (d) => this.yScale(d.name + ':' + d.id))
            .attr('width', this.xScale.bandwidth())
            .attr('height', this.yScale.bandwidth())
            .style('fill', (d) => this.getCellColor(d.value))
            .on('mouseover', (d, i) => this.mouseOverOnCell(d, i, this))
            .on('mousemove', (d, i) => this.mouseMoveOnCell(d, i, this))
            .on('mouseleave', (d, i) => this.mouseLeaveOnCell(d, this))
    }


    generateVerticalBar() {
        const verticalData = this.generateVerticaldata();
        const maxVal = this.getMaxValue(verticalData);
        const domain = verticalData.map(d => d.key);
        const chartWidth = (this.showAggregate) ? this.chartWidth - 100 : this.chartWidth;
        // const chartHeight = (this.showAggregate) ? this.chartHeight - 100 : this.chartHeight;
        const chartHeight = (this.showAggregate) ? this.chartHeight - (this.chartData.groupBy === 'hourly' ? 70 : 100) : this.chartHeight;
        const x: any = this.chartService.createScaleBand(domain, 0, chartWidth).padding(0.1);

        this.gSvg
            .append('g')
            .attr('class', 'vertical-bar-group')
            .attr('transform', 'translate(' + 0 + ',' + Number(chartHeight + ((this.xAxis) ? 20 : 0)) + ')')
            .selectAll('.bar')
            .data(verticalData)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', (d: any) => x(d.key))
            .attr('y', this.yScale(0))
            .attr('width', this.xScale.bandwidth())
            .attr('height', (d: any) => (d.value / maxVal) * 100)
            .attr('fill', d => '#ddd')
            .on('mouseover', (d, i) => this.mouseOverBar(d, i, this, 'vertical'))
            .on('mousemove', (d, i) => this.mouseMove(d, i, this, 'vertical'))
            .on('mouseleave', (d, i) => this.mouseLeave(d, this));
    }


    generateHorizontalBar() {
        const horiZontalData = sortBy(this.generateHorizontaldata(), 'key');
        const domain = horiZontalData.map((d) => d.id);
        const chartWidth = (this.chartWidth) ? this.chartWidth - 100 : this.chartWidth;
        const chartHeight = (this.showAggregate) ? this.chartHeight - 100 : this.chartHeight;
        const y = this.chartService.createScaleBand(domain, 0, chartHeight).padding(0.1);
        const maxVal = this.getMaxValue(horiZontalData);
        this.gSvg
            .append('g')
            .attr('class', 'horizontal-bar-group')
            .attr('transform', 'translate(' + chartWidth + ',' + 0 + ')')
            .attr('width', 100)
            .selectAll('.bar')
            .data(horiZontalData)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('y', (d: any) => y(d.id))
            .attr('width', (d: any) => (d.value / maxVal) * 100)
            .attr('height', this.yScale.bandwidth())
            .style('fill', (d: any) => {
                return '#ddd';
            })
            .on('mouseover', (d, i) => this.mouseOverBar(d, i, this, 'horizontal'))
            .on('mousemove', (d, i) => this.mouseMove(d, i, this, 'horizontal'))
            .on('mouseleave', (d, i) => this.mouseLeave(d, this));
    }


    generateHorizontaldata() {
        const res = [];
        const obj = ArrayUtil.groupBy(this.seriesData, 'id');
        const values = Object.values(obj);
        for (const data of values) {
            const newObj = {
                key: data[0]['name'],
                id: data[0]['id'],
                value: this.getTotal(data)
            };
            res.push(newObj);
        }
        return res;
    }


    generateVerticaldata() {
        const res = [];
        const obj = ArrayUtil.groupBy(this.seriesData, 'key');
        const values = Object.values(obj);
        for (const data of values) {
            const newObj = {};
            newObj['key'] = data[0]['key'];
            newObj['date'] = data[0]['date'];
            newObj['value'] = this.getTotal(data);
            res.push(newObj);
        }
        return res;
    }


    plotXAxes() {
        // const transformX = (this.xAxis) ? this.margin.left : 0;
        const transformX = (this.xAxis) ? 0 : 0;
        // const chartHeight = (this.showAggregate) ? this.chartHeight - 100 : this.chartHeight;
        const chartHeight = (this.showAggregate) ? this.chartHeight - 100 : this.chartHeight;
        this.svg.append('g')
            .attr('class', `axis axis--x ${this.randomClassName} heatmap no-visibility`)
            .attr('transform', `translate(${transformX}, ${chartHeight})`)
            .call(d3v5
                .axisBottom(this.xScale)
                .tickSize(6)
                .tickSizeOuter(0)
                .tickFormat(
                    (d: number, i) => {
                        const indexToUse = i * this.chartData.groupCount;
                        if (indexToUse <= this.chartData.rows) {
                            return this.chartService.generateXLabel(
                              this.chartData.groupBy, this.chartData.readings[indexToUse], indexToUse);
                        }
                    })
            )

        this.addXTicks();
    }


    addXTicks() {
        this.chartService.addXTicks(
            `.${this.randomClassName} .tick`, this.chartData.groupBy,
            this.xScale.bandwidth(), Math.floor(this.chartData.rows / this.chartData.groupCount), -55, 'heatmap')
    }


    plotYAxes() {
        const transformX = (this.yAxis) ? this.margin.left - 6 : 0;
        this.svg.append('g')
            .attr('class', `axis axis--y ${this.randomClassName}`)
            .attr('transform', `translate( ${transformX}, 0)`)
            .call(d3v5.axisLeft(this.yScale)
                .tickSize(0)
                .ticks(5)
                .tickFormat((d: any) => {
                    const text = (d.includes(':') ? d.split(':')[0] : d);
                    return text;
                })
            )
            .selectAll('text')
            // .attr('y', 0)
            // .attr('x', 9)
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-90)')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')

        // Instead of plotting the Y axis, we would be adding text separately
        // const textG = this.svg.append('g')
        //   .attr('transform', `translate( ${transformX}, 0)`);

        // textG.append('text')
        //   .attr('x', 0)
        //   .attr('y', -4)
        //   .attr('alignment-baseline', 'middle')
        //   .attr('text-anchor', 'middle')
        //   .text(`${this.total} ${this.chartData.unit}`)
        //   .attr('class', 'donutFirstLine');

        // this.gSvg
        //   .append('text')
        //   .attr('x', 0)
        //   .attr('y', +16)
        //   .attr('alignment-baseline', 'middle')
        //   .attr('text-anchor', 'middle')
        //   .text(`Total ${this.chartData.category || ''}`)
        //   .attr('class', 'donutSecondLine');
    }

    mouseOverBar(d, i, self, type) {
        if (this.toolTip) {

            let htmlContent = '';
            if (type === 'vertical') {
                const xValDate = this.chartService.getXValDate(this.chartData.groupBy, { date: d.date });
                htmlContent = `<div class="chartToolTip">`;
                htmlContent = xValDate !== '' ? htmlContent + `<div>@ ${xValDate}</div>` : htmlContent
            } else {
                htmlContent = `<div class="chartToolTip">`;
            }

            htmlContent += `<div> Total ${this.chartData.category ? this.chartData.category : ''} <b> ${(d.value || d.value == 0) ? round(d.value, 2) : '--'}  ${this.chartData.unit} </b></div>`;
            htmlContent += '</div>';
            d3v5.select(d3v5.event.currentTarget)
                .style('fill', this.getCellColor(d.value));

            //    d3v5.select(self).style("fill", "red");

            this.toolTip
                .style('opacity', .88)
                .style('visibility', 'visible')
                .style('z-index', 110)
                .html(htmlContent);
        }
    }

    mouseMove(d, i, self, type) {
        if (this.toolTip) {
            const mouseCoords = (d3v5.mouse(d3v5.event.currentTarget));
            if (type === 'vertical') {
                if (i > .64 * (this.seriesData.length / this.chartData.groupCount)) {  // Since there are double the number of entries
                    this.toolTip
                        .style('top', `${mouseCoords[1] + (type === 'vertical' ? (this.chartHeight) / 2 : 0) + 10}` + 'px')
                        // .style('left', `${mouseCoords[0] + this.margin.left + this.yScale.bandwidth() - 235}px`);
                        .style('left', `${mouseCoords[0] + this.margin.left - 235}px`);

                } else {
                    this.toolTip
                        .style('top', `${mouseCoords[1] + (type === 'vertical' ? (this.chartHeight) / 2 : 0) + 10}` + 'px')
                        // .style('left', `${mouseCoords[0] + this.margin.left + this.yScale.bandwidth()}px`);
                        .style('left', `${mouseCoords[0] + this.margin.left + this.yScale.bandwidth() / 2}px`);
                }
            } else {
                this.toolTip
                    .style('top', `${mouseCoords[1] - 10}` + 'px')
                    .style('left', `${(type == 'horizontal' ? (this.chartWidth - 250 - this.margin.left) :
                        (mouseCoords[0] + this.margin.left + this.yScale.bandwidth()))}px`);
            }

        }
    }

    mouseLeave(d, self) {
        if (this.toolTip) {
            d3v5.select(d3v5.event.currentTarget)
                .style('fill', '#ddd');
            this.toolTip
                .style('opacity', 0)
                .style('visibility', 'hidden');
        }
    }

    mouseOverOnCell(d, i, self) {
        if (this.toolTip) {

            const rowData = this.chartData.readings[i];
            const xValDate = this.chartService.getXValDate(this.chartData.groupBy, rowData);

            let htmlContent = `<ul class="chartToolTip toolTipList">`;
            const additionalText = d.name !== d.siteName ? `[ ${d.name}, ${d.siteName} ]` : '';
            htmlContent = xValDate !== '' ? htmlContent + `<li>@ ${xValDate} ${additionalText}</li>` : htmlContent

            const columns = (this.chartData &&
                this.chartData.columns &&
                Array.isArray(this.chartData.columns)) ? this.chartData.columns : [];

            // htmlContent += `<li> ${d.name}, <b> ${d.siteName} </b></li>`;
            for (const column of columns) {
                htmlContent += `<li style = "color : ${this.getCellColor(this.maxValue)}"> ${this.chartData.mappings[column]} &nbsp;&nbsp; <b>${(d.value || d.value == 0) ? round(d.value, 2) : '--'}  ${this.chartData.unit} </b></li>`;
            }
            htmlContent += '</ul>';
            this.toolTip
                .style('opacity', .88)
                .style('visibility', 'visible')
                .style('z-index', 110)
                .html(htmlContent);
        }
    }

    mouseMoveOnCell(d, i, self) {
        if (this.toolTip) {
            const mouseCoords = (d3v5.mouse(d3v5.event.currentTarget));
            // Calcualted the size based on the widget width and mouse event to adjust the tooltip
            const size = (this.width / 100) * 65 > d3v5.event.layerX + 100 ? d3v5.event.layerX : d3v5.event.layerX - 250;
            if (super.isFirefox()) {
                this.toolTip
                    .style('top', d3v5.event.layerY + 'px')
                    .style('left', size + 'px');
            } else {
                if (i > .64 * this.seriesData.length) {
                    this.toolTip
                        .style('top', mouseCoords[1] + 10 + 'px')
                        .style('left', mouseCoords[0] + this.margin.left + 15 - 235 + 'px');
                } else {
                    this.toolTip
                        .style('top', mouseCoords[1] + 10 + 'px')
                        .style('left', `${mouseCoords[0] + this.margin.left + 15}px`);
                }
            }
        }
    }

    mouseLeaveOnCell(d, self) {
        if (this.toolTip) {
            this.toolTip
                .style('opacity', 0)
                .style('visibility', 'hidden');
        }
    }
}
