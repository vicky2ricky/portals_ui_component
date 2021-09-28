import { PucSystemRuntimeGraphWidget } from './puc-system-runtime-graph-widget';

describe('PucSystemRuntimeGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemRuntimeGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemRuntimeGraphWidget()).getGraphWidget();
    expect(widget.params.length).toEqual(0);
  });
});
