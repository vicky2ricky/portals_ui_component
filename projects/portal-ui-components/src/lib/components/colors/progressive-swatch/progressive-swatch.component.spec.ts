import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressiveSwatchComponent } from './progressive-swatch.component';
const colorSelection = {
  type: 'progressive',
  colors: ['#E95E6F', '#EF9453', '#F7C325', '#1AAE9F', '#92CA4B', '#897A5F',
    '#439AEB', '#9635E2', '#C660D7', '#4B5C6B', '#788896', '#BABABA'],
  gradientColors: {
    grp1: { stopColor0: '#0000fc', stopColor100: '#00ff1d' },
    grp2: { stopColor0: '#f7c325', stopColor100: '#9635e2' },
    grp3: { stopColor0: '#e95e6f', stopColor100: '#439aeb' }
  },
  singleColorData: [
    {
      label: 'building A', value: 'buildingIdA', color: '#E95E6F', type: 'single',
      progressive: [{ label: 'Floor 1', color: '#4B5C6B' }]
    },
    {
      label: 'building B', value: 'buildingIdB', color: '#92CA4B', type: 'single',
      progressive: [{ label: 'Floor 1', color: '#4B5C6B' }, { label: 'Floor 2', color: '#4B5C6B' }]
    }],
  gradientColorData: [
    {
      label: 'building A', value: 'buildingIdA', type: 'gradient', group: 'grp1',
      progressive: [{ label: 'Floor 1', color: '#4B5C6B' }]
    },
    {
      label: 'building B', value: 'buildingIdB', type: 'gradient', group: 'grp2',
      progressive: [{ label: 'Floor 1', color: '#439aeb' }, { label: 'Floor 2', color: '#739aeb' }]
    }]
}
describe('Component: ProgressiveSwatchComponent', () => {
  let component: ProgressiveSwatchComponent;
  let fixture: ComponentFixture<ProgressiveSwatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressiveSwatchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressiveSwatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('updateProgressives: interpolate the single color for the selections', () => {
    component.selections = colorSelection.singleColorData;
    spyOn(component.colorSelectionChange, 'emit');
    component.updateProgressives();
    expect(component.selections[0]['progressive'][0]['color']).toBe('rgba(233, 94, 111, 0.4)');
    expect(component.selections[1]['progressive'][0]['color']).toBe('rgba(146, 202, 75, 1)');
    expect(component.selections[1]['progressive'][1]['color']).toBe('rgba(146, 202, 75, 0.4)');
    expect(component.colorSelectionChange.emit).toHaveBeenCalled();
  });

  it('updateProgressives: interpolate the gradient color for the selections', () => {
    component.selections = colorSelection.gradientColorData;
    component.gradientColorSet = colorSelection.gradientColors;
    spyOn(component.colorSelectionChange, 'emit');
    component.updateProgressives();
    expect(component.selections[0]['progressive'][0]['color']).toBe('rgba(0,0,252,1)');
    expect(component.selections[1]['progressive'][0]['color']).toBe('rgba(247,195,37,1)');
    expect(component.selections[1]['progressive'][1]['color']).toBe('rgba(150,53,226,1)');
    expect(component.colorSelectionChange.emit).toHaveBeenCalled();
  });

  it('updateProgressives: interpolate the single color for the empty data', () => {
    component.selections = [];
    spyOn(component.colorSelectionChange, 'emit');
    component.updateProgressives();
    expect(component.selections.length).toBe(0);
    expect(component.colorSelectionChange.emit).toHaveBeenCalledTimes(0);
  });

  it('showColorSelector: select color swatch', () => {
    component.showColorSelector('color1');
    expect(component.showColorSwatchFor).toBe('color1');
  })

  it('changeColorSelection: Change color selection for single type of color data', () => {
    const selection = colorSelection.singleColorData[0];
    const type = 'single';
    const color = colorSelection.colors[0];
    component.showColorSwatchFor = 'color1';
    spyOn(component.colorSelectionChange, 'emit');
    component.changeColorSelection(type, selection, color);
    expect(component.showColorSwatchFor).toBe(null);
    expect(component.colorSelectionChange.emit).toHaveBeenCalled();
  });

  it('changeColorSelection: Change color selection for gradient type of color data', () => {
    const selection = colorSelection.gradientColorData[0];
    const type = 'gradient';
    const value = 'grp1';
    component.showColorSwatchFor = 'color1';
    spyOn(component.colorSelectionChange, 'emit');
    component.changeColorSelection(type, selection, value);
    expect(component.showColorSwatchFor).toBe(null);
    expect(component.colorSelectionChange.emit).toHaveBeenCalled();
  });

  it('linearGradient: create linear gradient css style', () => {
    const res = component.linearGradient('#0000fc', '#00ff1d');
    expect(res).toBe('linear-gradient(to right, #0000fc , #00ff1d)')
  });

  it('interpolateSingleColor: interpolate the colors for progressive data', () => {
    const selection = colorSelection.singleColorData[0];
    const value = colorSelection.colors[2];
    component.interpolateSingleColor(selection, value);
    expect(selection['progressive'][0]['color']).toBe('rgba(247, 195, 37, 0.4)');
  });

  it('interpolateSingleColor: interpolate the colors for progressive data without no value', () => {
    const selection = {};
    const value = colorSelection.colors[2];
    component.interpolateSingleColor(selection, value);
    expect(Object.keys(selection).length).toBe(0);
  });

  it('interpolateGradientColor: interpolate the gradient colors for progressive data', () => {
    const selection = colorSelection.gradientColorData[0];
    const value = 'grp3';
    component.interpolateGradientColor(selection, value);
    expect(selection['progressive'][0]['color']).toBe('rgba(0,0,252,1)');
  });

  it('interpolateGradientColor: interpolate the gradient colors for progressive data without no value', () => {
    const selection = {};
    const value = 'grp3';
    component.interpolateGradientColor(selection, value);
    expect(Object.keys(selection).length).toBe(0);
  });

  it('hostClicked: click on host element', () => {
    component.showColorSwatchFor = true;
    fixture.detectChanges();
    const inputEl: HTMLElement = fixture.nativeElement.querySelector('.selectedColorList')
    const event = new Event('click', { bubbles: true });
    inputEl.dispatchEvent(event);
    expect(component.showColorSwatchFor).toBeNull();
  });

  it('ngOnChanges: should change selection data', () => {
    component.selections = colorSelection.singleColorData;
    component.ngOnChanges({
      selections: new SimpleChange(null, component.selections, false)
    });
    fixture.detectChanges();
    expect(component.selections[0]['progressive'][0]['color']).toBe('rgba(233, 94, 111, 0.4)');
    expect(component.selections[1]['progressive'][0]['color']).toBe('rgba(146, 202, 75, 1)');
    expect(component.selections[1]['progressive'][1]['color']).toBe('rgba(146, 202, 75, 0.4)');
  });

});
