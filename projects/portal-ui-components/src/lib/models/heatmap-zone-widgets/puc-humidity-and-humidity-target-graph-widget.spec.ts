import { PucHumidityAndHumidityTargetGraphWidget } from './puc-humidity-and-humidity-target-graph-widget';

describe('PucPiLoopGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucHumidityAndHumidityTargetGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucHumidityAndHumidityTargetGraphWidget('0000')).getGraphWidget('sense');
    expect(widget.params.length).toEqual(2);
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucHumidityAndHumidityTargetGraphWidget('0000')).getGraphWidget('');
    expect(widget.params.length).toEqual(2);
  });
});
