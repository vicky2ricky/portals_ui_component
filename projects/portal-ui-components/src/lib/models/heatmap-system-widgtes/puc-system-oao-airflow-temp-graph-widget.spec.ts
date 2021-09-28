import { PucSystemOaoAirflowTempGraphWidget } from './puc-system-oao-airflow-temp-graph-widget';

describe('PucSystemOaoAirflowTempGraphWidget', () => {
  it('should create an instance', () => {
    expect(new PucSystemOaoAirflowTempGraphWidget()).toBeTruthy();
  });
  it('getGraphWidget: should return widget with properties', () => {
    const widget = (new PucSystemOaoAirflowTempGraphWidget()).getGraphWidget();
    expect(widget.params.length).toEqual(6);
  });
});
