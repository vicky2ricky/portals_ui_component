// import * as d3 from 'd3';
declare const d3v5: any;

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { BaseChartComponent } from '../common/base-chart.component';
import { ChartService } from '../../../services/chart.service';
import { IEnergyUsage } from '../../../models/IEnergyUsage';

@Component({
  selector: 'puc-portfolio-energy-usage',
  templateUrl: './portfolio-energy-usage.component.html',
  styleUrls: ['./portfolio-energy-usage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioEnergyUsageComponent extends BaseChartComponent implements OnInit {

  @Input() barWidth;
  @Input() barPadding = 0.4;
  @Input() editClass;

  @Input() cmpColorSet;
  @Input() showbenchmarkDate?= true;

  chartData: IEnergyUsage;

  xAxes;

  dataColumns: string[];
  dataSumArray;
  towerData: Array<any> = [];
  yTicks = 4;

  randomClassName;

  constructor(
    chartElement: ElementRef,
    private chartService: ChartService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone) {
    super(chartElement);
  }

  ngOnInit(): void {

  }


  /**** Scales *****/
  setXScale() {
    this.xScale = this.chartService.createScaleBand(
      this.chartData.rows,
      this.margin['left'] + 10,
      this.width - this.margin['right'] - 10,
      this.barPadding);
  }

  setYScale() {
    let domainMaxVal;
    const maxValueDataSum = Math.max(...this.dataSumArray);
    if (this.dataSumArray.length > 1) {
      if (maxValueDataSum < 10) {
        domainMaxVal = Math.ceil(maxValueDataSum);
      } else {
        domainMaxVal = Math.ceil(maxValueDataSum / 10) * 10;
      }
      // domainMaxVal = Math.ceil(Math.max(...this.dataSumArray) / 10) * 10;
    } else {
      // domainMaxVal = Math.ceil((Math.max(...this.dataSumArray) + Number.EPSILON) * 10) / 10;
      domainMaxVal = Math.ceil(maxValueDataSum * 10) / 10;
    }
    const yTicksInfo = this.chartService.getSmartTicks(domainMaxVal);
    this.yTicks = yTicksInfo.count;
    this.yScale = this.chartService.createScaleLinear(
      0, yTicksInfo.endPoint, this.height - this.margin['bottom'], this.margin['top']);
  }
  /**** Scales *****/


  // private setXAxes() {
  //   const domain = d3v5.range(1, this.chartData.rows + 1).map(d => this.chartData.label + d);

  //   this.xAxes = this.chartService.createScaleBand(
  //     domain, this.margin['left'], this.width - this.margin['right']);
  // }


  // private setLabels() {
  //     // this.dataColumns = Object.keys(this.chartData.dataLabels);
  //     this.dataColumns = this.chartData.labelOrder;
  // }


  addGridLines() {
    this.svg.append('g')
      .attr('class', 'peu-y-axis-grid')
      .attr('transform', `translate( ${this.margin['left']}, 0)`)
      .call(d3v5.axisLeft(this.yScale).ticks(this.yTicks).tickSize(-this.chartWidth).tickFormat((domain) => ''));
  }


  setToolTip() {
    d3v5.select(this.hostElement).select('.peuToolTip').remove();
    this.toolTip = d3v5.select(this.hostElement)
      .append('div')
      .style('visibility', 'hidden')
      .attr('class', 'peuToolTip');
  }


  private plotWeeks() {
    console.log('Calling Plot Weeks');
    const weeks =
      this.gSvg.selectAll('g')
        .data(this.towerData)
        .enter()
        .append('g')
        .attr('transform', (_, i) => 'translate(' + this.xScale(i) + ',' + -this.margin['top'] + ')')
        .style('pointer-events', 'bounding-box')
        .style('cursor', 'pointer')
        .style('z-index', 100)
        .on('mouseover', (d, i) => this.mouseOver(d, i, this))
        .on('mousemove', (d, i) => this.mouseMove(d, i, this))
        .on('mouseleave', (d, i) => this.mouseLeave(d, this));

    weeks.selectAll('rect')
      // .data(d => { console.log(d); return d; })
      .data(d => d)
      .join('rect')
      .attr('y', d => this.yScale(0))
      // .transition()
      // .duration(1200)
      .attr('x', (d, i) => d.x)
      .attr('y', (d) => d.y)
      .attr('width', this.xScale.bandwidth() / 2)
      .attr('height', d => d.height)
      .style('fill', d => d.color);
  }


  plotXAxes() {
    const currentValuesLength = this.chartData.currentData?.values.length;
    const comparisonValuesLength = this.chartData.comparisonData?.values.length;
    const valueSetToUse =
      currentValuesLength > comparisonValuesLength ? this.chartData.currentData : this.chartData.comparisonData;

    this.svg.append('g')
      .attr('class', `${this.randomClassName} ${this.editClass} axis axis--x no-visibility`)
      // .attr('transform', `translate( ${this.margin['left'] / 2 - this.barWidth / 2}, ${this.height - this.margin['bottom']})`)
      // .attr("transform", `translate(${(margin.left / 2)}, ${chartHeight - margin.bottom})`)
      .attr('transform', `translate(0, ${this.height - this.margin['bottom']})`)
      .call(d3v5
        .axisBottom(this.xScale)
        // .ticks(5)
        .tickSize(2)
        .tickSizeOuter(0)
        .tickFormat(
          (d: number) => {
            if (d % 1 === 0 && d < this.chartData.rows) {
              return this.chartService.generateXLabel(this.chartData.groupBy, valueSetToUse.values[d], d);
            }
          })
      )
  }


  addXTicks() {
    this.chartService.addXTicks(`.${this.randomClassName}.${this.editClass} .tick`,
      this.chartData.groupBy, this.xScale.bandwidth(), this.chartData.rows, -45, 'peu');
  }


  plotYAxes() {
    this.svg.append('g')
      .attr('class', 'peuYAxisGroup')
      // .attr('transform', `translate( ${this.margin['left'] + this.margin['left'] / 2}, 0)`)
      .attr('transform', `translate( ${this.margin['left']}, 0)`)
      .call(d3v5.axisLeft(this.yScale)
        .ticks(this.yTicks)
        .tickFormat((d) => (d !== 0) ? d3v5.format('.2s')(d) + ' ' + this.chartData.units : '')
        .tickSize(0));
  }


  // addYTicks() {
  //   const ticks = d3v5.selectAll('.peuYAxisGroup .tick text');
  //   ticks.each(function (d: any) {
  //     if (d % 100 !== 0) {
  //       d3v5.select(this).remove();
  //     }
  //   });
  // }


  createChart() {
    console.log('PEU - createChart');
    if (this.chartData && Object.keys(this.chartData).length) {

      this.cd.reattach();
      this.ngZone.runOutsideAngular(() => {
        super.removeExistingChartFromParent();
        this.setXScale();
        // this.setXAxes();

        this.randomClassName = this.chartService.createRandomClassName('peuXAxisGroup');

        // this.setLabels();
        this.calculateDataSumArray();

        this.setYScale();
        this.computeTowerData();

        super.setupChart();
        this.addGridLines();

        this.addGraphicsElement();

        if (this.showTooltip) {
          this.setToolTip();
        }

        this.plotWeeks();

        this.plotXAxes();
        this.plotYAxes();

        this.addXTicks();
        // this.addYTicks();

        this.cd.detectChanges();
        this.cd.detach();

      });
    }
  }


  addGraphicsElement() {
    this.gSvg = this.svg.append('g').attr('transform', 'translate(0,' + this.margin['top'] + ')');
    // this.gSvg = this.svg.append('g').attr('transform', `translate( ${this.margin['left']}, ${this.margin['top']} )`);
  }


  private calculateDataSumArray() {
    const dataSumArray = [];

    this.chartData.currentData.values.map(valueRow => {
      let actualDataSum = 0;
      for (const key of Object.keys(valueRow)) {
        if (this.chartData.currentData.order.indexOf(key) != -1) {
          actualDataSum += valueRow[key];
        }
      }

      dataSumArray.push(actualDataSum);
    });

    if (this.chartData.comparisonData && this.chartData.comparisonData.values) {
      this.chartData.comparisonData.values.map(valueRow => {
        let comparisonDataSum = 0;
        for (const key of Object.keys(valueRow)) {
          if (this.chartData.comparisonData.order.indexOf(key) != -1) {
            comparisonDataSum += valueRow[key];
          }

        }

        dataSumArray.push(comparisonDataSum);
      });
    }

    this.dataSumArray = dataSumArray;
    // console.log(this.dataSumArray);
  }


  private computeTowerData() {
    this.towerData = d3v5.range(0, this.chartData.rows).map(row => {
      const rowTowerData = [];
      // console.log(row);

      if (row < this.chartData.currentData.values.length) {

        const currentValueRow = this.chartData.currentData.values[row];
        let accuCurrentValue = 0;

        for (const dataColumn of this.chartData.currentData.order) {
          if (currentValueRow[dataColumn]) {

            const currentValue = currentValueRow[dataColumn];
            accuCurrentValue += currentValue;

            rowTowerData.push({
              x: 0,
              y: Math.round((this.yScale(accuCurrentValue) + Number.EPSILON) * 100) / 100,
              height: Math.round(
                (this.yScale(accuCurrentValue - currentValue) - this.yScale(accuCurrentValue) + Number.EPSILON) * 100) / 100,
              color: this.getColor(dataColumn, 'actual'),
              actualValue: currentValue,
              type: this.chartData.currentData.labels[dataColumn].label,
              date: currentValueRow.date,
              section: 'actual',
              unit: currentValueRow.unit
            });

          }
        }
      }


      if (row < this.chartData.comparisonData.values.length) {
        const comparisonValueRow = this.chartData.comparisonData.values[row];
        let accuComparisonValue = 0;

        for (const dataColumn of this.chartData.comparisonData.order) {
          if (comparisonValueRow[dataColumn]) {

            const comparisonValue = comparisonValueRow[dataColumn];
            accuComparisonValue += comparisonValue;

            rowTowerData.push({
              x: this.xScale.bandwidth() / 2,
              y: Math.round((this.yScale(accuComparisonValue) + Number.EPSILON) * 100) / 100,
              height: Math.round(
                (this.yScale(accuComparisonValue - comparisonValue) - this.yScale(accuComparisonValue) + Number.EPSILON) * 100) / 100,
              color: this.getColor(dataColumn, 'comparison'),
              actualValue: comparisonValue,
              type: this.chartData.comparisonData.labels[dataColumn].label,
              date: comparisonValueRow.date,
              section: 'benchmark',
              unit: comparisonValueRow.unit
            });

          }
        }
      }

      // console.log(rowTowerData);
      return rowTowerData;
    });

    // console.log(this.towerData);
  }


  getColor(key, type) {
    if (type === 'actual') {
      if (this.colorSet && Object.keys(this.colorSet).length && this.colorSet[key]) {
        return this.colorSet[key];
      } else {
        return '#EF9453';
      }
    } else if (type === 'comparison') {
      if (this.cmpColorSet && Object.keys(this.cmpColorSet).length && this.cmpColorSet[key]) {
        return this.cmpColorSet[key];
      } else {
        return '#F7C325';
      }
    }

  }


  mouseOver(d, i, self) {
    if (this.toolTip) {

      let htmlContent = `<ul class="peuToolTipList">`;
      d.sort((d1, d2) => d1.section - d2.section);

      const actualValues = d.filter(_d => _d.section === 'actual');
      if (actualValues.length > 0) {
        const xValActualDate = new Date(actualValues[0].date).toDateString() + ' ' +
          new Date(actualValues[0].date).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
        htmlContent += `<li>@ ${xValActualDate}</li>`;
      };

      actualValues.map(row => {
        htmlContent += `<li style = "color : ${row.color}"> ${row.type} <b>${row.actualValue} ${row.unit} </b></li>`;
      });


      const comparisonValues = d.filter(_d => _d.section === 'benchmark');
      if (comparisonValues.length > 0) {
        if (this.showbenchmarkDate) {
          const xValComparisonDate = new Date(comparisonValues[0].date).toDateString() + ' ' +
            new Date(comparisonValues[0].date).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
          htmlContent += `<li>@ ${xValComparisonDate}</li>`;
        } else {
          htmlContent += `<li>Benchmark Values</li>`;
        }
      };

      comparisonValues.map(row => {
        htmlContent += `<li style = "color : ${row.color}"> ${row.type} <b>${row.actualValue} ${row.unit} </b></li>`;
      });

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

      const thresholdToSwitchToolTip = Math.floor(.7 * this.chartData.rows);
      const mouseCoords = (d3v5.mouse(d3v5.event.currentTarget));

      let leftCoord = mouseCoords[0] + (this.xScale(i) + (this.xScale.bandwidth() / 2));
      leftCoord = i > thresholdToSwitchToolTip ? leftCoord - (mouseCoords[0] + 215) + 'px' : leftCoord + 'px';

      // Calcualted the size based on the widget width and mouse event to adjust the tooltip
      const size = (this.width / 100) * 65 > d3v5.event.layerX + 100 ? d3v5.event.layerX : d3v5.event.layerX - 200;
      if (super.isFirefox()) {
        this.toolTip
          .style('top', d3v5.event.layerY + 'px')
          .style('left', size + 'px');
      } else {
        this.toolTip
          // .style('top', mouseCoords[1] - (d.length * 24) + this.margin['bottom'] + 'px')
          .style('top', `${this.margin.top + 10}px`)
          .style('left', leftCoord);
      }
    }
  }

}

