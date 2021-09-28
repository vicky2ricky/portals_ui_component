import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SunburstComponent } from './sunburst.component';

const results =
{
  unit: 'kWh', highestLevel: 'site', rows: 19,
  readings: [{ name: 'Site 6', parentId: '', value: 2158, id: 'site6' },
  { name: 'CCU 1', parentId: 'site6', value: 1158, id: 'ccu1', topLevelParentId: 'site6' },
  { name: 'CCU 2', parentId: 'site6', value: 500, id: 'ccu2', topLevelParentId: 'site6' },
  { name: 'CCU 3', parentId: 'site6', value: 500, id: 'ccu3', topLevelParentId: 'site6' },
  { name: 'Zone 11', parentId: 'ccu1', value: 158, id: 'zone11', topLevelParentId: 'site6' },
  { name: 'Zone 12', parentId: 'ccu1', value: 200, id: 'zone12', topLevelParentId: 'site6' },
  { name: 'Zone 13', parentId: 'ccu1', value: 150, id: 'zone13', topLevelParentId: 'site6' },
  { name: 'Zone 14', parentId: 'ccu1', value: 150, id: 'zone14', topLevelParentId: 'site6' },
  { name: 'Zone 15', parentId: 'ccu1', value: 500, id: 'zone15', topLevelParentId: 'site6' },
  { name: 'Zone 21', parentId: 'ccu2', value: 150, id: 'zone21', topLevelParentId: 'site6' },
  { name: 'Zone 22', parentId: 'ccu2', value: 150, id: 'zone22', topLevelParentId: 'site6' },
  { name: 'Zone 23', parentId: 'ccu2', value: 200, id: 'zone23', topLevelParentId: 'site6' },
  { name: 'Zone 31', parentId: 'ccu3', value: 240, id: 'zone31', topLevelParentId: 'site6' },
  { name: 'Zone 32', parentId: 'ccu3', value: 250, id: 'zone32', topLevelParentId: 'site6' },
  { name: 'Module 111', parentId: 'zone15', value: 55, id: 'module111', topLevelParentId: 'site6' },
  { name: 'Module 112', parentId: 'zone15', value: 156, id: 'module112', topLevelParentId: 'site6' },
  { name: 'Module 113', parentId: 'zone15', value: 121, id: 'module113', topLevelParentId: 'site6' },
  { name: 'Module 114', parentId: 'zone15', value: 118, id: 'module114', topLevelParentId: 'site6' },
  { name: 'Module 115', parentId: 'zone15', value: 50, id: 'module115', topLevelParentId: 'site6' }]
};
const colorSet = { site6: '#E95E6F' };
@Component({
  selector: 'puc-test-component',
  template: ''
})
class TestComponent {
  results: any = results;
  colorSet: any = colorSet;
}

describe('Componet: SunburstComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, SunburstComponent]
    });
  });

  describe('Render Sunburst chart', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
           <puc-sunburst [chartWidth]='400' [chartHeight]='200' [consumptionData]='results' maxChildrenInList="4"
           >
          </puc-sunburst>`
        }
      });
    });

    it('should set the svg width and height', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const svg = fixture.debugElement.nativeElement.querySelector('svg');
      expect(svg.getAttribute('width')).toBe('512');
      expect(svg.getAttribute('height')).toBe('256');
    });

    it('addWhiskers,addCenterHorizontalLine,addBoxRectangle,addQuartiles,setUpBars: should render 3 line elements', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('.sunburstSlice').length).toEqual(18);
      expect(compiled.querySelectorAll('.sunBurstMainText').length).toEqual(1);
    });


  });

  describe('Should set colors for the arc', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
           <puc-sunburst [chartWidth]='400' [chartHeight]='200' [consumptionData]='results' maxChildrenInList="4"
           [colorSet]="colorSet"
           >
          </puc-sunburst>`
        }
      });
    });


    it('addWhiskers,addCenterHorizontalLine,addBoxRectangle,addQuartiles,setUpBars: should render 3 line elements', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('.sunburstSlice').length).toEqual(18);
      expect(compiled.querySelectorAll('.sunBurstMainText').length).toEqual(1);
    });

    it('Add colors for the arcs', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement.querySelectorAll('.sunburstMainArc');
      expect(compiled[0].getAttribute('fill')).toBe('rgba(233, 94, 111, 0.8)');
      expect(compiled[3].getAttribute('fill')).toBe('rgba(233, 94, 111, 0.6)');
      expect(compiled[16].getAttribute('fill')).toBe('rgba(233, 94, 111, 0.4)');
    });
  });

  describe('Render sunburst chart without data', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
           <puc-sunburst [chartWidth]='200' [chartHeight]='200' [consumptionData]=''>
          </puc-sunburst>`
        }
      });
    });

    it('addWhiskers,addCenterHorizontalLine,addBoxRectangle,addQuartiles,setUpBars: should render 3 line elements', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('.sunburstSlice').length).toEqual(0);
      expect(compiled.querySelectorAll('.sunBurstMainText').length).toEqual(0);
    });

  });

  describe('Render sunburst chart without data', () => {
    beforeEach(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
           <puc-sunburst [chartWidth]='200' [chartHeight]='200' [consumptionData]=''>
          </puc-sunburst>`
        }
      });
    });

    it('focusOn: Focus child elements on click of arc', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      compiled.dispatchEvent(new MouseEvent('click'));
      const tooltipContainer = compiled.querySelector('.sunburstHiddenArc');
      console.log('tool', tooltipContainer);

    })

  });

});
