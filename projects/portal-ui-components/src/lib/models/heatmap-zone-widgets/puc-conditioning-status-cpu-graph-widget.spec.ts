import { PucConditioningStatusCpuGraphWidget } from './puc-conditioning-status-cpu-graph-widget';

describe('PucConditioningStatusCpuGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucConditioningStatusCpuGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties for off and off', () => {
    const widget = (new PucConditioningStatusCpuGraphWidget('0000')).getGraphWidget('0', true);
    expect(widget.params.length).toEqual(5);
  });

  it('getGraphWidget: should return widget with properties for cooling and off', () => {
    const widget = (new PucConditioningStatusCpuGraphWidget('0000')).getGraphWidget('1', true);
    expect(widget.params.length).toEqual(6);
  });

  it('getGraphWidget: should return widget with properties for off and fan high', () => {
    const widget = (new PucConditioningStatusCpuGraphWidget('0000')).getGraphWidget('2', true);
    expect(widget.params.length).toEqual(7);
  });

  it('getGraphWidget: should return widget with properties for heating and humidifier', () => {
    const widget = (new PucConditioningStatusCpuGraphWidget('0000')).getGraphWidget('3', true);
    expect(widget.params.length).toEqual(7);
  });

  it('getGraphWidget: should return widget with properties for hpuRelay5Config invaild', () => {
    expect(() => (new PucConditioningStatusCpuGraphWidget('0000')).getGraphWidget('4', true)).toThrow(new Error('Invalid relay6 config !'));
  });
});
