export interface IBarChart {
  unit: string;
  labels: Array<string>;
  rows: number;
  columns: Array<string>;
  mappings: any;
  readings: Array<any>;
  groupBy: string;
}
