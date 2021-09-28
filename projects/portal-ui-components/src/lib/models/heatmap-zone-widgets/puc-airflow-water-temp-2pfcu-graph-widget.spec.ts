import { PucAirflowWaterTemp2pfcuGraphWidget } from './puc-airflow-water-temp-2pfcu-graph-widget';

describe('PucAirflowWaterTemp2pfcuGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucAirflowWaterTemp2pfcuGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucAirflowWaterTemp2pfcuGraphWidget('0000')).getGraphWidget();
    expect(widget.params.length).toEqual(3);
  });
});
