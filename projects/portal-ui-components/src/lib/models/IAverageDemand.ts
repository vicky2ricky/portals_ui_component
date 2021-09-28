export interface IAverageDemand {
  unit: string;
  rows: number;
  readings: Array<{label: string, value: number}>;
}
