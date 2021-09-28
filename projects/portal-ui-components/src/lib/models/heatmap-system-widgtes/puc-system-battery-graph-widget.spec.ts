import { PucSystemBatteryGraphWidget } from './puc-system-battery-graph-widget';

describe('PucSystemBatteryGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemBatteryGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemBatteryGraphWidget()).getGraphWidget(true);
    expect(widget.params.length).toEqual(5);
  });
});
