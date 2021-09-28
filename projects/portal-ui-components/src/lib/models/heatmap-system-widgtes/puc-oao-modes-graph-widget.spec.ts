import { PucOaoModesGraphWidget } from './puc-oao-modes-graph-widget';

describe('PucOaoModesGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucOaoModesGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucOaoModesGraphWidget()).getGraphWidget(true);
    expect(widget.params.length).toEqual(17);
  });
});
