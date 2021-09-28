import { PucSystemWifiGraphWidget } from './puc-system-wifi-graph-widget';

describe('PucSystemWifiGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemWifiGraphWidget()).toBeTruthy();
  });

  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemWifiGraphWidget()).getGraphWidget();
    expect(widget.params.length).toEqual(3);
  });
});
