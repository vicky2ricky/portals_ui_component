export interface ITerrainChart {
  unit: string;
  data: Array<{ site: string, readings: Array<{ time: string, value: number }> }>;
  columns: Array<any>;
  mappings: any;
  groupBy: string;
}
