import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpCancelService } from './cancel.service';

describe('CancelService', () => {
  let service: HttpCancelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpCancelService]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(HttpCancelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('cancelPendingRequests: should next a undefined', fakeAsync(() => {
    const sub = service.onCancelPendingRequests();
    sub.subscribe(resp => {
      expect(resp).toEqual(undefined);
    });

    service.cancelPendingRequests();
    tick();
  }));
});
