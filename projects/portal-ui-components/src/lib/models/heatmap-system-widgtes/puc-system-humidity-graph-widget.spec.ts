import { PucSystemHumidityGraphWidget } from './puc-system-humidity-graph-widget';

describe('PucSystemHumidityGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemHumidityGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemHumidityGraphWidget()).getGraphWidget(false);
    expect(widget.params.length).toEqual(9);
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemHumidityGraphWidget()).getGraphWidget(true);
    expect(widget.params.length).toEqual(10);
  });
});
