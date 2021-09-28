import { PucAirflowWaterTempDabAndVavGraphWidget } from './puc-airflow-water-temp-dab-and-vav-graph-widget';

describe('PucAirflowWaterTempDabAndVavGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucAirflowWaterTempDabAndVavGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucAirflowWaterTempDabAndVavGraphWidget('0000')).getGraphWidget();
    expect(widget.params.length).toEqual(5);
  });
});
