import { PucSystemAirflowTempGraphWidget } from './puc-system-airflow-temp-graph-widget';

describe('PucSystemAirflowTempGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemAirflowTempGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemAirflowTempGraphWidget()).getGraphWidget();
    expect(widget.params.length).toEqual(7);
  });
});
