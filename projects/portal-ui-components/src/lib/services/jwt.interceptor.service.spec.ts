import { HttpClient, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { JwtInterceptor } from './jwt.interceptor.service';

class MockAuthenticationService extends AuthenticationService {
  getLoggedInUserDetails() { }
}

let store = {};

class MockLocalStorage {
  getItem = (key: string): string => {
    return key in store ? store[key] : null;
  }
  setItem = (key: string, value: string) => {
    store[key] = `${value}`;
  }
  removeItem = (key: string) => {
    delete store[key];
  }
  clear = () => {
    store = {};
  }
}

describe('JwtInterceptor', () => {
  let service: JwtInterceptor;
  let httpTestingController: HttpTestingController;
  let authService: MockAuthenticationService;
  let httpClient: HttpClient;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        JwtInterceptor,
        {
          provide: AuthenticationService,
          useClass: MockAuthenticationService
        },
        {
          provide: 'LOCALSTORAGE',
          useClass: MockLocalStorage
        }]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(JwtInterceptor);
    authService = TestBed.inject(AuthenticationService);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    // localStorage = TestBed.inject('LOCALSTORAGE');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('intercept: should intercept sso/verifytoken', fakeAsync(() => {
    const err: any = { status: 500 };
    const next: any = {
      handle: (request: HttpRequest<any>) => ({
        catch: (callback) => { callback(err); }
      })
    };

    const spy = spyOn(localStorage, 'getItem').and.returnValue('some token');
    const req = new HttpRequest('POST', 'http://localhost/sso/verifytoken', {});
    service.intercept(req, next);
  }));

  it('intercept: should intercept dummy url', fakeAsync(() => {
    const err: any = { status: 500 };
    const next: any = {
      handle: (request: HttpRequest<any>) => ({
        catch: (callback) => { callback(err); },
        pipe: () => { }
      })
    };
    const spy = spyOn(localStorage, 'getItem').and.returnValue('some value');
    const req = new HttpRequest('POST', 'dummy', {});

    service.intercept(req, next);
  }));
});
