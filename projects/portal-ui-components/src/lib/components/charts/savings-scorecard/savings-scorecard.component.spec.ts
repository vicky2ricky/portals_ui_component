import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsScorecardComponent } from './savings-scorecard.component';
import { IconsModule } from '../../../icons/icons.module';
import { Component } from '@angular/core';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
const savingsData = {
  unit: 'kWh',
  currencyUnit: 'USD',
  data: {
    actual: 1000,
    benchmark: 1200,
    savings: 200,
    savingsInCurrency: 100
  },
  mappings: {
    actual: 'Actual',
    benchmark: 'Benchmark',
    savings: 'Savings',
  }
};
const colorSet = {
  benchmark:'rgb(82, 98, 255)',
actual:'rgb(222, 222, 222)',
savings:'rgb(25, 130, 18)'
}
@Component({
  selector: 'puc-test-component',
  template: ''
})
class TestComponent {
  savingsData: any = savingsData;
  colorSet:any  = colorSet;
}

describe('Component: SavingsScorecardComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
        declarations: [TestComponent, SavingsScorecardComponent],
        imports:[IconsModule]
    });
  });

  describe('Render savings scorecard chart with data & color set', () => {

    beforeEach(() => {
        TestBed.overrideComponent(TestComponent, {
            set: {
                template: `
           <puc-savings-scorecard [chartData]='savingsData' [colorSet]="colorSet">
          </puc-savings-scorecard>`
            }
        });
    });

    it('should pass savings data to the chart', () => {
        const fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement.querySelectorAll('.value');
        expect(compiled[0].innerText).toBe('1000 kWh');
        expect(compiled[1].innerText).toBe('1200 kWh');
        expect(compiled[2].innerText.trim()).toContain('200 kWh    |    USD100');
    });

    it('should colorset to the chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const actual = fixture.debugElement.nativeElement.querySelector('.actual');
      const benchmark = fixture.debugElement.nativeElement.querySelector('.benchmark');
      expect(actual.style.backgroundColor).toEqual(colorSet.actual);
      expect(benchmark.style.backgroundColor).toEqual(colorSet.benchmark);
    });

});

describe('Render savings scorecard chart withour color set & data', () => {

  beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
          set: {
              template: `
         <puc-savings-scorecard >
        </puc-savings-scorecard>`
          }
      });
  });

  it('should pass savings data to the chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement.querySelectorAll('.value');
      expect(compiled[0].innerText).toBe('N.A');
      expect(compiled[1].innerText).toBe('N.A');
      expect(compiled[2].innerText.trim()).toContain('N.A');
  });

  it('should colorset to the chart', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const actual = fixture.debugElement.nativeElement.querySelector('.actual');
    const benchmark = fixture.debugElement.nativeElement.querySelector('.benchmark');
    expect(actual.style.backgroundColor).toEqual('');
    expect(benchmark.style.backgroundColor).toEqual('');
  });

});

});
