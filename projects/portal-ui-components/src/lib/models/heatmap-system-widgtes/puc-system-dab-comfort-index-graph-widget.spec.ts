import { PucSystemDabComfortIndexGraphWidget } from './puc-system-dab-comfort-index-graph-widget';

describe('PucSystemDabComfortIndexGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemDabComfortIndexGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemDabComfortIndexGraphWidget()).getGraphWidget();
    expect(widget.params.length).toEqual(5);
  });
});
