import { PucSystemOutsideTempGraphWidget } from './puc-system-outside-temp-graph-widget';

describe('PucSystemOutsideTempGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemOutsideTempGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemOutsideTempGraphWidget()).getGraphWidget();
    expect(widget.params.length).toEqual(6);
  });
});
