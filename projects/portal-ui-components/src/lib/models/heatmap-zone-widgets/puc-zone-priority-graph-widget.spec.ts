import { PucZonePriorityGraphWidget } from './puc-zone-priority-graph-widget';

describe('PucZonePriorityGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucZonePriorityGraphWidget('0000')).toBeTruthy();
  });

  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucZonePriorityGraphWidget('0000')).getGraphWidget();
    expect(widget.params.length).toEqual(1);
  });
});
