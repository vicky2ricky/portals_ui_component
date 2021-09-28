import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionComponent } from './accordion.component';
import { SimpleChange } from '@angular/core';
import { HeatMapToolTipService } from '../../services/heatmap-tooltip.service';

fdescribe('AccordionComponent', () => {
  let component: AccordionComponent;
  let fixture: ComponentFixture<AccordionComponent>;
  let service: HeatMapToolTipService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionComponent],
      providers: [HeatMapToolTipService]
    })
      .compileComponents();
    service = TestBed.get(HeatMapToolTipService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call activateDropdown with graph index and open true', () => {
    component.isOpen = true;
    component.blockTitle = 'Default System Profile';
    service.graphAccordianDataVisibility = ['grapId'];
    component.activateDropdown();
    expect(component).toBeTruthy();
  });

  it('call activateDropdown with graph index and open false', () => {
    component.isOpen = false;
    component.blockTitle = 'no value';
    service.graphAccordianDataVisibility = ['grapId'];
    component.activateDropdown();
    expect(component).toBeTruthy();
  });

  it('call activateDropdown without graph index and open false', () => {
    component.isOpen = false;
    component.blockTitle = 'no value';
    service.graphAccordianDataVisibility = [];
    component.activateDropdown();
    expect(component).toBeTruthy();
  });

  it('call ngOnChanges', () => {
    component.isOpen = true;
    component.ngOnChanges({isOpen: new SimpleChange(true, false, false)});
    expect(component).toBeTruthy();
  });
  it('call ngOnChanges', () => {
    component.isOpen = true;
    component.ngOnChanges({isOpen: new SimpleChange(true, true, false)});
    expect(component).toBeTruthy();
  });
  it('call ngOnChanges', () => {
    component.isOpen = true;
    component.ngOnChanges({isActive: new SimpleChange(true, false, false)});
    expect(component.isActive).toBeFalsy();
  });
});
