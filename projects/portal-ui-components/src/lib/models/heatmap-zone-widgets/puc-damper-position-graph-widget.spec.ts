import { PucDamperPositionGraphWidget } from './puc-damper-position-graph-widget';

describe('PucDamperPositionGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucDamperPositionGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucDamperPositionGraphWidget('0000')).getGraphWidget();
    expect(widget.params.length).toEqual(12);
  });
});
