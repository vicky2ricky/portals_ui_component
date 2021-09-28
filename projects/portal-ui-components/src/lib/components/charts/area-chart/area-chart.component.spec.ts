import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AreaChartComponent } from './area-chart.component';
import { Component } from '@angular/core';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

const colorSet = {
    hvacElectricity: '#EF9453',
    hvacGas: '#BF9453',
    light: '#879453',
}

const results = {
    unit: 'kWh',
    labels: [
        'D0',
        'D1',
        'D2',
        'D3',
        'D4',
        'D5',
        'D6',
        'D7',
        'D8',
        'D9'
    ],
    rows: 2,
    columns: [
        'hvacElectricity',
        'hvacGas',
        'light'
    ],
    mappings: {
        hvacElectricity: 'Hvac Electricity',
        hvacGas: 'Hvac Gas',
        light: 'Light'
    },
    readings: [
        {
            index: 0,
            hvacElectricity: 0,
            hvacGas: 0,
            light: 0
        },
        {
            index: 1,
            hvacElectricity: 21.43,
            hvacGas: 21.21,
            light: 12
        },
        {
            index: 2,
            hvacElectricity: 12.56,
            hvacGas: 11.23,
            light: 23
        }
    ],
    groupBy:''
}
@Component({
    selector: 'puc-test-component',
    template: ''
})
class TestComponent {
    results: any = results;
    colorSet: any = colorSet;
}
describe('Component: AreaChartComponent', () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, AreaChartComponent]
        });
    });

    describe('Render Area chart', () => {

        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-area-chart [chartWidth]='200' [chartHeight]='200' [consumptionData]='results'>
              </puc-area-chart>`
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

        it('generateAreaCurves: should render 3 area elements', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect(compiled.querySelectorAll('path.area-path').length).toEqual(3);
        });


    });

    describe('Should set color code for the area paths', () => {

        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-area-chart [chartWidth]='200' [chartHeight]='200' [colorSet]='colorSet'
               [consumptionData]='results'>
              </puc-area-chart>`
                }
            });
        });

        it('getColor: should set the colors for area paths', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement.querySelectorAll('.area-path');
            expect(compiled[0].getAttribute('fill')).toBe('#EF9453');
            expect(compiled[1].getAttribute('fill')).toBe('#BF9453');
            expect(compiled[2].getAttribute('fill')).toBe('#879453');
        });

    });

    describe('Render Area chart without data', () => {

        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-area-chart [chartWidth]='200' [chartHeight]='200' [consumptionData]=''>
              </puc-area-chart>`
                }
            });
        });

        it('generateAreaCurves: should not render area paths', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect(compiled.querySelectorAll('path.area-path').length).toEqual(0);
        });

    });

    describe('Area chart without x axis & y axis', () => {

        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-area-chart
                [chartWidth]='200' [chartHeight]='200'
                [xAxis]='false' [yAxis]='false'
                [consumptionData]='results'>
              </puc-area-chart>`
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

    });

    describe('Testing other than chart related functions', () => {

        let component: AreaChartComponent;
        let fixture: ComponentFixture<AreaChartComponent>;
        beforeEach(() => {
            fixture = TestBed.createComponent(AreaChartComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('processData: Should create series of data', () => {
            component.chartData = results;
            component.createChart();
            expect(component.stackedValues.length).toEqual(3);
        });

        it('getYDomain: get domain value', () => {
            const data = [[[0, 10], [0, 20]]];
            const res = component.getYDomain(data);
            expect(res[0]).toEqual(0);
            expect(res[1]).toEqual(20);
        })

        it('getYDomain: get domain value with passing empty values', () => {
            const data = null;
            const res = component.getYDomain(data);
            expect(res[0]).toEqual(0);
            expect(res[1]).toEqual(0);
        })

        it('getColor: should get default color without passing color set', () => {
            const res = component.getColor('test');
            fixture.detectChanges();
            expect(res).toEqual('#EF9453');
        })

        it('getColor: should get fetch color according to color set', () => {
            component.colorSet = colorSet;
            fixture.detectChanges();
            const res = component.getColor('hvacElectricity');
            expect(res).toEqual('#EF9453');
        })
    })
});
