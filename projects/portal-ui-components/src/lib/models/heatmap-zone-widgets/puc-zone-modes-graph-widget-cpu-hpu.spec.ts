import { PucZoneModesGraphWidgetCpuHpu } from './puc-zone-modes-graph-widget-cpu-hpu';

describe('PucZoneModesGraphWidgetCpuHpu', () => {
  it('should create an instance', () => {
    expect(new PucZoneModesGraphWidgetCpuHpu('0000')).toBeTruthy();
  });

  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucZoneModesGraphWidgetCpuHpu('0000')).getGraphWidget();
    expect(widget.params.length).toEqual(11);
  });
});
