import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartVerticalComponent } from './bar-chart-vertical.component';
import { Component } from '@angular/core';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
const colorSet = {
    benchMark: 'rgb(233, 94, 111)',
    actual: 'rgb(239, 148, 83)'
}

const results = {
    unit: 'kWh',
    rows: 2,
    mappings: {
        actual: 'Actual',
        benchMark: 'Bench Mark'
    },
    labels: [
        'Bench Mark',
        'Actual'
    ],
    columns: [
        'benchMark',
        'actual'
    ],
    readings: [
        {
            index: 0,
            benchMark: 245,
            actual: 100,
        },
        {
            index: 1,
            actual: 400,
            benchMark: 700,
        }
    ]
}
@Component({
    selector: 'puc-test-component',
    template: ''
})
class TestComponent {
    results: any = results;
    colorSet: any = colorSet;
}

describe('Component: BarChartVerticalComponent', () => {

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, BarChartVerticalComponent]
        });
    });
    describe('Render vertical bar chart', () => {

        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-bar-chart-vertical [chartWidth]='200' [chartHeight]='200' [consumptionData]='results'>
              </puc-bar-chart-vertical>`
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

        it('generateBarData: should render 4 cell elements', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect(compiled.querySelectorAll('rect.bar').length).toEqual(4);
        });


    });

    describe('Should set color code for the bars & tooltips', () => {

        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-bar-chart-vertical [chartWidth]='200' [chartHeight]='200' [colorSet]='colorSet'
               [consumptionData]='results'>
              </puc-bar-chart-vertical>`
                }
            });
        });

        it('getColor: should set the colors for bars', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement.querySelectorAll('.barGroup');
            expect(compiled[0].getAttribute('fill')).toBe('rgb(233, 94, 111)');
            expect(compiled[1].getAttribute('fill')).toBe('rgb(239, 148, 83)');
        });

        it('mouseOver: Should show tooltip on mouse over', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            document.querySelector('.bar').dispatchEvent(new MouseEvent('mouseover'));
            const tooltipList = fixture.debugElement.nativeElement.querySelectorAll('.toolTipList li');
            expect(tooltipList.length).toBe(2);
            expect(tooltipList[0].style.color).toBe('rgb(233, 94, 111)');
            expect(tooltipList[1].style.color).toBe('rgb(239, 148, 83)');
        })

        it('mouseMove: Should set position for tooltip on mouse move', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            document.querySelector('.bar').dispatchEvent(new MouseEvent('mousemove'));
            const tooltipContainer = fixture.debugElement.nativeElement.querySelector('.tooltip-container');
            expect(tooltipContainer.style.top).toBeDefined();
            expect(tooltipContainer.style.right).toBeDefined();
        })

    });

    describe('Render Vertical bar chart without data', () => {

        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-bar-chart-vertical [chartWidth]='200' [chartHeight]='200' [consumptionData]=''>
              </puc-bar-chart-vertical>`
                }
            });
        });

        it('generateBarData: should not render bars', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect(compiled.querySelectorAll('rect.bar').length).toEqual(0);
        });

    });

    describe('Bar chart without x axis & y axis', () => {

        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-bar-chart-vertical
                [chartWidth]='200' [chartHeight]='200'
                [xAxis]='false' [yAxis]='false'
                [consumptionData]='results'>
              </puc-bar-chart-vertical>`
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

        let component: BarChartVerticalComponent;
        let fixture: ComponentFixture<BarChartVerticalComponent>;
        beforeEach(() => {
            fixture = TestBed.createComponent(BarChartVerticalComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
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
            const res = component.getColor('benchMark');
            expect(res).toEqual('rgb(233, 94, 111)');
        })
    })
});
