import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PucComponentsModule } from '../../components.module';

import { DonutCombinationComponent } from './donut-combination.component';
const colorSet = { total: '#4B5C6B', hvacElectricity: '#E95E6F', hvacGas: '#EF9453', light: '#F7C325' };
const verResults = {
  otherChartType: 'vertical',
  groupBy: 'Daily',
  category: 'Energy',
  unit: 'kWh',
  labels: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9'],
  rows: 9,
  columns: ['hvacElectricity', 'hvacGas', 'light'],
  mappings: {
    hvacElectricity: 'HVac Electricity',
    hvacGas: 'HVac Gas',
    light: 'Light'
  },
  readings: [
    { index: 1, hvacElectricity: 68.12, hvacGas: 168.12, light: 21.23 },
    { index: 2, hvacElectricity: 38.75, hvacGas: 138.75, light: 32.45 },
    { index: 3, hvacElectricity: 138, hvacGas: 138.75, light: 32.45 },
  ]
}
const horizResults = {
  otherChartType: 'horizontal',
  groupBy: 'Daily',
  category: 'Energy',
  unit: 'kWh',
  labels: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9'],
  rows: 9,
  columns: ['hvacElectricity', 'hvacGas', 'light'],
  mappings: {
    hvacElectricity: 'HVac Electricity',
    hvacGas: 'HVac Gas',
    light: 'Light'
  },
  readings: [
    { index: 1, hvacElectricity: 10, hvacGas: 168.12, light: 21.23 },
    { index: 2, hvacElectricity: 20, hvacGas: 138.75, light: 32.45 }
  ]
}
const lineResults = {
  otherChartType: 'line',
  groupBy: 'Daily',
  category: 'Energy',
  unit: 'kWh',
  labels: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9'],
  rows: 9,
  columns: ['hvacElectricity', 'hvacGas', 'light'],
  mappings: {
    hvacElectricity: 'HVac Electricity',
    hvacGas: 'HVac Gas',
    light: 'Light'
  },
  readings: [
    { index: 1, hvacElectricity: 10, hvacGas: 30, light: 40 },
    { index: 2, hvacElectricity: 20, hvacGas: 50, light: 78 }
  ]
}

@Component({
  selector: 'puc-test-component',
  template: ''
})
class TestComponent {
  horizResults: any = horizResults;
  colorSet: any = colorSet;
  verResults: any = verResults;
  lineResults: any = lineResults;
}

describe('Component: DonutCombinationComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [PucComponentsModule]
    });
  });

  describe('Render Donut & horizonatl chart', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
          <puc-donut-combination [consumptionData] = "horizResults" [colorSet] = "colorSet"
          [chartWidth] = "200" [chartHeight] = "200" [donutOnlyHeight] = "100" ></puc-donut-combination>`
        }
      });
    });

    it('should set the svg width and height', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const pieSvg = fixture.debugElement.nativeElement.querySelector('svg.pieChart');
      const horizontalBarSvg = fixture.debugElement.nativeElement.querySelector('svg.barChartHorizontal');
      expect(pieSvg.getAttribute('width')).toBe('140');
      expect(pieSvg.getAttribute('height')).toBe('140');
      expect(horizontalBarSvg.getAttribute('width')).toBe('260');
      expect(horizontalBarSvg.getAttribute('height')).toBe('130');
    });

    it('should render 3 arc elements for pie chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.pieChart').querySelectorAll('path').length).toEqual(3);
    });

    it('should render 6 cell elements for horizontal chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('rect.bar').length).toEqual(6);
    });

  });

  describe('Render Donut & vertial bar chart', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
          <puc-donut-combination [consumptionData] = "verResults" [colorSet] = "colorSet"
          [chartWidth] = "200" [chartHeight] = "200" [donutOnlyHeight] = "100" ></puc-donut-combination>`
        }
      });
    });

    it('should set the svg width and height', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const pieSvg = fixture.debugElement.nativeElement.querySelector('svg.pieChart');
      const verticalBarSvg = fixture.debugElement.nativeElement.querySelector('svg.barChartVertical');
      expect(pieSvg.getAttribute('width')).toBe('140');
      expect(pieSvg.getAttribute('height')).toBe('140');
      expect(verticalBarSvg.getAttribute('width')).toBe('260');
      expect(verticalBarSvg.getAttribute('height')).toBe('130');
    });

    it('should render 3 arc elements for pie chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.pieChart').querySelectorAll('path').length).toEqual(3);
    });

    it('should render 9 cell elements for vertical bar chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('rect.bar').length).toEqual(9);
    });

  });

  describe('Render Donut & vertial bar chart', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
          <puc-donut-combination [consumptionData] = "lineResults" [colorSet] = "colorSet"
          [chartWidth] = "200" [chartHeight] = "200" [donutOnlyHeight] = "100" ></puc-donut-combination>`
        }
      });
    });

    it('should set the svg width and height', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const pieSvg = fixture.debugElement.nativeElement.querySelector('svg.pieChart');
      const verticalBarSvg = fixture.debugElement.nativeElement.querySelector('svg.lineChart');
      expect(pieSvg.getAttribute('width')).toBe('140');
      expect(pieSvg.getAttribute('height')).toBe('140');
      expect(verticalBarSvg.getAttribute('width')).toBe('260');
      expect(verticalBarSvg.getAttribute('height')).toBe('130');
    });

    it('should render 3 arc elements for pie chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.pieChart').querySelectorAll('path').length).toEqual(3);
    });

    it('should render 9 cell elements for vertical bar chart', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('path.chartLine').length).toEqual(3);
    });

  });

  describe('Should set color code for the pie & horizontal bar chart', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
          <puc-donut-combination [consumptionData] = "horizResults" [colorSet] = "colorSet"
          [chartWidth] = "200" [chartHeight] = "200" [donutOnlyHeight] = "100" ></puc-donut-combination>`
        }
      });
    });

    it('should set the colors for arc & bars', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiledPie = fixture.debugElement.nativeElement.querySelector('.pieChart').querySelectorAll('path');
      const compileVerticalBar = fixture.debugElement.nativeElement.querySelector('svg.barChartHorizontal').querySelectorAll('g.barGroup');
      expect(compiledPie[0].getAttribute('fill')).toBe('#E95E6F');
      expect(compiledPie[1].getAttribute('fill')).toBe('#EF9453');
      expect(compiledPie[2].getAttribute('fill')).toBe('#F7C325');
      expect(compileVerticalBar[0].getAttribute('fill')).toBe('#E95E6F');
      expect(compileVerticalBar[1].getAttribute('fill')).toBe('#EF9453');
      expect(compileVerticalBar[2].getAttribute('fill')).toBe('#F7C325');
    });


  });

  describe('Should set color code for the pie & vertial bar chart', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
          <puc-donut-combination [consumptionData] = "verResults" [colorSet] = "colorSet"
          [chartWidth] = "200" [chartHeight] = "200" [donutOnlyHeight] = "100" ></puc-donut-combination>`
        }
      });
    });

    it('should set the colors for arc & bars', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiledPie = fixture.debugElement.nativeElement.querySelector('.pieChart').querySelectorAll('path');
      const compileVerticalBar = fixture.debugElement.nativeElement.querySelector('svg.barChartVertical').querySelectorAll('g.barGroup');
      expect(compiledPie[0].getAttribute('fill')).toBe('#E95E6F');
      expect(compiledPie[1].getAttribute('fill')).toBe('#EF9453');
      expect(compiledPie[2].getAttribute('fill')).toBe('#F7C325');
      expect(compileVerticalBar[0].getAttribute('fill')).toBe('#E95E6F');
      expect(compileVerticalBar[1].getAttribute('fill')).toBe('#EF9453');
      expect(compileVerticalBar[2].getAttribute('fill')).toBe('#F7C325');
    });


  });

  describe('Should set color code for the pie & line chart', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
          <puc-donut-combination [consumptionData] = "lineResults" [colorSet] = "colorSet"
          [chartWidth] = "200" [chartHeight] = "200" [donutOnlyHeight] = "100" ></puc-donut-combination>`
        }
      });
    });

    it('should set the colors for arc & line', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiledPie = fixture.debugElement.nativeElement.querySelector('.pieChart').querySelectorAll('path');
      const compiledLine = fixture.debugElement.nativeElement.querySelector('svg.lineChart').querySelectorAll('.chartLine');
      expect(compiledPie[0].getAttribute('fill')).toBe('#E95E6F');
      expect(compiledPie[1].getAttribute('fill')).toBe('#EF9453');
      expect(compiledPie[2].getAttribute('fill')).toBe('#F7C325');
      expect(compiledLine[0].style.stroke).toBe('rgb(233, 94, 111)');
      expect(compiledLine[1].style.stroke).toBe('rgb(239, 148, 83)');
      expect(compiledLine[2].style.stroke).toBe('rgb(247, 195, 37)');

    });

  });

  describe('Should show extra details in pie chart', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
          <puc-donut-combination [consumptionData] = "lineResults" [colorSet] = "colorSet"
          [chartWidth] = "200" [chartHeight] = "200" [donutOnlyHeight] = "100" ></puc-donut-combination>`
        }
      });
    });

    it('should show extra details', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const textContainer = fixture.debugElement.nativeElement.querySelectorAll('.textArea');
      expect(textContainer.length).toEqual(1);
    });

  });

  describe('Render Pie chart without data', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
          <puc-donut-combination [consumptionData] = "" [colorSet] = "colorSet"
          [chartWidth] = "200" [chartHeight] = "200" [donutOnlyHeight] = "100" ></puc-donut-combination>`
        }
      });
    });

    it('should not render arc paths', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('path').length).toEqual(0);
    });
  });

  describe('Should set width & height without passing chartWidth & chartHeight', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
          <puc-donut-combination [consumptionData] = "horizResults" [colorSet] = "colorSet"
           [donutOnlyHeight] = "100" ></puc-donut-combination>`
        }
      });
    });

    it('should set svg width & height', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const pieSvg = fixture.debugElement.nativeElement.querySelector('svg.pieChart');
      const horizontalBarSvg = fixture.debugElement.nativeElement.querySelector('svg.barChartHorizontal');
      expect(pieSvg.getAttribute('width')).toBe('140');
      expect(pieSvg.getAttribute('height')).toBe('140');
      expect(horizontalBarSvg.getAttribute('width')).toBe('560');
      expect(horizontalBarSvg.getAttribute('height')).toBe('180');
    });

  });

  describe('Render Donut & vertial bar chart', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
          <puc-donut-combination [consumptionData] = "verResults" [colorSet] = "colorSet"
           [donutOnlyHeight] = "100" ></puc-donut-combination>`
        }
      });
    });

    it('should set the svg width and height', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const pieSvg = fixture.debugElement.nativeElement.querySelector('svg.pieChart');
      const verticalBarSvg = fixture.debugElement.nativeElement.querySelector('svg.barChartVertical');
      expect(pieSvg.getAttribute('width')).toBe('140');
      expect(pieSvg.getAttribute('height')).toBe('140');
      expect(verticalBarSvg.getAttribute('width')).toBe('560');
      expect(verticalBarSvg.getAttribute('height')).toBe('180');
    });

  });

  describe('Render Donut & vertial bar chart', () => {

    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
          <puc-donut-combination [consumptionData] = "lineResults" [colorSet] = "colorSet"
           [donutOnlyHeight] = "100" ></puc-donut-combination>`
        }
      });
    });

    it('should set the svg width and height', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const pieSvg = fixture.debugElement.nativeElement.querySelector('svg.pieChart');
      const verticalBarSvg = fixture.debugElement.nativeElement.querySelector('svg.lineChart');
      expect(pieSvg.getAttribute('width')).toBe('140');
      expect(pieSvg.getAttribute('height')).toBe('140');
      expect(verticalBarSvg.getAttribute('width')).toBe('560');
      expect(verticalBarSvg.getAttribute('height')).toBe('180');
    });

  });

  describe('Testing other than chart related functions', () => {
    let component: DonutCombinationComponent;
    let fixture: ComponentFixture<DonutCombinationComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [],
        imports: [PucComponentsModule]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DonutCombinationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('setUpData: process chart data', () => {
      component.chartData = horizResults;
      component.setUpData();
      expect(component.donutData.total).toEqual(390.55);
      expect(component.donutData.data.length).toEqual(3);
      expect(component.donutData.category).toBe('Energy');
      expect(component.donutData.partitions['hvacElectricity']).toBe('HVac Electricity');
      expect(component.otherChartData.unit).toBe('kWh');
      expect(component.otherChartData.rows).toEqual(9);
      expect(component.otherChartData.readings.length).toEqual(2);
    })
  })


});
