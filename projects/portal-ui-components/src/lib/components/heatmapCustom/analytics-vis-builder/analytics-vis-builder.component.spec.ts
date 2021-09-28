import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsVisBuilderComponent } from './analytics-vis-builder.component';

describe('AnalyticsVisBuilderComponent', () => {
  let component: AnalyticsVisBuilderComponent;
  let fixture: ComponentFixture<AnalyticsVisBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsVisBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsVisBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
