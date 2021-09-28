import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [AlertService]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('success: should next a success message', fakeAsync(() => {
    const sub = service.getMessage();
    sub.subscribe(resp => {
      expect(resp).toEqual({ type: 'success', text: 'yippie' });
    });
    service.success('yippie', true);
    tick();
  }));

  it('success: should next a success message with keepnavigation as false', fakeAsync(() => {
    const sub = service.getMessage();
    sub.subscribe(resp => {
      expect(resp).toEqual({ type: 'success', text: 'yippie' });
    });
    service.success('yippie');
    tick();
  }));

  it('error: should next a error message', fakeAsync(() => {
    const sub = service.getMessage();
    sub.subscribe(resp => {
      expect(resp).toEqual({ type: 'error', text: 'oops' });
    });
    service.error('oops', true);
    tick();
  }));

  it('error: should next a error message with keepnavigation as false', fakeAsync(() => {
    const sub = service.getMessage();
    sub.subscribe(resp => {
      expect(resp).toEqual({ type: 'error', text: 'oops' });
    });
    service.error('oops');
    tick();
  }));

  it('warning: should next a warning message', fakeAsync(() => {
    const sub = service.getMessage();
    sub.subscribe(resp => {
      expect(resp).toEqual({ type: 'warning', text: 'hmm ok' });
    });
    service.warning('hmm ok', true);
    tick();
  }));

  it('warning: should next a warning message with keepnavigation as false', fakeAsync(() => {
    const sub = service.getMessage();
    sub.subscribe(resp => {
      expect(resp).toEqual({ type: 'warning', text: 'hmm ok' });
    });
    service.warning('hmm ok');
    tick();
  }));

  it('progress: should next a progress message', fakeAsync(() => {
    const sub = service.getMessage();
    sub.subscribe(resp => {
      expect(resp).toEqual({ type: 'progress', text: 'keep going' });
    });
    service.progress('keep going', true);
    tick();
  }));

  it('progress: should next a progress message with keepnavigation as false', fakeAsync(() => {
    const sub = service.getMessage();
    sub.subscribe(resp => {
      expect(resp).toEqual({ type: 'progress', text: 'keep going' });
    });
    service.progress('keep going');
    tick();
  }));
});


