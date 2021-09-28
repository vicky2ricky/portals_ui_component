import { ChangeDetectionStrategy, NgZone } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TerrainChartComponent } from './terrain-chart.component';
import { Component } from '@angular/core';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
const colorSet = {
  stopColor0: '#f7c325',
  stopColor100: '#9635e2'
}
const results: any = {
  unit: 'kWh',
  columns: [
    'hvacElectricity'
  ],
  mappings: {
    hvacElectricity: 'Hvac Electricity'
  },
  data: [
    {
      site: 'Site 1',
      readings: [
        {
          time: '12:00 AM',
          value: '27.80985'
        },
        {
          time: '1:00 AM',
          value: '27.71966'
        },
        {
          time: '2:00 AM',
          value: '30.4267'
        }

      ]
    },
    {
      site: 'Site 2',
      readings: [
        {
          time: '0:00 AM',
          value: '49.61936'
        },
        {
          time: '1:00 AM',
          value: '48.55022'
        },
        {
          time: '2:00 AM',
          value: '33.47752'
        }
      ]
    },
    {
      site: 'Site 3',
      readings: [
        {
          time: '0:00 AM',
          value: '83.08067'
        },
        {
          time: '1:00 AM',
          value: '65.21374'
        },
        {
          time: '2:00 AM',
          value: '44.80953'
        }
      ]
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

describe('Component: TerrainChartComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TerrainChartComponent, TestComponent]
    })
      .compileComponents();
  }));

  describe('Render Terrain chart', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
       <puc-terrain-chart [chartWidth]='400' [chartHeight]='400' [chartData]='results'>
      </puc-terrain-chart>`,
          changeDetection: ChangeDetectionStrategy.Default
        }
      });
    });


    it('initPlot: should create terrain chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement.querySelector('canvas');
      expect(compiled).toBeDefined();
    });

  });

  describe('Render Terrain chart without data', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
       <puc-terrain-chart [chartWidth]='400' [chartHeight]='400' [chartData]=''>
      </puc-terrain-chart>`,
          changeDetection: ChangeDetectionStrategy.Default
        }
      });
    });

    it('initPlot: should not create terrain chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement.querySelector('canvas');
      expect(compiled).toBeNull();
    });

  });

  describe('Testing other than chart related functions', () => {
    let component: TerrainChartComponent;
    let fixture: ComponentFixture<TerrainChartComponent>;
    beforeEach(() => {
      fixture = TestBed.createComponent(TerrainChartComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('processData: generate z index data', () => {
      component.chartData = results;
      component.processData();
      expect(component.zData.length).toEqual(3);
      expect(component.zData[0][0]).toBe('27.80985');
    })

    it('processData: should not generate z index data', () => {
      component.chartData = null;
      component.processData();
      expect(component.zData.length).toEqual(0);
    })

    it('setXAxisLabels: generate x axis labels', () => {
      component.chartData = results;
      component.setXAxisLabels();
      expect(component.xAxisLabels.length).toEqual(3);
    })

    it('setXAxisLabels: should not generate x axis labels', () => {
      component.chartData = null;
      component.setXAxisLabels();
      expect(component.xAxisLabels.length).toEqual(0);
    })

    it('setYAxisLabels: generate y axis labels', () => {
      component.chartData = results;
      component.setYAxisLabels();
      expect(component.yAxisLabels.length).toEqual(3);
    })

    it('setYAxisLabels: should not generate y axis labels', () => {
      component.chartData = null;
      component.setYAxisLabels();
      expect(component.yAxisLabels.length).toEqual(0);
    })

    it('generateColorScale: generate color scale according to input colors', () => {
      component.generateColorScale(colorSet);
      expect(component.colorScale.length).toEqual(9);
      expect(component.colorScale[0][0]).toEqual(0);
      expect(component.colorScale[0][1]).toEqual('rgba(247,195,37,1)');
    })

    it('generateColorScale: generate color scale according with default colors', () => {
      component.generateColorScale('');
      expect(component.colorScale.length).toEqual(9);
      expect(component.colorScale[0][0]).toEqual(0);
      expect(component.colorScale[0][1]).toEqual('rgba(0,0,252,1)');
      expect(component.colorScale[8][1]).toEqual('rgba(0,255,29,1)');
    });

  })
});
