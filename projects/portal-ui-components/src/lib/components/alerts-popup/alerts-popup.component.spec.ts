import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsPopupComponent } from './alerts-popup.component';

describe('AlertsPopupComponent', () => {
  let component: AlertsPopupComponent;
  let fixture: ComponentFixture<AlertsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
