import { PucAirflowWaterTempCpuAndHpuGraphWidget } from './puc-airflow-water-temp-cpu-and-hpu-graph-widget';

describe('PucAirflowWaterTempCpuAndHpuGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucAirflowWaterTempCpuAndHpuGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucAirflowWaterTempCpuAndHpuGraphWidget('0000')).getGraphWidget();
    expect(widget.params.length).toEqual(2);
  });
});
