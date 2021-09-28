import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartVerticalComponent } from '../bar-chart-vertical/bar-chart-vertical.component';

import { BaseChartComponent } from './base-chart.component';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
declare const d3v5: any;
const colorSet = {
  benchMark: '#E95E6F',
  actual: '#EF9453'
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
describe('Component: BaseChartComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, BaseChartComponent, BarChartVerticalComponent]
    });
  });
  describe('Render vertical bar chart using base chart', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
       <puc-bar-chart-vertical [chartWidth]='200' [chartHeight]='200' [consumptionData]='results'>
      </puc-bar-chart-vertical>`
        }
      });
    });
    it('createChart,update:should set the svg width and height', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const svg = fixture.debugElement.nativeElement.querySelector('svg');
      expect(svg.getAttribute('width')).toBe('260');
      expect(svg.getAttribute('height')).toBe('230');
    });
  });

  describe('Render vertical bar chart by passing view', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
       <puc-bar-chart-vertical [view]='[100,100]'  [consumptionData]='results'>
      </puc-bar-chart-vertical>`
        }
      });
    });
    it('createChart,update:should set the svg width and height', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const svg = fixture.debugElement.nativeElement.querySelector('svg');
      expect(svg.getAttribute('width')).toBe('160');
      expect(svg.getAttribute('height')).toBe('130');
    });
  });

  describe('Render vertical bar chart without passing width & height', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
       <puc-bar-chart-vertical  [consumptionData]='results'>
      </puc-bar-chart-vertical>`
        }
      });
    });
    it('createChart,update:should set the svg width and height', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const svg = fixture.debugElement.nativeElement.querySelector('svg');
      expect(svg.getAttribute('width')).toBe('660');
      expect(svg.getAttribute('height')).toBe('230');
    });
  });
  describe('Testing other than chart related functions', () => {

    let component: BaseChartComponent;
    let fixture: ComponentFixture<BaseChartComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [BaseChartComponent]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(BaseChartComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('mouseLeave: change style for tooltip on mouse leave', () => {
      component.toolTip = d3v5.select('body')
        .append('div')
        .attr('class', 'tooltip-container1')
        .style('visibility', 'hidden')
        .style('position', 'absolute');
      component.mouseLeave('d', 0);
      const tooltipContainer: HTMLElement = document.querySelector('.tooltip-container1');
      expect(tooltipContainer.style.opacity).toBe('0');
      expect(tooltipContainer.style.position).toBe('absolute');
    });

    it('mouseLeave: should not apply styling if tooltip not existed on mouse leave', () => {
      component.toolTip = null;
      component.mouseLeave('d', 0);
      expect(component.toolTip).toBeNull();
    });

  })

});
