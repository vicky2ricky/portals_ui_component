import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AverageDemandComponent } from './average-demand.component';
import { Component } from '@angular/core';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
const data = {
  unit: 'kWh',
  rows: 25,
  readings: [
    {
      label: '00:00',
      value: 10
    },
    {
      label: '01:00',
      value: 15
    },
    {
      label: '02:00',
      value: 20
    },
    {
      label: '03:00',
      value: 20
    },
    {
      label: '04:00',
      value: 20
    },
    {
      label: '05:00',
      value: 20
    },
    {
      label: '06:00',
      value: 20
    },
    {
      label: '07:00',
      value: 20
    },
    {
      label: '08:00',
      value: 70
    },
    {
      label: '09:00',
      value: 120
    },
    {
      label: '10:00',
      value: 140
    },
    {
      label: '11:00',
      value: 160
    },
    {
      label: '12:00',
      value: 200
    },
    {
      label: '13:00',
      value: 154
    },
    {
      label: '14:00',
      value: 119
    },
    {
      label: '15:00',
      value: 210
    },
    {
      label: '16:00',
      value: 170
    },
    {
      label: '17:00',
      value: 140
    },
    {
      label: '18:00',
      value: 108
    },
    {
      label: '19:00',
      value: 78
    },
    {
      label: '20:00',
      value: 54
    },
    {
      label: '21:00',
      value: 32
    },
    {
      label: '22:00',
      value: 18
    },
    {
      label: '23:00',
      value: 13
    },
    {
      label: '00:00',
      value: 10
    }
  ]
}
const colorSet = {
  baseColor: '#EF7878'
}
@Component({
  selector: 'puc-test-component',
  template: ''
})
class TestComponent {
  results: any = data;
  colorSet: any = colorSet;
}
describe('Component: AverageDemandComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, AverageDemandComponent]
    })
  }));

  describe('Render Average demand chart', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
       <puc-average-demand [chartWidth]='200' [chartHeight]='200' [consumptionData]='results'>
      </puc-average-demand>`
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

    it('generateBarChart: should render 25 cell elements', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('rect.bar').length).toEqual(25);
    });
  });

  describe('Should set color code for the bars & tooltips', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
           <puc-average-demand [chartWidth]='200' [chartHeight]='200' [colorSet]='colorSet'
           [consumptionData]='results'>
          </puc-average-demand>`
        }
      });
    });

    it('getColor: should set the colors for bars', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement.querySelectorAll('.bar');
      expect(compiled[0].getAttribute('fill')).toBe('rgba(239, 120, 120, 0.15)');
    });

    it('mouseOver: Should show tooltip on mouse over', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      document.querySelector('.bar').dispatchEvent(new MouseEvent('mouseover'));
      const tooltipList = fixture.debugElement.nativeElement.querySelectorAll('.chartToolTip div');
      expect(tooltipList.length).toBe(2);
    });

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
           <puc-average-demand [chartWidth]='200' [chartHeight]='200' [consumptionData]=''>
          </puc-average-demand>`
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
           <puc-average-demand
            [chartWidth]='200' [chartHeight]='200'
            [xAxis]='false' [yAxis]='false'
            [consumptionData]='results'>
          </puc-average-demand>`
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
    let component: AverageDemandComponent;
    let fixture: ComponentFixture<AverageDemandComponent>;
    beforeEach(() => {
      fixture = TestBed.createComponent(AverageDemandComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('getXDomain: get domain value', () => {
      const values = [{ value: 10 }, { value: 20 }];
      const res = component.getXDomain(values);
      expect(res[0]).toEqual(0);
      expect(res[1]).toEqual(20);
    })

    it('getXDomain: get domain value with passing empty values', () => {
      const values = null;
      const res = component.getXDomain(values);
      expect(res[0]).toEqual(0);
      expect(res[1]).toEqual(0);
    })

    it('getColor: should get default color without passing color set', () => {
      const res = component.getColor();
      fixture.detectChanges();
      expect(res).toEqual('#EF9453');
    })

    it('getColor: should get fetch color according to color set', () => {
      component.colorSet = colorSet;
      fixture.detectChanges();
      const res = component.getColor();
      expect(res).toEqual('#EF7878');
    })
  })

});
