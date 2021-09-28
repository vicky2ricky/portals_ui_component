import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutedAlertDialogComponent } from './muted-alert-dialog.component';

describe('MutedAlertDialogComponent', () => {
  let component: MutedAlertDialogComponent;
  let fixture: ComponentFixture<MutedAlertDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutedAlertDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutedAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
