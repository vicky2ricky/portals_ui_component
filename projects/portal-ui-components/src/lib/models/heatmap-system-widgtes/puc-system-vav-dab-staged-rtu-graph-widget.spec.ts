import { PucSystemVavDabStagedRtuGraphWidget } from './puc-system-vav-dab-staged-rtu-graph-widget';

describe('PucSystemVavDabStagedRtuGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemVavDabStagedRtuGraphWidget()).toBeTruthy();
  });

  it('getGraphWidget: should return widget with properties for humidifier', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['humidifier']);
    expect(widget.params.length).toEqual(2);
  });

  it('getGraphWidget: should return widget with properties for dehumidifier', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['dehumidifier']);
    expect(widget.params.length).toEqual(2);
  });

  it('getGraphWidget: should return widget with properties for fanStage1', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['Fanstage1']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for fanStage2', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['fanStage2']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for fanStage3', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['fanStage3']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for fanStage4', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['fanStage4']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for fanStage5', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['fanStage5']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for coolingStage1', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['coolingStage1']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for coolingStage2', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['coolingStage2']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for coolingStage3', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['coolingStage3']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for coolingStage4', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['coolingStage4']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for coolingStage5', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['coolingStage5']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for heatingStage1', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['heatingStage1']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for heatingStage2', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['heatingStage2']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for heatingStage3', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['heatingStage3']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for heatingStage4', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['heatingStage4']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for heatingStage4', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['heatingStage5']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for fanSignal', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['fanSignal']);
    expect(widget.params.length).toEqual(1);
  });

  it('getGraphWidget: should return widget with properties for unknown param', () => {
    const widget = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget('test', ['something']);
    expect(widget.params.length).toEqual(1);
  });
});
