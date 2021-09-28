import { PucSystemVavDabHybridRtuGraphWidget } from './puc-system-vav-dab-hybrid-rtu-graph-widget';

describe('PucSystemVavDabHybridRtuGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemVavDabHybridRtuGraphWidget()).toBeTruthy();
  });

  it('getGraphWidget: should return widget with properties for humidifier', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['humidifier']);
    expect(widget.params.length).toEqual(2);
  });

  it('getGraphWidget: should return widget with properties for dehumidifier', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['dehumidifier']);
    expect(widget.params.length).toEqual(2);
  });

  it('getGraphWidget: should return widget with properties for fanStage1', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['Fanstage1']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for fanStage2', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['fanStage2']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for fanStage3', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['fanStage3']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for fanStage4', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['fanStage4']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for fanStage5', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['fanStage5']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for coolingStage1', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['coolingStage1']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for coolingStage2', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['coolingStage2']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for coolingStage3', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['coolingStage3']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for coolingStage4', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['coolingStage4']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for coolingStage5', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['coolingStage5']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for heatingStage1', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['heatingStage1']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for heatingStage2', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['heatingStage2']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for heatingStage3', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['heatingStage3']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for heatingStage4', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['heatingStage4']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for heatingStage4', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['heatingStage5']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for modulatingFanSpeed', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['modulatingFanSpeed']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for modulatingCooling', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['modulatingCooling']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for modulatingHeating', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['modulatingHeating']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for compositeSignal', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['compositeSignal']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for unknown param', () => {
    const widget = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget('test', ['something']);
    expect(widget.params.length).toEqual(1);
  });
});
