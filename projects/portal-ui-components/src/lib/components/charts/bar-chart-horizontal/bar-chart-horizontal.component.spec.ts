import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BarChartHorizontalComponent } from './bar-chart-horizontal.component';
import { Component } from '@angular/core';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
const colorSet = {

    benchMark: '#E95E6F'
}
const results = {
    unit: 'kWh',
    rows: 2,
    labels: [
        'Bench Mark',
        'Actual'
    ],
    columns: [
        'benchMark'
    ],
    mappings: {
        benchMark: 'Bench Mark'
    },
    readings: [
        {
            index: 0,
            benchMark: 245
        },
        {
            index: 1,
            benchMark: 400
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
describe('Component: BarChartHorizontalComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, BarChartHorizontalComponent]
        })
    }));

    describe('Render Horizontal bar chart', () => {
        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
           <puc-bar-chart-horizontal [chartWidth]='200' [chartHeight]='200' [consumptionData]='results'>
          </puc-bar-chart-horizontal>`
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

        it('generateBarData: should render 2 cell elements', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement;
            expect(compiled.querySelectorAll('rect.bar').length).toEqual(2);
        });
    });

    describe('Should set color code for the bars & tooltips', () => {
        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-bar-chart-horizontal [chartWidth]='200' [chartHeight]='200' [colorSet]='colorSet'
               [consumptionData]='results'>
              </puc-bar-chart-horizontal>`
                }
            });
        });

        it('getColor: should set the colors for bars', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const compiled = fixture.debugElement.nativeElement.querySelectorAll('.barGroup');
            expect(compiled[0].getAttribute('fill')).toBe('#E95E6F');
        });

        it('mouseOver: Should show tooltip on mouse over', () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            document.querySelector('.bar').dispatchEvent(new MouseEvent('mouseover'));
            const tooltipList = fixture.debugElement.nativeElement.querySelectorAll('.toolTipList li');
            expect(tooltipList.length).toBe(1);
            expect(tooltipList[0].style.color).toBe('rgb(233, 94, 111)');
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

    describe('Render Horizontal bar chart without data', () => {
        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
               <puc-bar-chart-horizontal [chartWidth]='200' [chartHeight]='200' [consumptionData]=''>
              </puc-bar-chart-horizontal>`
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
               <puc-bar-chart-horizontal
                [chartWidth]='200' [chartHeight]='200'
                [xAxis]='false' [yAxis]='false'
                [consumptionData]='results'>
              </puc-bar-chart-horizontal>`
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
        let component: BarChartHorizontalComponent;
        let fixture: ComponentFixture<BarChartHorizontalComponent>;
        beforeEach(() => {
            fixture = TestBed.createComponent(BarChartHorizontalComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('getXDomain: get domain value', () => {
            const data = [[[0, 10], [0, 20]]];
            const res = component.getXDomain(data);
            expect(res[0]).toEqual(0);
            expect(res[1]).toEqual(20);
        })

        it('getXDomain: get domain value with passing empty values', () => {
            const data = null;
            const res = component.getXDomain(data);
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
            expect(res).toEqual('#E95E6F');
        })
    })
});
