import { PucSystemAvgTempGraphWidget } from './puc-system-avg-temp-graph-widget';

describe('PucSystemAvgTempGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemAvgTempGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemAvgTempGraphWidget()).getGraphWidget();
    expect(widget.params.length).toEqual(7);
  });
});
