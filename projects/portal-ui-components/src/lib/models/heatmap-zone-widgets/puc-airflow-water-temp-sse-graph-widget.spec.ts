import { PucAirflowWaterTempSseGraphWidget } from './puc-airflow-water-temp-sse-graph-widget';

describe('PucAirflowWaterTempSseGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucAirflowWaterTempSseGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucAirflowWaterTempSseGraphWidget('0000')).getGraphWidget();
    expect(widget.params.length).toEqual(2);
  });
});
