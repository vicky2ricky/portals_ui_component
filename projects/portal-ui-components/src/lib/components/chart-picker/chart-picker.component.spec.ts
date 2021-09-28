import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartPickerComponent } from './chart-picker.component';

describe('Component: ChartPickerComponent', () => {
  let component: ChartPickerComponent;
  let fixture: ComponentFixture<ChartPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChartPickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sanitizeImageUrl: sanitize image url ', () => {
    const imgSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0';
    const res: any = component.sanitizeImageUrl(imgSrc);
    expect(res.changingThisBreaksApplicationSecurity).toBe(imgSrc);
  });

  it('update: should show charts based on chart types', () => {
    component.charts = ['lineChart'];
    component.update();
    expect(component.chartOptions[0]['type']).toBe('lineChart');
    expect(component.chartOptions[0]['label']).toBe('Line Chart');
    expect(component.chartOptions[0]['imgSrc']).toBeDefined();
  });

  it('update: should not show any charts if chart types array is empty', () => {
    component.charts = [];
    component.update();
    expect(component.chartOptions.length).toBe(0);
  });

  it('update: should get selected chart info', () => {
    component.charts = ['areaChart'];
    component.selectedChart = 'areaChart';
    component.update();
    expect(component.selectedChartInfo['type']).toBe('areaChart');
    expect(component.selectedChartInfo['label']).toBe('Area Chart');
    expect(component.selectedChartInfo['imgSrc']).toBeDefined();
  });

  it('onSelectChart: should get selected chart info based on click', () => {
    component.showChartContainer = true;
    const lineChart = {
      imgSrc: '',
      label: 'Line Chart',
      type: 'lineChart'
    };
    spyOn(component.activate, 'emit');
    component.chartOptions = [].concat(lineChart);
    component.onSelectChart(lineChart);
    expect(component.showChartContainer).toBeFalsy();
    expect(component.activate.emit).toHaveBeenCalledWith('lineChart');
    expect(component.selectedChartInfo['type']).toBe('lineChart');
    expect(component.selectedChartInfo['label']).toBe('Line Chart');
    expect(component.selectedChartInfo['imgSrc']).toBeDefined();
  });

  it('onSelectChart: should not get selected chart info for invalid data', () => {
    component.showChartContainer = true;
    const lineChart = {};
    spyOn(component.activate, 'emit');
    component.chartOptions = [].concat(lineChart);
    component.onSelectChart(lineChart);
    expect(component.showChartContainer).toBeTruthy();
    expect(component.activate.emit).toHaveBeenCalledTimes(0);
  });

  it('ngOnChanges: should call update method for any change', () => {
    component.selectedChart = 'areaChart';
    spyOn(component, 'update');
    component.ngOnChanges({
      selections: new SimpleChange(null, component.selectedChart, false)
    });
    fixture.detectChanges();
    expect(component.update).toHaveBeenCalled();
  });

});
