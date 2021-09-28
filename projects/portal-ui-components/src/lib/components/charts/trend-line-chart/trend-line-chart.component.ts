// import 'moment-timezone';
// import * as moment from 'moment';

import * as moment from 'moment-timezone';

import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { flatten, reject, round } from 'lodash-es';

import { BaseChartComponent } from '../common/base-chart.component';
import { ChartService } from '../../../services/chart.service';

// import * as d3 from 'd3';

declare const d3v5: any;


@Component({
    selector: 'puc-trend-line-chart',
    templateUrl: './trend-line-chart.component.html',
    styleUrls: ['./trend-line-chart.component.scss']
})
export class TrendLineChartComponent extends BaseChartComponent implements OnInit {

    curve = d3v5.curveLinear;
    area;
    chartData: any;
    yTicks = 4;
    barPadding = 0.4;
    paths;
    eventRect;
    charts: Array<any> = [];
    dispatch: any = d3v5.dispatch('mymousemove', 'mymouseover', 'mymouseleave');
    referenceLines: any = {};

    timezone;

    previousDate;
    isDayDisplayed = false;

    @Input() withinHeatmap? = false;

    @Input() hasAccordian = false;
    @Input() hasGlobalLevelMouseEvents = false;
    @Input() tooltipInfo: Map<string, any> = new Map<string, any>();

    stepVal: any = 1;
    accordionHeaderStyle: any = {
        secondLevel: {
            'font-size': '0.8rem',
            margin: '2px 0',
            'font-weight': '500',
            color: '#231f20',
            'text-transform': 'capitalize',
        },
    };

    yDomain = [0, 0];

    noDataTemplate = `
      <div class="warningDiv">
        <i class="fas fa-exclamation-triangle warningIcon"></i>
        <div class="m-l-12">
          <div>No data exists for this time period</div>
        </div>
      </div>
    `

    minHeightToUseByEquip = 240;
    minHeightToUseSingle = 120;

    constructor(chartElement: ElementRef, private chartService: ChartService,
    ) {
        super(chartElement);
        this.margin = { top: 10, right: 40, bottom: 20, left: 50 };
    }


    ngOnInit(): void {
        // this.dispatch = d3.dispatch('mymousemove');
    }


    private processData() {
      return new Promise((resolve) => {
          const data = (this.chartData && this.chartData.charts && Array.isArray(this.chartData.charts)) ?
              this.chartData.charts : [];
          this.stepVal = this.getStepVal();
          this.charts = Array.from(data);

          const timezones = [];
          if (this.charts.length > 0) {
            this.charts.forEach(chart => chart.points.forEach(point => {
              if (point.timezone) {
                timezones.push(point.timezone);
                // const tz = point.timezone === moment.tz.guess(true) ? point.timezone : moment.tz.guess(true);
                // timezones.push(tz);
              }
            }))
          }

          if (timezones.length > 0) {
            const allTimezones = moment.tz.names();
            this.timezone = allTimezones.find(_timezone => _timezone.includes(timezones[0]));
          } else {
            this.timezone = moment.tz.guess(true);
          }

          console.log(this.timezone);
          resolve(true);
      });
  }

    private calculateChartHeight(pointConsolidationRule) {
      if (pointConsolidationRule === 'oneChart') {
        this.chartHeight = this.chartHeight - (this.margin.top + this.margin.bottom);
      } else {
        let calculatedHeight = Math.floor(this.chartHeight / this.consumptionData.charts.length);
        // Need to take the sideThings out
        calculatedHeight -= ( 48 + 16 + 5 + this.margin.top + this.margin.bottom );

        // If having taken out the extras, the remaining height is more than the minimums, keep it, else min it to the minimum
        if (pointConsolidationRule === 'chartPerEquip') {
          let heightToUseEquip = this.minHeightToUseByEquip;
          if (this.withinHeatmap) {
            // Check for the number of points, for individual charts, but by default bring it to half
            heightToUseEquip = 120;
            this.chartHeight = heightToUseEquip;
          } else {
            this.chartHeight = calculatedHeight < heightToUseEquip ? heightToUseEquip : calculatedHeight;
          }
        } else {
          let heightToUseSingle = this.minHeightToUseSingle;
          if (this.withinHeatmap) {
            heightToUseSingle = 60;
            this.chartHeight = heightToUseSingle;
          } else {
            this.chartHeight = calculatedHeight < heightToUseSingle ? heightToUseSingle : calculatedHeight;
          }

          // this.chartHeight = calculatedHeight < heightToUseSingle ? heightToUseSingle : calculatedHeight;
        }
      }

      // subtracting the header height ( 48 ), its top margin ( 16 ) and 5 rogue px, along with the margin top and bottom,
      // which will be later added to get the height.
      console.log(this.chartHeight);
      this.computeHeight();
    }


    private calculateChartWidth() {
      // this.chartWidth -= (this.margin.left + this.margin.right);
      this.chartWidth -= (this.margin.left);
      this.computeWidth();
    }


    /***** Scales *********/

    setXScale() {
      this.xScale = d3v5.scaleLinear()
        .domain([new Date(this.chartData.startDate).valueOf(), new Date(this.chartData.endDate).valueOf()])
        .range([this.margin['left'] + 8, this.width - this.margin['right'] - 8]);
        // .range([this.margin['left'], this.width - this.margin['right']]);

      console.log(this.xScale.domain());
    }

    setSvgYScale(data, height) {
        const domain = this.getYDomain(data);
        console.log('TrendChart Domain : ', domain);
        this.yDomain = domain;
        return d3v5.scaleLinear()
          .range([height - this.margin['bottom'], this.margin['top']])
          .domain([domain[0], domain[1]]).nice();
          // .rangeRound([this.height - this.margin['bottom'], this.margin['top']]).nice();
    }

    setYScale() {
    }

    /***** Scales *********/
    async createChart() {
        console.log('createChart - Trend chart Chart');
        if (this.chartData && Object.keys(this.chartData).length) {

          // First we calculate the height for each chart
          this.calculateChartHeight(this.chartData.pointConsolidationRule);
          this.calculateChartWidth();

          await this.processData();
          super.createChart(false);
          this.generateSvgs();
        }
    }


    flattenByPropery(array, property) {
      return flatten(
          array.map((rec) => {
              if (property) {
                  return Array.isArray(rec[property]) && rec[property].length > 0 ?
                      [].concat([], this.flattenByPropery(rec[property], property)) : rec;
              }
          }
          )
      );
    }


    // setSvgReferenceLine(id) {
    //     this.referenceLine[id] = d3v5.select(`#${id}`)
    //         .append('div')
    //         .style('visibility', 'hidden')
    //         .style('height', `${this.chartHeight}px`)

    //         .attr('class', `referenceViewLine`);
    // }


    mouseover(tooltip, referenceLine, _item) {
      const mouseCoords = d3v5.mouse(d3v5.event.currentTarget);
      // const x0 = this.getRoundedDate(new Date(this.xScale.invert(mouseCoords[0])), this.stepVal);

      const xPosition = this.xScale.invert(mouseCoords[0] + this.margin.left);
      const x0 = this.getRoundedDate(new Date(xPosition), this.stepVal);

      const itemPointsArray = _item['points'].filter(pointsItem => pointsItem.timePeriods.length > 0);
      const data = this.flattenByPropery(itemPointsArray, 'timePeriods');

      if (data.length > 0) {
        const momentDate = moment(x0).tz(this.timezone);
        if (momentDate.valueOf() < new Date(this.chartData.startDate).valueOf() ||
          momentDate.valueOf() > new Date(data[data.length - 1]['dateTime']).valueOf()) {
          return false;
        }

        if (this.showTooltip) {
            if (tooltip) {
                tooltip
                    .style('opacity', .84)
                    // .style('visibility', 'visible');
                    .style('display', 'inline-block');
            }
            if (referenceLine) {
                referenceLine
                    .style('opacity', .84)
                    // .style('visibility', 'visible');
                    .style('display', 'inline-block');
            }
        }
      }
    }

    mouseleave(tooltip, referenceLine) {
        if (this.showTooltip) {
          if (tooltip) {
            tooltip
              .style('display', 'none');
          }
        }
        if (referenceLine) {
          // referenceLine.attr('stroke', 'none');
          referenceLine.style('display', 'none');
        }
    }


    private getRoundedDate(date, minutes) {
        const ms = 1000 * 60 * minutes; // convert minutes to ms
        const roundedDate = new Date(Math.round(date.getTime() / ms) * ms);
        return roundedDate;
    }


    private getStepVal() {
        let stepVal = 1;
        // NOTE : the intervals is copied from haystack , any changes there will have to be reflected here too
        const start: any = moment(this.chartData.startDate, 'YYYY-MM-DD');
        const end: any = moment(this.chartData.endDate, 'YYYY-MM-DD');
        const diff = end.diff(start, 'days');
        // Set the step val
        if (diff < 2) {
            stepVal = 1;
        } else if (diff >= 2 && diff < 15) {
            stepVal = 5;
        } else if (diff >= 15 && diff < 60) {
            stepVal = 15;
        } else if (diff >= 60) {
            stepVal = 60;
        }
        return stepVal;
    }


    mousemove(tooltip, referenceLine, _item) {
        const mouseCoords = d3v5.mouse(d3v5.event.currentTarget);
        // const x0 = this.getRoundedDate(new Date(this.xScale.invert(mouseCoords[0])), this.stepVal);

        const xPosition = this.xScale.invert(mouseCoords[0] + this.margin.left);
        const x0 = this.getRoundedDate(new Date(xPosition), this.stepVal);

        // this.xScale.invert(mouseCoords[0]);
        // const bisectDate = d3v5.bisector(function (d) { return d['dateTime']; }).left;

        const itemPointsArray = _item['points'].filter(pointsItem => pointsItem.timePeriods.length > 0);

        const data = this.flattenByPropery(itemPointsArray, 'timePeriods');
        if (data.length > 0) {
          const i = d3v5.bisectLeft(data.map((row) => new Date(row['dateTime']).valueOf()), new Date(x0).valueOf(), 1);
          const d0 = data[i - 1];
          const d1 = data[i];

          const momentDate = moment(x0).tz(this.timezone);
          if (momentDate.valueOf() < new Date(this.chartData.startDate).valueOf() ||
            momentDate.valueOf() > new Date(data[data.length - 1]['dateTime']).valueOf()) {
            return false;
          }

          const xValDt = momentDate.format('ddd MMM DD, YYYY hh:mm a');

          const d = (d1 && d0) ?
              ((new Date(x0).valueOf() - new Date(d0['dateTime']).valueOf())
                  > (new Date(d1['dateTime']).valueOf() - new Date(x0).valueOf())) ? d1 : d0 : null;

          let htmlContent = `<ul class='chartToolTip trendToolTip toolTipList'><li>@ ${xValDt}</li>`;
          const ts = (d && d['dateTime']) ? new Date(d['dateTime']).valueOf() : null;
          // console.log(ts);

          let chartId;
          for (const item of _item['points']) {
              chartId = _item['chartId'];
              const chartToolTip: Map<string, any> = this.tooltipInfo.has(chartId) ? this.tooltipInfo.get(chartId) : '';
              // const ts = (d && d['dateTime']) ? new Date(d['dateTime']).valueOf() : '';
              const pointRef = item['pointRef'];
              const pointToolTip: Map<string, any> = (chartToolTip && chartToolTip.has(pointRef)) ? chartToolTip.get(pointRef) : '';
              const matchVal = pointToolTip[ts];
              // const matchVal = item['timePeriods'].find(val => {
              //     // round each timestamp (in millis) to the nearest minute
              //     const ts = Math.floor(new Date(val.ts).valueOf());
              //     return (d && ts === new Date(d['dateTime']).valueOf());
              // });
              htmlContent += `<li style = 'color : ${item.colorCode};'>  <label class='tooltipLabel'>${item.pointLabel}</label> : <b class='value'>${(matchVal && (matchVal.value || matchVal.value == 0)) ? matchVal.value : '--'} ${item.unit ? item.unit : ''} </b></li>`;
          }
          htmlContent += '</ul>';

          const firstDate = data[0];
          // const lastDate = data[data.length - 1];
          const lastDate = this.chartData.endDate;

          // console.log(`${chartId}`);
          // console.log(data);
          // console.log(lastDate['dateTime'], ts, firstDate['dateTime']);

          // So we have a ts and a lastDate & a firstDate -
          // const isCrossOver = ts !== null ? (( new Date(lastDate['dateTime']).valueOf() - new Date(ts).valueOf() )
          //   / ( new Date(lastDate['dateTime']).valueOf() - new Date(firstDate['dateTime']).valueOf() ) < .44) : false;

          const isCrossOver = ts !== null ? (( new Date(lastDate).valueOf() - new Date(ts).valueOf() )
          / ( new Date(lastDate).valueOf() - new Date(firstDate['dateTime']).valueOf() ) < .44) : false;

          // console.log(`${isCrossOver}`);

          if (ts) {
            if (isCrossOver) {
              tooltip
                .style('z-index', 110)
                .style('display', 'inline-block')
                // .style('top', `${this.margin.top + 10}px`)
                .style('top', `0px`)
                .style('left', mouseCoords[0] - 248 + 'px')
                .html(htmlContent);
            } else {
              tooltip
                .style('z-index', 110)
                .style('display', 'inline-block')
                // .style('top', `${this.margin.top + 10}px`)
                .style('top', `0px`)
                .style('left', `${mouseCoords[0] + this.margin.left + 15}px`)
                .html(htmlContent);
            }

            referenceLine
              .attr('x1', this.xScale(Math.floor(xPosition)))
              .attr('x2', this.xScale(Math.floor(xPosition)))
              .attr('stroke', '#dedede')
              .attr('stroke-dasharray', '2.5')
              .attr('y1', `${this.margin.top}px`)
              .attr('y2', `${this.height - this.margin.bottom}px`)
              .style('display', 'inline-block');
              // .style('top', `${this.margin.top}px`)
              // .style('left', `${mouseCoords[0] + this.margin.left - 2}px`);
          }
        }

    }

    generateTooltip(id) {
        return d3v5.select(`#${id}`)
            .append('div')
            // .style('visibility', 'hidden')
            .style('position', 'absolute')
            .attr('class', 'trendToolTip');
    }


    // generateReferenceLine(id) {
    //     return d3v5.select(`#${id}`)
    //         .append('div')
    //         .style('display', 'none')
    //         .style('height', `${this.chartHeight - this.margin['top']}px`)
    //         .attr('class', `referenceViewLine`);
    // }

    generateReferenceLine(svg) {
        return svg.append('line')
          // .attr('class', `referenceViewLine`)
          .attr('stroke', '#dedede')
          .attr('stroke-dasharray', '2.5');
    }


    addHoverRegion(svg) {
      const referenceLine = this.generateReferenceLine(svg);
      svg
        .append('rect')
        .attr('class', 'trendTooltipOverlay')
        .attr('transform', `translate( ${this.margin.left}, ${this.margin.top})`)
        .attr('width', this.chartWidth)
        // .attr('height', (this.height - this.margin.bottom))
        .attr('height', this.chartHeight)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseover', () => {
            if (this.hasGlobalLevelMouseEvents) {
                this.chartService.dispatch.call('mymouseover', this);
            } else {
                this.dispatch.call('mymouseover', this);
            }
        })
        .on('mouseleave', () => {
            if (this.hasGlobalLevelMouseEvents) {
                this.chartService.dispatch.call('mymouseleave', this);
            } else {
                this.dispatch.call('mymouseleave', this);
            }
        })
        .on('mousemove', () => {
            if (this.hasGlobalLevelMouseEvents) {
                this.chartService.dispatch.call('mymousemove', this);
            } else {
                this.dispatch.call('mymousemove', this);
            }
        });
      return referenceLine;
    }


    generateSvgs() {
      // this.width = this.width - 276;
      this.charts.forEach((_item) => {
          this.removeSvg(_item.chartId);

          const noDataExists =
            _item.points.every(currentPoint => !currentPoint.timePeriods || currentPoint.timePeriods.length === 0);
          if (noDataExists) {
            d3v5.select(`#${_item.chartId}`).html(this.noDataTemplate);

          } else {

            let heightToUse = this.height;
            if (this.chartData.pointConsolidationRule === 'chartPerEquip') {
              if (this.withinHeatmap && _item['points'].length < 10) {
                heightToUse = 90;
              }
            } else if (this.chartData.pointConsolidationRule === 'oneChart') {
              if (this.withinHeatmap && _item['points'].length < 10) {
                if (_item['points'].length === 1) {
                  heightToUse = 60;
                } else if (_item['points'].length < 5) {
                  heightToUse = 90;
                } else {
                  heightToUse = 160;
                }
              }
            }

            this.height = heightToUse;

            const svg = d3v5.select(`#${_item.chartId}`).append('svg')
            // .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .attr('class', 'trendlineData')
            .attr('width', this.width)
            // .attr('width', this.chartWidth)
            .attr('height', heightToUse);

            const yScale = this.setSvgYScale(_item['points'], heightToUse);
            if (this.xAxis) {
                this.plotSvgXAxes(svg);
            }
            if (this.yAxis) {
                this.plotSvgYAxes(svg, yScale, this.chartData.pointConsolidationRule);
            }
            this.addSvgGridLines(svg, yScale);

            const gSvg = svg.append('g').attr('transform', 'translate(' + 0 + ',' + 0 + ')');
            const tooltip = this.generateTooltip(_item.chartId);

            const opacity = (_item.points && Array.isArray(_item.points) && _item.points.length) ? 0.5 : 1;

            _item.points = this.sortPoints(_item.points);

            for (const item of _item.points) {
                switch (item.plotType) {
                    case 'solidLine':
                        this.generateLineData(gSvg, item, yScale);
                        break;
                    case 'lineArea':
                        this.generateAreaData(gSvg, item, yScale, opacity);
                        break;
                    case 'verticalBar':
                        this.generateVerticalData(gSvg, item, yScale, opacity);
                        break;
                    case 'dashedLine':
                        this.generateLineData(gSvg, item, yScale);
                        break;
                }
            }
            const referenceLine = this.addHoverRegion(gSvg);

            if (this.hasGlobalLevelMouseEvents) {
                this.chartService.dispatch.on('mymousemove.' + _item['chartId'], () => {
                    this.mousemove(tooltip, referenceLine, _item);
                });
                this.chartService.dispatch.on('mymouseover.' + _item['chartId'], () => {
                    this.mouseover(tooltip, referenceLine, _item);
                });
                this.chartService.dispatch.on('mymouseleave.' + _item['chartId'], () => {
                    this.mouseleave(tooltip, referenceLine);
                });
            } else {
                this.dispatch.on('mymousemove.' + _item['chartId'], () => {
                    this.mousemove(tooltip, referenceLine, _item);
                });
                this.dispatch.on('mymouseover.' + _item['chartId'], () => {
                    this.mouseover(tooltip, referenceLine, _item);
                });
                this.dispatch.on('mymouseleave.' + _item['chartId'], () => {
                    this.mouseleave(tooltip, referenceLine);
                });

            }

          }

      });

    }


    private generateLineData(svg, point, yscale) {

      // console.log(this.xScale.domain());
      // console.log(this.xScale.range());

      const line = d3v5.line()
          .defined((d: any) => d.value != null)
          .x((d, i) => {
              const stringValue = new Date(d['dateTime'].valueOf().toString());
              return this.xScale(stringValue);
          })
          .y(d => {
              return yscale(Number(d['value']));
          });

      // console.log('Line Data');
      const lines = svg.append('g')
          .selectAll('lines')
          .data([].concat(point))
          .enter()
          .append('g')
          .attr('class', 'lineGroup');
      const chartClass = point.plotType === 'dashedLine' ? 'dashed' : 'line';
      lines.append('path')
          .attr('class', chartClass)
          .style('fill', 'none')
          .style('stroke', d => d['colorCode'])
          .attr('stroke-width', 1.5)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('d', d => line(d.timePeriods));
    }


    private generateAreaData(svg, point, yScale, opacity) {
        const area = d3v5.area()
            .defined((d: any) => d.value != null)
            .curve(this.curve)
            .x((d) => {
                return this.xScale(new Date(d['dateTime'].valueOf().toString()));
            })
            // .y0(d => yScale(0))
            .y0(d => yScale(this.yDomain[0]))
            .y1(d => yScale(Number(d['value'])));

        svg.append('g')
            .selectAll('path')
            .data([].concat(point))
            .join('path')
            .attr('class', 'area')
            .attr('fill', d => d['colorCode'])
            .attr('stroke-width', .5)
            .style('stroke', '#FFF')
            .attr('d', d => area(d.timePeriods))
            .attr('opacity', opacity);
    }


    private generateVerticalData(svg, point, yScale, opacity) {
      // The domain should be divided across chartData.startDate and chartData.endDate,
      // With point['timePeriods'], the data is only for the time that exists.
      const domain = point['timePeriods'].map(tp => new Date(tp.dateTime).valueOf().toString());

      const applicableWidth = this.xScale(new Date(point['timePeriods'][point['timePeriods'].length - 1].dateTime).valueOf())
      console.log(' ApplicableWidth : ' , applicableWidth);

      // const localXScale = this.chartService.createScaleBand(
      //   domain, this.margin.left + 8, this.width - this.margin['right'] - 8, this.barPadding);

      const localXScale = this.chartService.createScaleBand(
        domain, this.margin.left + 8, round(applicableWidth,2), this.barPadding);

      const height = this.height - this.margin['bottom'];
      const data = reject(point['timePeriods'], ['value', null]);

      // console.log(localXScale.domain());
      // console.log(localXScale.range());

      svg
          .append('g')
          .selectAll('.bar')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', (d, i) => {
            const stringValue = new Date(d['dateTime']).valueOf().toString();
            return localXScale(stringValue);
          })
          .attr('width', localXScale.bandwidth())
          .attr('y', (d, i) => yScale(d.value))
          .attr('height', (d) => { const _height = height - yScale(d.value); return _height;})
          .attr('fill', () => point['colorCode'])
          .attr('opacity', opacity);
    }


    plotSvgXAxes(svg) {
        svg.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate( 0, ${this.height - this.margin['bottom']})`)
            .call(d3v5
                .axisBottom(this.xScale)
                .tickSize(6)
                .tickSizeOuter(0)
                .tickFormat((d: any, index: any) => {
                    const date = moment(d).tz(this.timezone);

                    let format = '';
                    if (date.date() !== this.previousDate?.date()) {
                      format = 'MMM DD';
                      this.isDayDisplayed = true;
                    } else if (this.isDayDisplayed) {
                      format = 'h a';
                    }

                    this.previousDate = date;
                    return date.format(format);
                })
            )
    }


    plotSvgYAxes(svg, yScale, pointConsolidationRule) {

      const yAxis = d3v5
        .axisLeft(yScale)
        .tickSize(0)
        // .tickFormat((d => d >= 0 ? d + ' ' + '' : ''))
        .tickFormat((d => d + ' '))

      // yAxis.tickValues(yScale.ticks(this.yTicks).concat( yScale.domain() ))
      yAxis.tickValues(yScale.ticks(pointConsolidationRule === 'chartPerPoint' ? 3 : this.yTicks));

      svg.append('g')
          .attr('class', 'axis axis--y')
          .attr('transform', `translate( ${this.margin['left']}, 0)`)
          .attr('pointer-events', 'none')
          .call(yAxis)
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '0.71em')
          .attr('text-anchor', 'end');
    }


    removeSvg(id) {
        d3v5.select('#' + id).select('svg').remove();
        // d3v5.select('#' + id).select('div.tooltipInfo').remove();
    }


    removeExistingChartFromParent() {
      d3v5.select(this.hostElement).selectAll('div.trendToolTip').remove();
      d3v5.select(this.hostElement).selectAll('div.referenceViewLine').remove();
    }


    addSvgGridLines(svg, yScale) {
        svg.append('g')
            .attr('class', 'chartGrid')
            .attr('transform', `translate( ${this.margin['left']}, 0)`)
            .call(
                this.make_y_gridlines(yScale)
                    .tickSize(-this.chartWidth)
                    .tickFormat((domain) => '')
            );
    }


    make_y_gridlines(yScale) {
        return d3v5.axisLeft(yScale)
            .ticks(this.yTicks);
    }


    addGridLines() {
    }

    setupChart() {
    }


    plotXAxes() {
    }


    plotYAxes() {
    }


    getYDomain(series) {
        if (!series) {
            return [0, 0];
        }
        const maxValue = d3v5.max(series, (s: any) => d3v5.max(s.timePeriods, d => +d['value']));
        // const minValue = d3v5.min(series, (s: any) => d3v5.min(s.timePeriods, d => +d['value']));
        const minValue =
         d3v5.min(series, (s: any) => d3v5.min(s.timePeriods.filter(_timePeriod => _timePeriod.value !== null) , d => +d['value']));
        return [minValue, maxValue];
    }


    addGraphicsElement() {
        // this.gSvg = this.svg.append('g').attr('transform', 'translate(' + 0 + ',' + 0 + ')');
    }


    sortPoints(points) {
      return points.sort((point1, point2) => point1.pointLabel.localeCompare(point2.pointLabel));
    }

}
