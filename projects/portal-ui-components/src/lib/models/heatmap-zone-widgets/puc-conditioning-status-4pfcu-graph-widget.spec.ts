import { PucConditioningStatus4pfcuGraphWidget } from './puc-conditioning-status-4pfcu-graph-widget';

describe('PucConditioningStatus4pfcuGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucConditioningStatus4pfcuGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucConditioningStatus4pfcuGraphWidget('0000')).getGraphWidget(true);
    expect(widget.params.length).toEqual(5);
  });
});
