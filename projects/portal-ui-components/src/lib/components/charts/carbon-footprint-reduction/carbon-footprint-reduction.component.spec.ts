import { TestBed } from '@angular/core/testing';
import { CarbonFootprintReductionComponent } from './carbon-footprint-reduction.component';
import { Component } from '@angular/core';
import { IconsModule } from '../../../icons/icons.module';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
const colorSet = {
  electricitySavings: 'rgb(198, 96, 215)',
  gasSavings: 'rgb(198, 96, 215)'
}
const data = {
  unit: 'lbs',
  data: {
    electricitySavings: 12850,
    gasSavings: 7000
  },
  mappings: {
    electricitySavings: 'Electricity Savings',
    gasSavings: 'Gas Savings'
  }
};
const electricitySavingsData = {
  unit: 'lbs',
  data: {
    electricitySavings: 12850,
    gasSavings: null
  },
  mappings: {
    electricitySavings: 'Electricity Savings'
  }
};
@Component({
  selector: 'puc-test-component',
  template: ''
})
class TestComponent {
  chartData: any = data;
  colorSet: any = colorSet;
  electricitySavingsData: any = electricitySavingsData;
}
describe('Component: CarbonFootprintReductionComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, CarbonFootprintReductionComponent],
      imports: [IconsModule]
    });
  });

  describe('Render carbon footprint reduction chart with data & color set', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
           <puc-carbon-footprint-reduction [chartData]='chartData' [colorSet]="colorSet">
          </puc-carbon-footprint-reduction>`
        }
      });
    });

    it('should pass carbon footprint data to the chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement.querySelectorAll('.value');
      expect(compiled[0].innerText).toBe('12850 lbs of Carbon');
      expect(compiled[1].innerText).toBe('7000 lbs of Carbon');
    });

    it('should pass colorset to the chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const electrictyIcon = fixture.debugElement.nativeElement.querySelector('puc-electricty-icon path');
      const gasIcon = fixture.debugElement.nativeElement.querySelector('puc-electricty-icon path');
      expect(electrictyIcon.style.fill).toBe('rgb(198, 96, 215)');
      expect(gasIcon.style.fill).toBe('rgb(198, 96, 215)');
    });
  });

  describe('Render carbon footprint reduction chart without data & color set', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
         <puc-carbon-footprint-reduction >
        </puc-carbon-footprint-reduction>`
        }
      });
    });

    it('should pass carbon footprint data to the chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement.querySelectorAll('.value');
      expect(compiled.length).toEqual(0);
    });

    it('should not pass colorset to the chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const electrictyIcon = fixture.debugElement.nativeElement.querySelector('puc-electricty-icon path');
      const gasIcon = fixture.debugElement.nativeElement.querySelector('puc-electricty-icon path');
      expect(electrictyIcon).toBe(null);
      expect(gasIcon).toBe(null);
    });
  });

  describe('Render carbon footprint reduction chart with missing data & without passing color set', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
         <puc-carbon-footprint-reduction [chartData]='electricitySavingsData' >
        </puc-carbon-footprint-reduction>`
        }
      });
    });

    it('should pass only electricity savings data to the chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement.querySelectorAll('.value');
      expect(compiled[0].innerText).toBe('12850 lbs of Carbon');
      expect(compiled.length).toEqual(1);
    });

    it('should pass default colorset to the chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const electrictyIcon = fixture.debugElement.nativeElement.querySelector('puc-electricty-icon path');
      const gasIcon = fixture.debugElement.nativeElement.querySelector('puc-electricty-icon path');
      expect(electrictyIcon.style.fill).toBe('rgb(239, 148, 83)');
      expect(gasIcon.style.fill).toBe('rgb(239, 148, 83)');
    });
  });

});
