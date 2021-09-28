import { PucPiLoopGraphWidget } from './puc-pi-loop-graph-widget';

describe('PucPiLoopGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucPiLoopGraphWidget('0000')).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucPiLoopGraphWidget('0000')).getGraphWidget('input');
    expect(widget.params.length).toEqual(4);
  });
});
