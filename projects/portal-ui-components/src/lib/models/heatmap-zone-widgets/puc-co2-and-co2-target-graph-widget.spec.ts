import { PucCo2AndCo2TargetGraphWidget } from './puc-co2-and-co2-target-graph-widget';

describe('PucCo2AndCo2TargetGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucCo2AndCo2TargetGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucCo2AndCo2TargetGraphWidget('0000')).getGraphWidget('sense');
    expect(widget.params.length).toEqual(2);
  });
});
