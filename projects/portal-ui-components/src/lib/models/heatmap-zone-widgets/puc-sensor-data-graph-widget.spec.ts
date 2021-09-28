import { PucSensorDataGraphWidget } from './puc-sensor-data-graph-widget';

describe('PucSensorDataGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSensorDataGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSensorDataGraphWidget('0000')).getGraphWidget(false);
    expect(widget.params.length).toEqual(9);
  });
});
