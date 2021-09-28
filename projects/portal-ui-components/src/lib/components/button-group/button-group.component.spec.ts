import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { emit } from 'process';

import { ButtonGroupComponent } from './button-group.component';

describe('ButtonGroupComponent', () => {
  let component: ButtonGroupComponent;
  let fixture: ComponentFixture<ButtonGroupComponent>;
  const selectedOption = 1;
  const selectedType = 'scheduleType';
  const selectedObj = {
    value: Number(selectedOption),
    type: selectedType,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonGroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onclick: scheduleType', () => {

    component.onClick('scheduleType', 1);
    expect(selectedObj).toEqual(selectedObj);
  });

  it('determineClass: Named', () => {
    const option = { name: 'Named' };
    const ret = component.determineClass(option);
    expect(ret).toEqual('disabled');
  });

  it('determineClass: scheduleType', () => {
    component.selectedOption = '1';
    const option = {
      name: 'scheduleType',
      value: '1'
    };
    const ret = component.determineClass(option);
    expect(ret).toEqual('active');
  });

  it('ngOnChanges: should call optionClick', () => {
    component.selectedOption = 2;
    component.id = 1;
    fixture.detectChanges();
    component.ngOnChanges({
      selectedOption: new SimpleChange(0, 2, false),
      id: new SimpleChange(1, 0, false),
    });
    expect(component.id).toEqual(0);
    expect(component.selectedOption).toEqual(2);
  });

});
