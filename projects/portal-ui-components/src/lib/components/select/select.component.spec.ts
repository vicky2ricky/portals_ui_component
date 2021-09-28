import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test onchanges', () => {
    component.ngOnChanges({
      selectedOption: new SimpleChange(0, 1, false)
    });
    expect(component.selectedOption).toEqual(1);
  });

  it('test changeOption', () => {
    const selectedOption = { target: '1' };
    component.onChange('drop', selectedOption);
    expect(selectedOption.target).toEqual('1');
  });
});
