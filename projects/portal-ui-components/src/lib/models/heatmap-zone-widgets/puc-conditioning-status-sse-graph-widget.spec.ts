import { PucConditioningStatusSseGraphWidget } from './puc-conditioning-status-sse-graph-widget';

describe('PucConditioningStatusSseGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucConditioningStatusSseGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucConditioningStatusSseGraphWidget('0000')).getGraphWidget();
    expect(widget.params.length).toEqual(6);
  });
});
