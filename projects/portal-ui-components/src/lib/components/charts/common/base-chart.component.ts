// import * as d3 from 'd3';
declare const d3v5: any;

import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'puc-base-chart',
    templateUrl: './base-chart.component.html',
})
export class BaseChartComponent implements OnInit, OnChanges {

    private _consumptionData;

    @Input()
    set consumptionData(data) {
        if (data) {
            this._consumptionData = data;
            this.chartData = data;
            this.update();
        }
    }

    get consumptionData() {
        return this._consumptionData;
    }

    @Input() view?: [number, number];

    @Input() margin?= { top: 32, right: 64, bottom: 24, left: 48 };

    chartData: any;

    // This is the area within which the chart will be rendered, and is calculated
    width;
    height;

    @Input() animations = true;
    @Input() baseChartClass;

    // These are the dimensions of the chart
    @Input() chartWidth;
    @Input() chartHeight;

    @Input() colorSet;

    hostElement; // Native element hosting the SVG container
    svg; // Top level SVG element
    gSvg; // SVG Group element

    xScale;
    yScale;

    @Input() xAxis = true;
    @Input() yAxis = true;

    toolTip;
    referenceLine;

    @Input() showTooltip = true;

    constructor(protected chartElement: ElementRef) {
        this.hostElement = this.chartElement.nativeElement;
    }


    ngOnInit(): void {
    }


    ngOnChanges(changes: SimpleChanges): void {
        console.log('Base Chart - OnChanges');
        // console.log(changes.consumptionData);

        // console.log(changes);
        if (!(changes && changes.tooltipInfo)
            || !(changes.hasOwnProperty('tooltipInfo'))
            || changes.tooltipInfo?.currentValue?.size === 0) { // Affects trend line charts
            if (changes.consumptionData) {
                this.chartData = changes.consumptionData.currentValue;
            }
            this.update();
        }
    }


    update(): void {

        if (this.view) {
            this.chartWidth = this.view[0];
            this.chartHeight = this.view[1];
        }

        // default values if width or height are 0 or undefined
        if (!this.chartWidth) {
            this.chartWidth = 600;
        }

        if (!this.chartHeight) {
            this.chartHeight = 200;
        }

        this.chartWidth = Math.floor(this.chartWidth);
        this.chartHeight = Math.floor(this.chartHeight);

        this.computeWidth();
        this.computeHeight();

        if (this.chartData) {
            this.createChart();
        }
    }


    computeWidth() {
        this.width = this.chartWidth + (this.margin['left'] + this.margin['right']);
    }


    computeHeight() {
        this.height = this.chartHeight + (this.margin['top'] + this.margin['bottom']);
    }


    /**
     * Remove the existing chart, creates a new one,
     * set up the scales, based on the processed data,
     * adds Gridlines,
     * sets up the axes,
     * and adds the group element which houses the chart
     *
     * Each of the chart which inherits from the base chart - will give separate implementations
     * of these functions
     */
    createChart(setTooltip = true): void {

        console.log('Base Chart - createChart function');
        if (this.chartData && Object.keys(this.chartData).length) {

            this.removeExistingChartFromParent();
            this.setupChart();

            this.setXScale();
            this.setYScale();

            this.addGridLines();

            if (this.xAxis) {
                this.plotXAxes();
            }
            if (this.yAxis) {
                this.plotYAxes();
            }

            this.addGraphicsElement();

            if (setTooltip) {
                if (this.showTooltip) {
                    this.setToolTip();
                }

                this.setReferenceLine();
            }
        }
    }


    removeExistingChartFromParent() {
        d3v5.select(this.hostElement).select('.content').select('svg').remove();
        d3v5.select(this.hostElement).select('.content').selectAll('div').remove();
    }


    setupChart() {
        this.svg = d3v5.select(this.hostElement).select('.content').append('svg')
            // .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .attr('class', this.baseChartClass)
            .attr('width', this.width)
            .attr('height', this.height);
    }


    addGraphicsElement() {
        this.gSvg = this.svg.append('g').attr('transform', 'translate(' + this.margin['left'] / 2 + ',' + this.margin['top'] + ')');
    }


    setToolTip() {
        d3v5.select(this.hostElement).select(`.${this.baseChartClass}ToolTip`).remove();
        this.toolTip = d3v5.select(this.hostElement).select('.content')
            .append('div')
            .style('visibility', 'hidden')
            .style('position', 'absolute')
            // .attr('class', 'toolTip');
            .attr('class', `${this.baseChartClass}ToolTip tooltip-container`);
    }


    setReferenceLine() {
        this.referenceLine = d3v5.select(this.hostElement).select('.content')
            .append('div')
            .style('visibility', 'hidden')
            .style('height', `${this.chartHeight}px`)

            .attr('class', `referenceViewLine`);
    }


    setXScale() { }
    setYScale() { }
    addGridLines() { }
    plotXAxes() { }
    plotYAxes() { }


    mouseOver(d, index, self) { }


    mouseMove(d, i, self, type?) {
        const mouseCoords = (d3v5.mouse(d3v5.event.currentTarget));
        this.toolTip
            .style('top', mouseCoords[1] + 'px')
            .style('left', `${mouseCoords[0] + 10}px`);
    }


    mouseLeave(d, self) {
        if (this.toolTip) {
            this.toolTip
                .style('opacity', 0)
                .style('visibility', 'hidden');
        }
    }

    // To validate the browser type
    isFirefox() {
        const agent = window.navigator.userAgent.toLowerCase();
        return agent.indexOf('firefox') > -1 ? true : false;
    }

}
