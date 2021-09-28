import { PucSystemVavDabAnalogRtuGraphWidget } from './puc-system-vav-dab-analog-rtu-graph-widget';

describe('PucSystemVavDabAnalogRtuGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemVavDabAnalogRtuGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemVavDabAnalogRtuGraphWidget()).getGraphWidget('test');
    expect(widget.params.length).toEqual(8);
  });
});
