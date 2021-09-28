import { PucSystemModesGraphWidget } from './puc-system-modes-graph-widget';

describe('PucSystemModesGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemModesGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemModesGraphWidget()).getGraphWidget();
    expect(widget.params.length).toEqual(13);
  });
});
