import { PucZoneOccupancyStatusGraphWidget } from './puc-zone-occupancy-status-graph-widget';

describe('PucZoneOccupancyStatusGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucZoneOccupancyStatusGraphWidget('0000')).toBeTruthy();
  });

  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucZoneOccupancyStatusGraphWidget('0000')).getGraphWidget();
    expect(widget.params.length).toEqual(10);
  });
});
