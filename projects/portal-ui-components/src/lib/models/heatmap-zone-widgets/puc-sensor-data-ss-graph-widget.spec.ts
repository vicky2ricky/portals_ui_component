import { PucSensorDataSsGraphWidget } from './puc-sensor-data-ss-graph-widget';

describe('PucSensorDataSsGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSensorDataSsGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSensorDataSsGraphWidget('0000')).getGraphWidget(false);
    expect(widget.params.length).toEqual(12);
  });
});
