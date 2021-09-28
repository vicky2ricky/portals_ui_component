import { TestBed } from '@angular/core/testing';
import { HttpCancelInterceptor } from './cancel.interceptor.service';


describe('HttpCancelInterceptor', () => {
  let service: HttpCancelInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpCancelInterceptor]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(HttpCancelInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
