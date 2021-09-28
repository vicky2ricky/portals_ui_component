import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { IAreaChart } from '../../../models/IAreaChart';
import { IBarChart } from '../../../models/IBarChart';
import { IDonutCombination } from '../../../models/IDonutCombination';
import { IPieChart } from '../../../models/IPieChart';
import { round } from 'lodash-es';

@Component({
  selector: 'puc-donut-combination',
  templateUrl: './donut-combination.component.html',
  styleUrls: ['./donut-combination.component.scss']
})
export class DonutCombinationComponent implements OnInit, OnChanges {

  isChartSetup = false;

  @Input() consumptionData: IDonutCombination;
  @Input() margin = { top: 32, right: 64, bottom: 24, left: 48 };

  @Input() editClass;

  chartData: IDonutCombination;

  donutData: IPieChart;
  otherChartData: IAreaChart | IBarChart;

  @Input() chartWidth;
  @Input() chartHeight;

  @Input() donutOnlyHeight?= 120;

  @Input() verticalBarWidth = 24;
  @Input() horizBarWidth = 20;

  width;
  height;

  barWidth;

  @Input() colorSet;

  @Input() showTooltip;

  constructor() { }

  ngOnInit(): void {

  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log('Donut Combination - OnChanges');
    this.isChartSetup = false;

    if (changes.consumptionData) {
      this.chartData = changes.consumptionData.currentValue;
    }

    this.update();
  }


  update() {

    if (this.chartData) {

      // default values if width or height are 0 or undefined
      if (!this.chartWidth) {

        // If the accompanying chart is the Horizontal Bar chart, width is fixed
        if (this.chartData.otherChartType === 'horizontal') {
          this.chartWidth = 500;
          this.barWidth = this.horizBarWidth;

        } else {

          // Keeping it consistent for line and vertical bar chart
          const width = this.chartData.readings.length * this.verticalBarWidth;

          // Minimum 500 px width
          this.chartWidth = width < 500 ? 500 : width;

          this.barWidth = this.verticalBarWidth;
        }
      }

      if (!this.chartHeight) {
        // Donut Combo height is 2 times the chart

        // If this is not a horizontal chart - the height is fixed
        if (this.chartData.otherChartType !== 'horizontal') {
          this.chartHeight = 150 + this.donutOnlyHeight;

        } else {
          const height = this.chartData.readings.length * this.horizBarWidth;

          // Min height of the chart is 150, and added along with that is the donut only height
          this.chartHeight = (height < 150 ? 150 : height) + this.donutOnlyHeight;
        }
      }

      this.chartWidth = Math.floor(this.chartWidth);
      this.chartHeight = Math.floor(this.chartHeight);

      this.computeWidth();
      this.computeHeight();

      this.setUpData();

    }
  }


  computeWidth() {
    this.width = this.chartWidth + (this.margin['left'] + this.margin['right']);
  }


  computeHeight() {
    this.height = this.chartHeight + (this.margin['top'] + this.margin['bottom']);
  }


  /**
   * Take the data that is coming in and transform it into DonutData
   */
  setUpData() {

    const averages = {};
    const donutAverages = [];
    let total = 0;
    if (this.chartData && this.chartData.readings) {
      this.chartData.readings
        .filter((_filterItem) => _filterItem)
        .map(reading => {
          for (const [key, value] of Object.entries(reading)) {
            if (key !== 'date') {
              if (!averages[key]) {
                averages[key] = 0;
              }

              averages[key] += value;
            }
          }
        });
    }


    // console.log(averages);

    delete averages['index'];

    const dataForDonut = [];
    const rows = (this.chartData && this.chartData.rows) ? this.chartData.rows : 0;
    for (const key of Object.keys(averages)) {

      total += averages[key];

      averages[key] = rows == 0 ? 0 : round((averages[key] / rows), 2);

      donutAverages.push({ label: key, value: this.formatNumber(averages[key]) });
      const colorCode = (this.colorSet && this.colorSet[key]) ? this.colorSet[key] : '';
      dataForDonut.push({ label: this.chartData.mappings[key], reading: averages[key], parentId: key, color: colorCode });
    }

    // Adding the value for total
    // donutAverages.unshift({ label: 'total', value: (rows == 0) ? 0 : ((total / rows).toFixed(2)) });
    donutAverages.unshift({ label: 'total', value: (rows == 0) ? 0 : this.formatNumber(round((total / rows), 2)) });

    const partitions = (this.chartData && this.chartData.mappings) ? this.chartData.mappings : {};

    partitions['total'] = 'Total';

    const labels = (this.chartData && this.chartData.labels) ? JSON.parse(JSON.stringify(this.chartData.labels)) : [];
    if (this.chartData.otherChartType === 'line') {
      labels.unshift('');
    };
    // console.log(averages);

    this.donutData = {
      unit: this.chartData.unit,
      partitions,
      data: dataForDonut,
      groupBy: this.chartData.groupBy,
      category: this.chartData.category,
      averages: donutAverages,
      total: this.formatNumber(round(total, 2))
    };

    this.otherChartData = {
      unit: this.chartData.unit,
      labels,
      rows: this.chartData.rows,
      columns: this.chartData.columns,
      mappings: this.chartData.mappings,
      readings: this.chartData.readings,
      groupBy: this.chartData.groupBy,
    };

    console.log(this.donutData);
    console.log(this.otherChartData);
    // console.log('Done Processing');
    // console.log(this.donutOnlyHeight, this.chartWidth, this.chartHeight);
    this.isChartSetup = true;
  }


  calcResidualHeight() {
    return this.chartHeight - this.donutOnlyHeight < 150 ? 150 : this.chartHeight - this.donutOnlyHeight;
  }


  formatNumber(value) {
    // let addK = false;
    // if ( value > 1000000 ) {
    //   value = Math.round(value / 1000);
    //   addK = true;
    // }
    // if (value >= 1000) {
    //   value = Math.floor(value / 1000) + ',' + value.toString().substring(value.toString().length - 3);
    // }

    // if (addK) {
    //   value += 'k';
    // }

    return value;
  }

}
