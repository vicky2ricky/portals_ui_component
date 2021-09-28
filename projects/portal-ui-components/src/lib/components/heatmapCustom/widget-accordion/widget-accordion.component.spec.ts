import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetAccordionComponent } from './widget-accordion.component';

describe('WidgetAccordionComponent', () => {
  let component: WidgetAccordionComponent;
  let fixture: ComponentFixture<WidgetAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
