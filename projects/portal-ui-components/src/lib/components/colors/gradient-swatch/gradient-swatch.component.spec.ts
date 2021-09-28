import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradientSwatchComponent } from './gradient-swatch.component';
const gradientColors = {
  grp1: { stopColor0: '#0000fc', stopColor100: '#00ff1d' },
  grp2: { stopColor0: '#f7c325', stopColor100: '#9635e2' },
  grp3: { stopColor0: '#e95e6f', stopColor100: '#439aeb' }
}
describe('Component: GradientSwatchComponent', () => {
  let component: GradientSwatchComponent;
  let fixture: ComponentFixture<GradientSwatchComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GradientSwatchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradientSwatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('changeColorSelection: Emit the selected gradient color on click', () => {
    component.availableColorSet = gradientColors;
    component.showColorSwatch = true;
    const key = 'grp1';
    spyOn(component.colorSelectionChange, 'emit');
    component.changeColorSelection(key);
    expect(component.showColorSwatch).toBeFalsy();
    expect(component.selectedGroup).toBe(key);
    expect(component.colorSelectionChange.emit).toHaveBeenCalledWith(gradientColors[key]);
  })

  it('changeColorSelection: emit gradient color for without any availableColorSet', () => {
    component.availableColorSet = null;
    component.showColorSwatch = true;
    const key = 'grp1';
    spyOn(component.colorSelectionChange, 'emit');
    component.changeColorSelection(key);
    expect(component.showColorSwatch).toBeFalsy();
    expect(component.selectedGroup).toBe(key);
    expect(component.colorSelectionChange.emit).toHaveBeenCalledWith('');
  })

  it('linearGradient: create linear gradient css style', () => {
    const res = component.linearGradient('#0000fc', '#00ff1d');
    expect(res).toBe('linear-gradient(to right, #0000fc , #00ff1d)')
  })

  it('hostClicked: click on host element', () => {
    component.showColorSwatch = true;
    component.availableColorSet = gradientColors;
    component.isEdit = true;
    fixture.detectChanges();
    const inputEl: HTMLElement = fixture.nativeElement.querySelector('.selectedColorList')
    const event = new Event('click', { bubbles: true });
    inputEl.dispatchEvent(event);
    expect(component.showColorSwatch).toBeFalsy();
  });

});
