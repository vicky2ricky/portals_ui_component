import { PucEnergyDataConsumptionGraphWidget } from './puc-energy-data-consumption-graph-widget';

describe('PucEnergyDataConsumptionGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucEnergyDataConsumptionGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucEnergyDataConsumptionGraphWidget('0000')).getGraphWidget();
    expect(widget.params.length).toEqual(2);
  });
});
