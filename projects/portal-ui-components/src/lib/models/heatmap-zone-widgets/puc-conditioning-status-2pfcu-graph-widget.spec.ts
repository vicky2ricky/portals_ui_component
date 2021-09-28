import { PucConditioningStatus2pfcuGraphWidget } from './puc-conditioning-status-2pfcu-graph-widget';

describe('PucConditioningStatus2pfpuGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucConditioningStatus2pfcuGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucConditioningStatus2pfcuGraphWidget('0000')).getGraphWidget(true);
    expect(widget.params.length).toEqual(6);
  });
});
