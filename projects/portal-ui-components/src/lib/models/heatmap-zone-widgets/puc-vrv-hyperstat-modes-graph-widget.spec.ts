import { PucVrvHyperStatModesGraphWidget } from './puc-vrv-hyperstat-modes-graph-widget';

describe('PucVrvHyperStatModesGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucVrvHyperStatModesGraphWidget('0000')).toBeTruthy();
  });

  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucVrvHyperStatModesGraphWidget('0000')).getGraphWidget(true);
    expect(widget.params.length).toEqual(10);
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucVrvHyperStatModesGraphWidget('0000')).getGraphWidget(false);
    expect(widget.params.length).toEqual(6);
  });
});
