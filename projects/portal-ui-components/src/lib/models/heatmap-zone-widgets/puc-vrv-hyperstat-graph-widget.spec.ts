import { PucVrvHyperStatGraphWidget } from './puc-vrv-hyperstat-graph-widget';

describe('PucVrvHyperStatGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucVrvHyperStatGraphWidget('0000')).toBeTruthy();
  });

  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucVrvHyperStatGraphWidget('0000')).getGraphWidget();
    expect(widget.params.length).toEqual(2);
  });
});
