export interface IDonutCombination {
  otherChartType: string;
  unit: string;
  labels: Array<string>;
  rows: number;
  columns: Array<string>;
  mappings: any;
  readings: Array<any>;
  groupBy: string;
  category: string;
}
