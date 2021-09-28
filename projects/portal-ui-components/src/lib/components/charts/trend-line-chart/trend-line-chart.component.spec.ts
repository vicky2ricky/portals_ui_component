import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PucComponentsModule } from '../../components.module';
import { TrendLineChartComponent } from './trend-line-chart.component';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
const data = {
  startDate: '2020-09-12T00:00:00.999Z',
  endDate: '2020-09-18T23:59:59.999Z',
  labels: {
    '2020-09-12T00:00:00': 'D0',
    '2020-09-13T00:00:00': 'D1',
    '2020-09-14T00:00:00': 'D2',
    '2020-09-15T00:00:00': 'D3',
    '2020-09-16T00:00:00': 'D4',
    '2020-09-17T00:00:00': 'D5',
    '2020-09-18T00:00:00': 'D6',
  },
  charts: [
    {
      chartName: 'VAV-Equip#1',
      chartId: 'chart1',
      points: [
        {
          pointLabel: 'Target Temperature',
          pointRef: '5f1f30ab18bcbf4f1d9a1db2',
          colorType: 'hex',
          colorCode: '#424242',
          plotType: 'line',
          timezone: 'Chicago',
          unit: 'F',
          equipRef: '@5f50e44392c6006b83db5aa2',
          equipLabel: 'VAV1000',
          timePeriods: [
            { val: 90.1, ts: '2020-09-12T04:50:00Z' },
            { val: 92.1, ts: '2020-09-12T04:55:00Z' },
            { val: 93.1, ts: '2020-09-13T04:50:00Z' },
            { val: 101.1, ts: '2020-09-13T05:50:00Z' },
            { val: 101.1, ts: '2020-09-13T06:00:00Z' },
            { val: 190.1, ts: '2020-09-15T04:45:00Z' },
            { val: null, ts: '2020-09-16T04:45:00Z' },
            { val: 30.1, ts: '2020-09-18T05:50:00Z' },
            { val: 70.1, ts: '2020-09-18T09:50:00Z' }
          ]
        }
      ]
    },
    {
      chartName: 'desiredTempHeating',
      chartId: 'chart2',
      points: [
        {
          pointLabel: 'Target Temperature',
          pointRef: '5f1f30ab18bcbf4f1d9a1db2',
          colorType: 'hex',
          colorCode: '#424242',
          plotType: 'line',
          timezone: 'Chicago',
          unit: 'F',
          equipRef: '@5f50e44392c6006b83db5aa2',
          equipLabel: 'VAV1000',
          timePeriods: [
            { val: 90.1, ts: '2020-09-12T04:50:00Z' },
            { val: 92.1, ts: '2020-09-12T04:55:00Z' },
            { val: 93.1, ts: '2020-09-13T04:50:00Z' },
            { val: 101.1, ts: '2020-09-13T05:50:00Z' },
            { val: 101.1, ts: '2020-09-13T06:00:00Z' },
            { val: 190.1, ts: '2020-09-15T04:45:00Z' },
            { val: null, ts: '2020-09-16T04:45:00Z' },
            { val: 30.1, ts: '2020-09-18T05:50:00Z' },
            { val: 70.1, ts: '2020-09-18T09:50:00Z' }
          ]
        },
        {
          pointLabel: 'Desired target Temperature',
          pointRef: '5f1f30ab18bcbf4f1d9a1db2',
          colorType: 'hex',
          colorCode: '#424242',
          plotType: 'dashed',
          timezone: 'Chicago',
          unit: 'F',
          equipRef: '@5f50e44392c6006b83db5aa2',
          equipLabel: 'VAV1000',
          timePeriods: [
            { val: 90.1, ts: '2020-09-12T04:50:00Z' },
            { val: 11, ts: '2020-09-12T07:50:00Z' },
            { val: 201, ts: '2020-09-12T08:20:00Z' },
            { val: 201, ts: '2020-09-16T08:20:00Z' },
          ]
        },
        {
          pointLabel: 'Comfort Index',
          pointRef: '5f1f30ab18bcbf4f1d9a1db2',
          colorType: 'hex',
          colorCode: '#788896',
          plotType: 'area',
          timezone: 'Chicago',
          unit: 'F',
          equipRef: '@5f50e44392c6006b83db5aa2',
          equipLabel: 'VAV1000',
          timePeriods: [
            { val: 90.1, ts: '2020-09-12T04:50:00Z' },
            { val: 110.1, ts: '2020-09-12T05:50:00Z' },
            { val: 120.2, ts: '2020-09-12T06:50:00Z' },
            { val: 11, ts: '2020-09-13T04:50:00Z' },
            { val: 201, ts: '2020-09-14T04:50:00Z' },
          ]
        },
        {
          pointLabel: 'Target Temperature',
          pointRef: '5f1f30ab18bcbf4f1d9a1db2',
          colorType: 'hex',
          colorCode: '#C660D7',
          plotType: 'barChartVert',
          timezone: 'Chicago',
          unit: 'F',
          equipRef: '@5f50e44392c6006b83db5aa2',
          equipLabel: 'VAV1000',
          timePeriods: [
            { val: 90.1, ts: '2020-09-12T04:50:00Z' },
            { val: 110.1, ts: '2020-09-12T05:50:00Z' },
            { val: 120.2, ts: '2020-09-12T06:50:00Z' },
            { val: 11, ts: '2020-09-13T04:50:00Z' },
            { val: 201, ts: '2020-09-14T04:50:00Z' },
          ]
        },
      ]
    }
  ]
};
const singleChart = {
  startDate: '2020-09-12T00:00:00.999Z',
  endDate: '2020-09-18T23:59:59.999Z',
  labels: {
    '2020-09-12T00:00:00': 'D0',
    '2020-09-13T00:00:00': 'D1',
    '2020-09-14T00:00:00': 'D2',
    '2020-09-15T00:00:00': 'D3',
    '2020-09-16T00:00:00': 'D4',
    '2020-09-17T00:00:00': 'D5',
    '2020-09-18T00:00:00': 'D6',
  },
  charts: [
    {
      chartName: 'DAB#1',
      chartId: 'chart3',
      points: [
        {
          pointLabel: 'Target Temperature',
          pointRef: '5f1f30ab18bcbf4f1d9a1db2',
          colorType: 'hex',
          colorCode: '#424242',
          plotType: 'line',
          timezone: 'Chicago',
          unit: 'F',
          equipRef: '@5f50e44392c6006b83db5aa2',
          equipLabel: 'VAV1000',
          timePeriods: [
            { val: 90.1, ts: '2020-09-12T04:50:00Z' },
            { val: 92.1, ts: '2020-09-12T04:55:00Z' },
            { val: 93.1, ts: '2020-09-13T04:50:00Z' },
            { val: 101.1, ts: '2020-09-13T05:50:00Z' },
            { val: 101.1, ts: '2020-09-13T06:00:00Z' },
            { val: 190.1, ts: '2020-09-15T04:45:00Z' },
            { val: null, ts: '2020-09-16T04:45:00Z' },
            { val: 30.1, ts: '2020-09-18T05:50:00Z' },
            { val: 70.1, ts: '2020-09-18T09:50:00Z' }
          ]
        }
      ]
    },

  ]
};

@Component({
  selector: 'puc-test-component',
  template: ''
})
class TestComponent {
  results: any = data;
  singleChart: any = singleChart;
}

describe('Component: TrendLineChartComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [PucComponentsModule]
    });
  });

  describe('Render Trend line chart', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
         <puc-trend-line-chart [chartWidth]='200' [chartHeight]='200' [consumptionData]='results'>
        </puc-trend-line-chart>`
        }
      });
    });

    it('should set the svg width and height', async () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      const compiled = fixture.debugElement.nativeElement;
      const graphContentList = compiled.querySelectorAll('svg');
      graphContentList.forEach(svg => {
        expect(svg.getAttribute('width')).toBe('260');
        expect(svg.getAttribute('height')).toBe('230');
      });
    });

    it('generateLineData: should render line elements', async () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('path.line').length).toEqual(2);
      expect(compiled.querySelectorAll('path.dashed').length).toEqual(1);
    });

    it('generateAreaData: should render area elements', async () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('path.area').length).toEqual(1);
    });

    it('generateVerticalData: should render vertical bars', async () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('rect.bar').length).toEqual(5);
    });

    it('should set the colors for all the types of charts', async () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      const compiled = fixture.debugElement.nativeElement;
      const compiledLine = compiled.querySelectorAll('path.line');
      const compiledDashed = compiled.querySelectorAll('path.dashed');
      const compiledArea = compiled.querySelectorAll('.area');
      const compiledBar = compiled.querySelectorAll('.bar');
      expect(compiledLine[0].style.stroke).toBe('rgb(66, 66, 66)');
      expect(compiledArea[0].getAttribute('fill')).toBe('#788896');
      expect(compiledBar[0].getAttribute('fill')).toBe('#C660D7');
      expect(compiledDashed[0].style.stroke).toBe('rgb(66, 66, 66)');
    });

    it('mouseOver: Should show tooltip on mouse over', async () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('.overlay').dispatchEvent(new MouseEvent('mouseover'));
      const tooltipContainer = compiled.querySelector('.trendToolTip');
      expect(tooltipContainer.style.visibility).toBe('visible');
    })

    it('mouseMove: Should set position for tooltip on mouse move', async () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      document.querySelector('#chart2 .overlay').dispatchEvent(new MouseEvent('mousemove'));
      const tooltipContainer = fixture.debugElement.nativeElement.querySelector('.trendToolTip');
      expect(tooltipContainer.style.top).toBeDefined();
      expect(tooltipContainer.style.right).toBeDefined();
    })

    it('mouseLeave: Should hide tooltip container', async () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      document.querySelector('.overlay').dispatchEvent(new MouseEvent('mouseleave'));
      const tooltipContainer = fixture.debugElement.nativeElement.querySelector('.tooltip-container');
      expect(tooltipContainer.style.visibility).toBe('hidden');
    })
  })

  describe('Line chart without x axis & y axis', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
           <puc-trend-line-chart
            [chartWidth]='200' [chartHeight]='200'
            [xAxis]='false' [yAxis]='false'
            [consumptionData]='results'>
          </puc-trend-line-chart>`
        }
      });
    });

    it('plotSvgXAxes: should not render the x axix labels', async () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('.axis--x g.tick').length).toEqual(0);
    });

    it('plotSvgYAxes: should not render the y axis labels', async () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('.axis--y g.tick').length).toEqual(0);
    });

  });

  describe('Should show tooltips for all the trend line chart on hover', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
           <puc-trend-line-chart
            [chartWidth]='200' [chartHeight]='200'
            [xAxis]='false' [yAxis]='false' [hasGlobalLevelMouseEvents]="true"
            [consumptionData]='results'>
          </puc-trend-line-chart>
          <puc-trend-line-chart
            [chartWidth]='200' [chartHeight]='200'
            [xAxis]='false' [yAxis]='false' [hasGlobalLevelMouseEvents]="true"
            [consumptionData]='singleChart'>
          </puc-trend-line-chart>
          `
        }
      });
    });

    it('mouseMove: Should set position for tooltip on mouse move', async () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      document.querySelector('#chart2 .overlay').dispatchEvent(new MouseEvent('mousemove'));
      const tooltipContainer = fixture.debugElement.nativeElement.querySelector('.trendToolTip');
      expect(tooltipContainer.style.top).toBeDefined();
      expect(tooltipContainer.style.right).toBeDefined();
    })

  })
  describe('Testing other than chart related functions', () => {

    let component: TrendLineChartComponent;
    let fixture: ComponentFixture<TrendLineChartComponent>;
    beforeEach(() => {
      fixture = TestBed.createComponent(TrendLineChartComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('processData: Should create series of data', () => {
      component.chartData = data;
      component.createChart();
      expect(component.charts.length).toEqual(2);
    });

    it('getYDomain: get domain value', () => {
      const yValues = [{ timePeriods: [{ val: 10 }, { val: 20 }] }];
      const res = component.getYDomain(yValues);
      expect(res[0]).toEqual(0);
      expect(res[1]).toEqual(20);
    });

    it('getYDomain: get domain value with passing empty values', () => {
      const yValues = null;
      const res = component.getYDomain(yValues);
      expect(res[0]).toEqual(0);
      expect(res[1]).toEqual(0);
    });

    it('flattenByPropery: flatten data by using property', () => {
      const inputData = [{ timePeriods: [1, 2] }, { timePeriods: [3, 4] }];
      const res = component.flattenByPropery(inputData, 'timePeriods');
      expect(res.length).toEqual(4);
    });

    it('flattenByPropery: flatten empty data by using property', () => {
      const inputData = [];
      const res = component.flattenByPropery(inputData, 'timePeriods');
      expect(res.length).toEqual(0);
    });

    it('flattenByPropery: pass invalid property for flatten', () => {
      const inputData = [{ timePeriods: [1, 2] }, { timePeriods: [3, 4] }];
      const res = component.flattenByPropery(inputData, 'dummy');
      expect(res.length).toEqual(2);
    });

  })
})
