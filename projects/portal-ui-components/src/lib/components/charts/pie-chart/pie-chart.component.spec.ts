import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieChartComponent } from './pie-chart.component';
const results: any = {
  unit: 'kWh', partitions: { buildingIdA: 'building A', buildingIdB: 'building B' },
  data: [{ label: 'Floor 1', reading: 170.43, parentId: 'buildingIdA', color: 'rgba(233, 94, 111, 1)' },
  { label: 'Floor 2', reading: 70.21, parentId: 'buildingIdA', color: 'rgba(233, 94, 111, 0.7)' },
  { label: 'Floor 3', reading: 40.32, parentId: 'buildingIdA', color: 'rgba(233, 94, 111, 0.4)' },
  { label: 'Floor 1', reading: 140.54, parentId: 'buildingIdB', color: 'rgba(239, 148, 83, 1)' },
  { label: 'Floor 2', reading: 20, parentId: 'buildingIdB', color: 'rgba(239, 148, 83, 0.8)' },
  { label: 'Floor 3', reading: 90.54, parentId: 'buildingIdB', color: 'rgba(239, 148, 83, 0.6)' },
  { label: 'Floor 4', reading: 80, parentId: 'buildingIdB', color: 'rgba(239, 148, 83, 0.4)' }],
  category: 'Consumption'
}

@Component({
  selector: 'puc-test-component',
  template: ''
})
class TestComponent {
  results: any = results;
}


describe('Component: PieChartComponent', () => {

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, PieChartComponent]
    });
  });

  describe('Render Pie chart', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
           <puc-pie-chart [chartWidth]='200' [chartHeight]='200' [consumptionData]='results'>
          </puc-pie-chart>`
        }
      });
    });

    it('should set the svg width and height', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const svg = fixture.debugElement.nativeElement.querySelector('svg');
      expect(svg.getAttribute('width')).toBe('240');
      expect(svg.getAttribute('height')).toBe('240');
    });

    it('drawPie: should render 7 arc elements', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('path').length).toEqual(7);
    });


  });

  describe('Render donut chart', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
           <puc-pie-chart [donut]="true" [chartWidth]='200' [chartHeight]='200' [consumptionData]='results'>
          </puc-pie-chart>`
        }
      });
    });

    it('should set the svg width and height', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const svg = fixture.debugElement.nativeElement.querySelector('svg');
      expect(svg.getAttribute('width')).toBe('240');
      expect(svg.getAttribute('height')).toBe('240');
    });

    it('drawPie: should render 7 arc elements', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('path').length).toEqual(7);
    });

    it('addCenterText: Should add center text for donut chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      const donutFirstLine = compiled.querySelector('text.donutFirstLine');
      const donutSecondLine = compiled.querySelector('text.donutSecondLine');
      expect(donutFirstLine).toBeDefined();
      expect(donutSecondLine).toBeDefined();
      expect(donutSecondLine.textContent).toContain('Total Energy');
    })


  });

  describe('Should set color code for the arcs & tooltips', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
           <puc-pie-chart [chartWidth]='200' [chartHeight]='200'
           [consumptionData]='results'>
          </puc-pie-chart>`
        }
      });
    });

    it('getColor: should set the colors for arc', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement.querySelectorAll('path');
      expect(compiled[0].getAttribute('fill')).toBe('rgba(233, 94, 111, 1)');
      expect(compiled[1].getAttribute('fill')).toBe('rgba(233, 94, 111, 0.7)');
      expect(compiled[2].getAttribute('fill')).toBe('rgba(233, 94, 111, 0.4)');
      expect(compiled[3].getAttribute('fill')).toBe('rgba(239, 148, 83, 1)');
      expect(compiled[4].getAttribute('fill')).toBe('rgba(239, 148, 83, 0.8)');
      expect(compiled[5].getAttribute('fill')).toBe('rgba(239, 148, 83, 0.6)');
      expect(compiled[6].getAttribute('fill')).toBe('rgba(239, 148, 83, 0.4)');
    });

    it('mouseOver: Should show tooltip on mouse over', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      document.querySelector('path').dispatchEvent(new MouseEvent('mouseover'));
      const tooltipContainer = fixture.debugElement.nativeElement.querySelector('.tooltip-container');
      expect(tooltipContainer.style.visibility).toBe('visible');
    })

    it('mouseMove: Should set position for tooltip on mouse move', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      document.querySelector('path').dispatchEvent(new MouseEvent('mousemove'));
      const tooltipContainer = fixture.debugElement.nativeElement.querySelector('.tooltip-container');
      expect(tooltipContainer.style.top).toBeDefined();
      expect(tooltipContainer.style.right).toBeDefined();
    })

    it('mouseLeave: Should hide tooltip container', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      document.querySelector('path').dispatchEvent(new MouseEvent('mouseleave'));
      const tooltipContainer = fixture.debugElement.nativeElement.querySelector('.tooltip-container');
      expect(tooltipContainer.style.visibility).toBe('hidden');
    })

  });

  describe('Render Pie chart without data', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
           <puc-pie-chart [chartWidth]='200' [chartHeight]='200' [consumptionData]=''>
          </puc-pie-chart>`
        }
      });
    });

    it('drawPie: should not render arc paths', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('path').length).toEqual(0);
    });
  });

  describe('Testing other than chart related functions', () => {

    let component: PieChartComponent;
    let fixture: ComponentFixture<PieChartComponent>;
    beforeEach(() => {
      fixture = TestBed.createComponent(PieChartComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('processData: Should create pie data & total', () => {
      component.chartData = results;
      component.setUpParameters();
      component.processData();
      expect(component.pieData.length).toEqual(7);
      expect(component.total).toEqual('612.04');
    });

    it('processData: Should not create pie data & total', () => {
      component.chartData = null;
      component.setUpParameters();
      component.processData();
      expect(component.pieData.length).toEqual(0);
      expect(component.total).toBe('0.00');
    });

    it('setUpParameters: Should create pie and set radius', () => {
      component.chartWidth = 300;
      component.chartHeight = 200;
      component.setUpParameters();
      expect(component.radius).toEqual(100);
    });

  });

});
