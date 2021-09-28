import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HeatmapChartComponent } from './heatmap-chart.component';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

const results =
{
    unit: 'kWh',
    labels: [
        'D1',
        'D2',
        'D3',
        'D4'
    ],
    columns: [
        'hvacElectricity'
    ],
    readings: [
        {
            key: 'D1',
            hvacElectricity: 120,
            id: 1,
            name: 'Floor1'
        },
        {
            key: 'D2',
            hvacElectricity: 210,
            id: 1,
            name: 'Floor1'
        },
        {
            key: 'D3',
            hvacElectricity: 0,
            id: 1,
            name: 'Floor1'
        },
        {
            key: 'D4',
            hvacElectricity: 220,
            id: 1,
            name: 'Floor1'
        },
        {
            key: 'D1',
            hvacElectricity: 301,
            id: 2,
            name: 'Floor1'
        },
        {
            key: 'D2',
            hvacElectricity: 70,
            id: 2,
            name: 'Floor1'
        },
        {
            key: 'D3',
            hvacElectricity: 120,
            id: 2,
            name: 'Floor1'
        },
        {
            key: 'D4',
            hvacElectricity: 190,
            id: 2,
            name: 'Floor1'
        },
        {
            key: 'D1',
            hvacElectricity: 1,
            id: 3,
            name: 'Floor2'
        }
    ]
};
const colorArray = ['rgba(240, 94, 111, 1)',
    'rgba(240, 94, 111, 0.8583333333333333)',
    'rgba(240, 94, 111, 0.7166666666666667)',
    'rgba(240, 94, 111, 0.575)',
    'rgba(240, 94, 111, 0.43333333333333335)',
    'rgba(240, 94, 111, 0.29166666666666663)']
@Component({
    selector: 'puc-test-component',
    template: ''
})
class TestComponent {
    results: any = results;
    colorArray: any = colorArray;
}

describe('Component: HeatmapChartComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, HeatmapChartComponent]
        })
    }));

    describe('Render Heatmap chart', () => {
        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
           <puc-heatmap-chart [chartWidth]='200' [chartHeight]='200' [consumptionData]='results'
           [colorArray]="colorArray"
           >
          </puc-heatmap-chart>`
                }
            });
        });

        it('should set the svg width and height', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const svg = fixture.debugElement.nativeElement.querySelector('svg');
            expect(svg.getAttribute('width')).toBe('260');
            expect(svg.getAttribute('height')).toBe('230');
        });

        it('generateHeatmapCells: should render 9 cell elements', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect(compiled.querySelectorAll('rect.cell').length).toEqual(9);
        });

        it('getCellColor: should render cell colors', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement.querySelectorAll('rect.cell');
            expect(compiled[0].style.fill).toBe('rgba(240, 94, 111, 0.718)');
            expect(compiled[8].style.fill).toBe('rgb(240, 94, 111)')
        });

    });

    describe('Render Heatmap bar chart without data', () => {
        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-heatmap-chart [chartWidth]='200' [chartHeight]='200' [consumptionData]=''

               >
              </puc-heatmap-chart>`
                }
            });
        });
        it('generateHeatmapCells: should not render cells', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect(compiled.querySelectorAll('rect.cell').length).toEqual(0);
        });


    });

    describe('Render Heatmap chart without x axis & y axis and without color set', () => {
        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-heatmap-chart
                [chartWidth]='200' [chartHeight]='200'
                [xAxis]='false' [yAxis]='false'
                [consumptionData]='results'>
              </puc-heatmap-chart>`
                }
            });
        });

        it('should set the svg width and height', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const svg = fixture.debugElement.nativeElement.querySelector('svg');
            expect(svg.getAttribute('width')).toBe('260');
            expect(svg.getAttribute('height')).toBe('230');
        });

        it('plotXAxes: should not render the x axix labels', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect(compiled.querySelectorAll('.axis--x g.tick').length).toEqual(0);
        });

        it('plotYAxes: should not render the y axis labels', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect(compiled.querySelectorAll('.axis--y g.tick').length).toEqual(0);
        });

        it('getCellColor: should render cells with default colors', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement.querySelectorAll('rect.cell');
            expect(compiled[0].style.fill).toBe('rgba(233, 94, 111, 0.718)');
            expect(compiled[8].style.fill).toBe('rgb(233, 94, 111)')
        });
    });

    describe('Render Heatmap chart with aggregated columns & rows', () => {
        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-heatmap-chart
                [chartWidth]='200' [chartHeight]='200'
                [showAggregate]='true'
                [xAxis]='false' [yAxis]='false'
                [consumptionData]='results'>
              </puc-heatmap-chart>`
                }
            });
        });

        it('should set the svg width and height', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const svg = fixture.debugElement.nativeElement.querySelector('svg');
            expect(svg.getAttribute('width')).toBe('360');
            expect(svg.getAttribute('height')).toBe('330');
        });

        it('generateVerticalBar,generateHorizontalBar: should render 7 bars for show aggregate row & columns', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect(compiled.querySelectorAll('rect.bar').length).toEqual(7);
        });
    });

    describe('Testing other than chart related functions', () => {
        let component: HeatmapChartComponent;
        let fixture: ComponentFixture<HeatmapChartComponent>;
        beforeEach(() => {
            fixture = TestBed.createComponent(HeatmapChartComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('processData: Should create series of data', () => {
            component.chartData.unit = results.unit;
            component.chartData.labels = results.columns;
            component.chartData.columns = results.columns;
            component.chartData.readings = results.readings;
            component.createChart();
            expect(component.seriesData.length).toEqual(9);
            expect(component.seriesData[0].key).toEqual('D1');
            expect(component.seriesData[0].value).toEqual(120);
        });

        it('getMaxValue: get maximun value from the list', () => {
            const data = [{ key: 'a', value: 10 }, { key: 'b', value: 20 }];
            const res = component.getMaxValue(data);
            expect(res).toEqual(20);
        })

        it('getMaxValue: get domain value with passing empty values', () => {
            const data = null;
            const res = component.getMaxValue(data);
            expect(res).toEqual(0);
        })


        it('generateVerticaldata: generate vertical bar data for aggregated columns', () => {
            component.seriesData = [{ key: 'D1', hvacElectricity: 120, id: 1, name: 'Floor1', value: 120 },
            { key: 'D1', hvacElectricity: 120, id: 2, name: 'Floor2', value: 120 },
            { key: 'D2', hvacElectricity: 210, id: 1, name: 'Floor1', value: 210 },
            { key: 'D3', hvacElectricity: 10, id: 1, name: 'Floor1', value: 10 }];
            const res = component.generateVerticaldata();
            expect(res.length).toEqual(3);
            expect(res[0].value).toEqual(240);
        });

        it('generateHorizontaldata: generate horizontal bar data for aggregated rows ', () => {
            component.seriesData = [{ key: 'D1', hvacElectricity: 120, id: 1, name: 'Floor1', value: 120 },
            { key: 'D2', hvacElectricity: 210, id: 1, name: 'Floor1', value: 210 },
            { key: 'D3', hvacElectricity: 10, id: 1, name: 'Floor1', value: 10 }]
            const res = component.generateHorizontaldata();
            expect(res.length).toEqual(1);
            expect(res[0].value).toEqual(340);
        });

        it('generateVerticaldata: vertical bar data for aggregated rows count should be 0', () => {
            component.chartData = null;
            const res = component.generateVerticaldata();
            expect(res.length).toEqual(0);
        });

        it('generateHorizontaldata: horizontal bar data for aggregated rows count should be 0', () => {
            component.chartData = null;
            const res = component.generateHorizontaldata();
            expect(res.length).toEqual(0);
        });

        it('getTotal: get the total from the array', () => {
            const data = [{ value: 10, id: 1 }, { value: 20, id: 2 }, { id: 3 }];
            const res = component.getTotal(data);
            expect(res).toEqual(30);
        });

        it('processData: Should create series of data', () => {
            component.chartData.unit = results.unit;
            component.chartData.labels = results.columns;
            component.chartData.columns = results.columns;
            component.chartData.readings = results.readings;
            component.createChart();
            expect(component.seriesData.length).toEqual(9);
            expect(component.seriesData[0].value).toEqual(120);
        });

    })
})

