import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsSelectionComponent } from './analytics-selection.component';

describe('AnalyticsSelectionComponent', () => {
  let component: AnalyticsSelectionComponent;
  let fixture: ComponentFixture<AnalyticsSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
