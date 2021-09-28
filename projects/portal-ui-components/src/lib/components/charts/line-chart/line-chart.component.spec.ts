import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartComponent } from './line-chart.component';
import { Component } from '@angular/core';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

const colorSet = {
    hvacElectricity: 'rgb(233, 94, 111)',
    hvacGas: 'rgb(239, 148, 83)',
    light: 'rgb(239, 148, 83)',
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

describe('Component: LineChartComponent', () => {

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, LineChartComponent]
        });
    });

    describe('Render Line chart', () => {

        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-line-chart [chartWidth]='200' [chartHeight]='200' [consumptionData]='results'>
              </puc-line-chart>`
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

        it('generateLineData: should render 3 line elements', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect(compiled.querySelectorAll('path.chartLine').length).toEqual(3);
        });


    });

    describe('Should set color code for the lines & tooltips', () => {

        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-line-chart [chartWidth]='200' [chartHeight]='200' [colorSet]='colorSet'
               [consumptionData]='results'>
              </puc-line-chart>`
                }
            });
        });

        it('getColor: should set the colors for line', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement.querySelectorAll('.chartLine');
            expect(compiled[0].style.stroke).toBe('rgb(233, 94, 111)');
            expect(compiled[1].style.stroke).toBe('rgb(239, 148, 83)');
            expect(compiled[2].style.stroke).toBe('rgb(239, 148, 83)');
        });

        it('mouseOver: Should show tooltip on mouse over', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            document.querySelector('.hover-region').dispatchEvent(new MouseEvent('mouseover'));
            const tooltipContainer = fixture.debugElement.nativeElement.querySelector('.tooltip-container');
            expect(tooltipContainer.style.visibility).toBe('visible');
        })

        it('mouseMove: Should set position for tooltip on mouse move', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            document.querySelector('.hover-region').dispatchEvent(new MouseEvent('mousemove'));
            const tooltipContainer = fixture.debugElement.nativeElement.querySelector('.tooltip-container');
            const tooltipList = fixture.debugElement.nativeElement.querySelectorAll('.toolTipList li');
            expect(tooltipList.length).toBe(3);
            expect(tooltipList[0].style.color).toBe('rgb(233, 94, 111)');
            expect(tooltipList[1].style.color).toBe('rgb(239, 148, 83)');
            expect(tooltipList[2].style.color).toBe('rgb(239, 148, 83)');
            expect(tooltipContainer.style.top).toBeDefined();
            expect(tooltipContainer.style.right).toBeDefined();
        })

        it('mouseLeave: Should hide tooltip container', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            document.querySelector('.hover-region').dispatchEvent(new MouseEvent('mouseleave'));
            const tooltipContainer = fixture.debugElement.nativeElement.querySelector('.tooltip-container');
            expect(tooltipContainer.style.visibility).toBe('hidden');
        })

    });

    describe('Render Line chart without data', () => {

        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-line-chart [chartWidth]='200' [chartHeight]='200' [consumptionData]=''>
              </puc-line-chart>`
                }
            });
        });

        it('generateLineData: should not render line paths', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect(compiled.querySelectorAll('path.chartLine').length).toEqual(0);
        });

    });

    describe('Line chart without x axis & y axis', () => {

        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-line-chart
                [chartWidth]='200' [chartHeight]='200'
                [xAxis]='false' [yAxis]='false'
                [consumptionData]='results'>
              </puc-line-chart>`
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

        let component: LineChartComponent;
        let fixture: ComponentFixture<LineChartComponent>;
        beforeEach(() => {
            fixture = TestBed.createComponent(LineChartComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('processData: Should create series of data', () => {
            component.chartData = results;
            component.createChart();
            expect(component.seriesData.length).toEqual(3);
        });

        it('getYDomain: get domain value', () => {
            const data = [{ data: [{ value: 10 }, { value: 20 }] }];
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
            expect(res).toEqual('rgb(233, 94, 111)');
        })
    })
});
