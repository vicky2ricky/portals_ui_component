import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { AlertService } from '../../services/alert.service';

import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let service: AlertService;
  let fixture: ComponentFixture<AlertComponent>;
  const configServiceSpy = {
    getMessage: jasmine.createSpy('getMessage').and.returnValue(of({}))
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertComponent],
      providers: [{ provide: AlertService, useValue: configServiceSpy }]
    })
      .compileComponents();
    service = TestBed.get(AlertService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls getMessage', () => fakeAsync(() => {
    configServiceSpy.getMessage.and.returnValue(of({ message: { type: 'success' } }));
    component.getMessage();
    expect(component).toBeTruthy();
    tick();
  }));

  it('calls closeErrorDialog', () => {
    // configServiceSpy.getMessage.and.returnValue(of({ message: { type: 'success' } }));
    component.ngOnDestroy();
    component.closeErrorDialog();
    expect(component).toBeTruthy();
  });

});
