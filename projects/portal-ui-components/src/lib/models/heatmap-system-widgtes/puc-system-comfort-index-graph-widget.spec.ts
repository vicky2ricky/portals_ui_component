import { PucSystemComfortIndexGraphWidget } from './puc-system-comfort-index-graph-widget';

describe('PucSystemComfortIndexGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemComfortIndexGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemComfortIndexGraphWidget()).getGraphWidget();
    expect(widget.params.length).toEqual(0);
  });
});
