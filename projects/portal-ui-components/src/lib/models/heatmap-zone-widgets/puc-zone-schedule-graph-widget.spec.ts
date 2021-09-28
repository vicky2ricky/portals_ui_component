import { PucZoneScheduleGraphWiget } from './puc-zone-schedule-graph-widget';

describe('PucZoneScheduleGraphWiget', () => {
  it('should create an instance', () => {
    expect(new PucZoneScheduleGraphWiget('0000')).toBeTruthy();
  });

  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucZoneScheduleGraphWiget('0000')).getGraphWidget();
    expect(widget.params.length).toEqual(3);
  });
});
