import { PucSystemOaoGraphWidget } from './puc-system-oao-graph-widget';

describe('PucSystemOaoGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemOaoGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemOaoGraphWidget()).getGraphWidget(true);
    expect(widget.params.length).toEqual(12);
  });
});
