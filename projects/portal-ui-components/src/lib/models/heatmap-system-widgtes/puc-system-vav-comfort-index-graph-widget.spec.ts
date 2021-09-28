import { PucSystemVavComfortIndexGraphWidget } from './puc-system-vav-comfort-index-graph-widget';

describe('PucSystemVavComfortIndexGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemVavComfortIndexGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemVavComfortIndexGraphWidget()).getGraphWidget();
    expect(widget.params.length).toEqual(4);
  });
});
