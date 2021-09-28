import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

export interface ICarbonReduction {
  unit: string;
  data: {
    electricitySavings: number,
    gasSavings: number
  };
  mappings: {
    electricitySavings: string,
    gasSavings: string
  };
}

@Component({
  selector: 'puc-carbon-footprint-reduction',
  templateUrl: './carbon-footprint-reduction.component.html',
  styleUrls: ['./carbon-footprint-reduction.component.scss']
})
export class CarbonFootprintReductionComponent implements OnInit {

  @Input() chartData: ICarbonReduction;
  @Input() colorSet: any;

  @Input() chartWidth = 400;
  @Input() chartHeight = 200;

  constructor() { }

  ngOnInit(): void {
  }
}
