import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsVisBuilderModalComponent } from './analytics-vis-builder-modal.component';

describe('AnalyticsVisBuilderModalComponent', () => {
  let component: AnalyticsVisBuilderModalComponent;
  let fixture: ComponentFixture<AnalyticsVisBuilderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsVisBuilderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsVisBuilderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
