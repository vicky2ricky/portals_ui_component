import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { LoaderComponent } from './loader.component';
import { LoaderService } from '../../services/loader.service';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  const configServiceSpy = {
    getState: jasmine.createSpy('getState').and.returnValue(of())
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      providers: [{ provide: LoaderService, useValue: configServiceSpy }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call setState', fakeAsync(() => {
    configServiceSpy.getState.and.returnValue(of({ message: { state: true } }));
    component.setState();
    expect(component).toBeTruthy();
    tick();
  }));

  it('call setState', fakeAsync(() => {
    configServiceSpy.getState.and.returnValue(of(false));
    component.setState();
    expect(component).toBeTruthy();
    tick();
  }));

  it('call errorDialog', () => {
    component.closeErrorDialog();
    expect(component).toBeTruthy();
  });

});
