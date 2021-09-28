import { PucSystemVavDabDaikinIEGraphWidget } from './puc-system-vav-dab-daikin-iegraph-widget';

describe('PucSystemVavDabDaikinIEGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemVavDabDaikinIEGraphWidget()).toBeTruthy();
  });

  it('getGraphWidget: should return widget with properties for humidifier', () => {
    const widget = (new PucSystemVavDabDaikinIEGraphWidget()).getGraphWidget('test');
    expect(widget.params.length).toEqual(3);
  });
});
