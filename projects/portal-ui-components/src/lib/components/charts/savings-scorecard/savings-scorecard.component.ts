import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

export interface ISavingsScorecard {
  unit: string;
  currencyUnit: string;
  data: {
    actual: number,
    benchmark: number,
    savings: number,
    savingsInCurrency: number
  };
  mappings: {
    actual: string,
    benchmark: string,
    savings: string,
  };
}


@Component({
  selector: 'puc-savings-scorecard',
  templateUrl: './savings-scorecard.component.html',
  styleUrls: ['./savings-scorecard.component.scss']
})
export class SavingsScorecardComponent implements OnInit, OnChanges {

  @Input() chartData: ISavingsScorecard;
  @Input() colorSet;

  @Input() chartWidth = 400;
  @Input() chartHeight = 200;

  @Input() barHeight = 50;
  @Input() barWidth = 20;

  @Input() minHeight = 10;
  @Input() applicableFontSize? = 14;
  scalingFactor: number;

  actualHeight;
  benchmarkHeight;

  constructor() { }


  ngOnInit(): void {

  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log('Scorecard - OnChanges');
    this.update();
  }


  update(): void {
    if (this.chartData) {
      const benchmark = (this.chartData.data && this.chartData.data.benchmark) ? this.chartData.data.benchmark : 0;
      const actual = (this.chartData.data && this.chartData.data.actual) ? this.chartData.data.actual : 1;
      if (this.chartData.data && actual) {
        this.scalingFactor = benchmark / actual;
      } else {
        this.scalingFactor = 1;
      }

      if (this.scalingFactor > 1) {
        this.benchmarkHeight = this.barHeight;
        this.actualHeight = this.minHeight + (( this.barHeight - this.minHeight ) / this.scalingFactor);
      } else {
        this.benchmarkHeight = this.minHeight + (( this.barHeight - this.minHeight ) * this.scalingFactor) ;
        this.actualHeight = this.barHeight;
      }

      if (this.chartData.data.benchmark === 0 && this.chartData.data.actual === 0) {
        this.benchmarkHeight = this.barHeight;
        this.actualHeight= this.barHeight;
      }
    }
  }


}
