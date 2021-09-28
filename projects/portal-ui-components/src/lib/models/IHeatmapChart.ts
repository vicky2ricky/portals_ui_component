export interface IHeatmapChart {
    unit: string;
    rows: number,
    labels: Array<string>;
    columns: Array<string>;
    readings: Array<any>;
    category: string;
    mappings: any;
    groupBy: string;
    groupCount: number;
}
