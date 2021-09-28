export interface IPieChart {
  unit: string;
  partitions: Array<string>;
  data: Array<{label: string, reading: number, parentId: string, index: number, color: string}>;
  groupBy?: string;
  category: string;
  averages?: any;
  total?: number;
}
