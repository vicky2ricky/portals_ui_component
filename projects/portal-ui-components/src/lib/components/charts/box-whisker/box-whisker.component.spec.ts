import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoxWhiskerComponent } from './box-whisker.component';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
const results = {
  unit: 'kWh', category: 'Consumption', data: [
    {
      name: 'Site 1', id: 'site1', value: 120, floors: [{ label: 'Floor 1', value: 440 }, { label: 'Floor 2', value: 210 },
      { label: 'Floor 3', value: 270 }]
    }, {
      name: 'Site 2', id: 'site2', value: 790, floors: [{ label: 'Floor 1', value: 440 },
      { label: 'Floor 2', value: 350 }]
    }, {
      name: 'Site 3', id: 'site3', value: 420,
      floors: [{ label: 'Floor 1', value: 110 }, { label: 'Floor 2', value: 80 }, { label: 'Floor 3', value: 200 },
      { label: 'Floor 4', value: 30 }]
    }]
}
const colorSet = { whiskerFill: '#f9f9f9', whiskerStroke: '#acacac', barColor: '#e4e4e4', barFullColor: '#E95E6F' }
@Component({
  selector: 'puc-test-component',
  template: ''
})
class TestComponent {
  results: any = results;
  colorSet: any = colorSet;
}
describe('Component: BoxWhiskerComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, BoxWhiskerComponent]
    });
  });

  describe('Render Boxwhisker chart', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
           <puc-box-whisker [chartWidth]='400' [chartHeight]='200' [consumptionData]='results'>
          </puc-box-whisker>`
        }
      });
    });

    it('should set the svg width and height', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const svg = fixture.debugElement.nativeElement.querySelector('svg');
      expect(svg.getAttribute('width')).toBe('430');
      expect(svg.getAttribute('height')).toBe('200');
    });

    it('addWhiskers,setUpBars,addQuartiles,computeStatistics: should render 3 line elements', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('.sitesBar').length).toEqual(3);
      expect(compiled.querySelector('svg').querySelectorAll('rect').length).toEqual(1);
    });


  });

  describe('Should set color code for the box whisker', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
                <puc-box-whisker [chartWidth]='200' [chartHeight]='200' [colorSet]='colorSet'
           [consumptionData]='results'>
          </puc-box-whisker>`
        }
      });
    });

    it('getColor: should set the colors for line', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement.querySelector('svg').querySelectorAll('rect');
      expect(compiled[0].getAttribute('fill')).toBe('#f9f9f9');
      expect(compiled[0].getAttribute('stroke')).toBe('#acacac');
    });

  });

  describe('Render boxwhisker chart without data', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
           <puc-box-whisker [chartWidth]='200' [chartHeight]='200' [consumptionData]=''>
          </puc-box-whisker>`
        }
      });
    });

    it('addWhiskers,setUpBars,addQuartiles,computeStatistics: should not render line paths', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('svg').querySelectorAll('rect').length).toEqual(0);
      expect(compiled.querySelectorAll('.sitesBar').length).toEqual(0);
    });

  });

  describe('Testing other than chart related functions', () => {

    let component: BoxWhiskerComponent;
    let fixture: ComponentFixture<BoxWhiskerComponent>;
    beforeEach(() => {
      fixture = TestBed.createComponent(BoxWhiskerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('processData: Should create series of data', () => {
      component.chartData = results;
      component.createChart();
      expect(component.whiskerData.length).toEqual(3);
    });

    it('processData: Should not create series of data', () => {
      component.chartData = null;
      component.createChart();
      expect(component.whiskerData.length).toEqual(0);
    });

    it('setUpBars: Should create site bars', () => {
      component.chartData = results;
      component.setUpBars();
      expect(component.isChartRendered).toBeTruthy();
      expect(component.chartData.data[0].value).toBe(790);
    });

    it('setUpBars: Should not create site bars', () => {
      component.chartData = null;
      component.setUpBars();
      expect(component.chartData).toBe(null);
    });

    it('siteClicked: Should emit site info', () => {
      spyOn(component.siteClick, 'emit');
      component.siteClicked({ site: 'test' });
      expect(component.siteClick.emit).toHaveBeenCalledWith({ site: 'test' });
    });

  })

})
