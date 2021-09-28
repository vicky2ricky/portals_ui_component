import { PucSystemDefaultProfileGraphWidget } from './puc-system-default-profile-graph-widget';

describe('PucSystemDefaultProfileGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemDefaultProfileGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemDefaultProfileGraphWidget()).getGraphWidget('PName');
    expect(widget.params.length).toEqual(0);
  });
});
