export interface IEnergyUsage {
  groupBy: string;
  units: string;
  labels: string;
  rows: number;
  currentData: {
    labels: {},
    values: Array<any>,
    order: string[]
  };
  comparisonData: {
    labels: {},
    values: Array<any>,
    order: string[]
  };
}
