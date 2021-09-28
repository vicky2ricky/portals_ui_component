import { PucVOCAndVOCTargetGraphWidget } from './puc-vocand-voctarget-graph-widget';

describe('PucVOCAndVOCTargetGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucVOCAndVOCTargetGraphWidget('0000')).toBeTruthy();
  });

  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucVOCAndVOCTargetGraphWidget('0000')).getGraphWidget('sense');
    expect(widget.params.length).toEqual(2);
  });
});
