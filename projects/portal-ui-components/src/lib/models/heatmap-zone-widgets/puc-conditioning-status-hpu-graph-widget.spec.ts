import { PucConditioningStatusHpuGraphWidget } from './puc-conditioning-status-hpu-graph-widget';

describe('PucConditioningStatusHpuGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucConditioningStatusHpuGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties for off and off', () => {
    const widget = (new PucConditioningStatusHpuGraphWidget('0000')).getGraphWidget('0', '0', true);
    expect(widget.params.length).toEqual(6);
  });

  it('getGraphWidget: should return widget with properties for cooling and off', () => {
    const widget = (new PucConditioningStatusHpuGraphWidget('0000')).getGraphWidget('1', '0', true);
    expect(widget.params.length).toEqual(8);
  });

  it('getGraphWidget: should return widget with properties for off and fan high', () => {
    const widget = (new PucConditioningStatusHpuGraphWidget('0000')).getGraphWidget('0', '1', true);
    expect(widget.params.length).toEqual(7);
  });

  it('getGraphWidget: should return widget with properties for heating and humidifier', () => {
    const widget = (new PucConditioningStatusHpuGraphWidget('0000')).getGraphWidget('2', '2', true);
    expect(widget.params.length).toEqual(10);
  });

  it('getGraphWidget: should return widget with properties for heating and dehumidifier', () => {
    const widget = (new PucConditioningStatusHpuGraphWidget('0000')).getGraphWidget('2', '3', true);
    expect(widget.params.length).toEqual(10);
  });

  it('getGraphWidget: should return widget with properties for hpuRelay5Config invaild', () => {
    expect(() => (new PucConditioningStatusHpuGraphWidget('0000')).getGraphWidget('6', '6', true)).toThrow(new Error('Invalid relay5 config !'));
  });

  it('getGraphWidget: should return widget with properties for hpcType invaild', () => {
    expect(() => (new PucConditioningStatusHpuGraphWidget('0000')).getGraphWidget('6', '2', true))
      .toThrow(new Error('Invalid Heat pump change over type !'));
  });


});
