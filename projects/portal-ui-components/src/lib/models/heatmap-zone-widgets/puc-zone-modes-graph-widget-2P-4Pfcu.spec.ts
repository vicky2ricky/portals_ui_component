import { PucZoneModesGraphWidget2P4PFcu } from './puc-zone-modes-graph-widget-2P-4Pfcu';

describe('PucZoneModesGraphWidget2P4PFcu', () => {
  it('should create an instance', () => {
    expect(new PucZoneModesGraphWidget2P4PFcu('0000')).toBeTruthy();
  });

  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucZoneModesGraphWidget2P4PFcu('0000')).getGraphWidget();
    expect(widget.params.length).toEqual(12);
  });
});
