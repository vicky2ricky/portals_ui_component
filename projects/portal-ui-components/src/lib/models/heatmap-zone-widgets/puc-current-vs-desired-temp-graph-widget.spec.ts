import { PucCurrentVsDesiredTempGraphWidget } from './puc-current-vs-desired-temp-graph-widget';

describe('PucCurrentVsDesiredTempGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucCurrentVsDesiredTempGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucCurrentVsDesiredTempGraphWidget('0000')).getGraphWidget('sense');
    expect(widget.params.length).toEqual(7);
  });
});
