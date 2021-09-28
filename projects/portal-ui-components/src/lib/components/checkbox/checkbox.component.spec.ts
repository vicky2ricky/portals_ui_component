import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('write value : checked as true', () => {
    component.writeValue(true);
    expect(component.checked).toEqual(true);
  });

  it('register : registerOnChange', () => {
    function pass() {
      return true;
    }
    spyOn(component, 'registerOnChange').and.callThrough();
    component.registerOnChange(pass);
    expect(component.registerOnChange).toHaveBeenCalled();
  });

  it('register : registerOnTouched', () => {
    function pass() {
      return true;
    }
    spyOn(component, 'registerOnTouched').and.callThrough();
    component.registerOnTouched(pass);
    expect(component.registerOnTouched).toHaveBeenCalled();
  });

  it('Checkbox : transform', () => {
    component.transform('red');
    expect(component.checked).toEqual(false);
  });

  it('Checkbox : onChange', () => {
    const event = { preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy(), target: { checked: true } };
    component.onChange(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

});
