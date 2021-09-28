import { PucSystemCmDataGraphWidget } from './puc-system-cm-data-graph-widget';

describe('PucSystemCmDataGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemCmDataGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemCmDataGraphWidget()).getGraphWidget(true);
    expect(widget.params.length).toEqual(5);
  });
});
