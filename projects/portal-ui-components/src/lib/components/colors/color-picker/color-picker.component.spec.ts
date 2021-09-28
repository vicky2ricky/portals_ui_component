import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerComponent } from './color-picker.component';

describe('Component: ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorPickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSelectColor: Emit the selected color on click', () => {
    component.showColorContainer = true;
    const color = '#E95E6F';
    spyOn(component.colorSelectionChange, 'emit');
    component.onSelectColor(color);
    expect(component.showColorContainer).toBeFalsy();
    expect(component.selectedColor).toBe(color);
    expect(component.colorSelectionChange.emit).toHaveBeenCalledWith(color);
  })
});
