import { PucIduSensorDataGraphWidget } from './puc-idu-sensor-data-graph-widget';

describe('PucIduSensorDataGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucIduSensorDataGraphWidget('0000')).toBeTruthy();
  });

  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucIduSensorDataGraphWidget('0000')).getGraphWidget();
    expect(widget.params.length).toEqual(2);
  });
});
