import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationModalComponent } from './vacation-modal.component';

describe('VacationModalComponent', () => {
  let component: VacationModalComponent;
  let fixture: ComponentFixture<VacationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
