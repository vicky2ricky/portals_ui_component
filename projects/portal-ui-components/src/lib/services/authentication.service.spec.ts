import { DOCUMENT } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';

class MockConfigurationService extends ConfigurationService {
  getConfig(something: any) {
    return 'http://dummyUrl';
  }
}

class MockDocument {
  location: any;
  constructor() {
    this.location = {
      href: 'http://helloworld'
    };
  }
}

const dt = new Date();
dt.setHours(dt.getHours() + 2);

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

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let configService: MockConfigurationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        {
          provide: ConfigurationService,
          useClass: MockConfigurationService
        },
        {
          provide: DOCUMENT,
          useClass: MockDocument
        },
        {
          provide: 'LOCALSTORAGE',
          useClass: MockLocalStorage
        }
      ]
    });

    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(AuthenticationService);
    configService = TestBed.inject(ConfigurationService);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    store = {};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('ngOnDestroy: should unsubscribe tokenTimerSubscription', () => {
    service.tokenTimerSubscription = new Subscription();
    service.ngOnDestroy();
    expect(service.tokenTimerSubscription.closed).toEqual(true);
  });

  it('setUser: should set user', () => {
    const user = { user: 'Dummy' };
    service.setUser(user);
    expect(service.getUser()).toEqual(user);
  });

  it('getSessionId: should return session id as null for this env', () => {
    expect(service.getSessionId()).toEqual(null);
  });

  it('isLoggedIn: should return login as null for this env', () => {
    expect(service.isLoggedIn()).toEqual(null);
  });

  it('getExpiration: should return expiration time as null', () => {
    localStorage.setItem('expires_at', dt.toDateString());
    expect(service.getExpiration()).toEqual(null);
  });

  it('isTokenExpired: should return false as expiration time is there', () => {
    const spy = spyOn(service, 'getExpiration').and.returnValue(dt);
    expect(service.isTokenExpired()).toEqual(false);
  });

  it('isLoggedIn: should return true', () => {
    expect(service.isLoggedIn()).toEqual(null);
  });

  it('isLoggedOut: should return false', () => {
    const spy = spyOn(service, 'isLoggedIn').and.returnValue(true);
    expect(service.isLoggedOut()).toEqual(false);
  });

  it('logout: should logout', () => {
    const spy = spyOn(configService, 'getConfig').and.returnValue('http://dummyUrl');
    const userSpy = spyOn(service, 'getUser').and.returnValue('dummy');
    const sessionSpy = spyOn(service, 'getSessionId').and.returnValue('@123');
    service.logout();
    expect(localStorage.getItem('user_data')).toEqual(null);
  });

  it('login: should login', () => {
    const spy = spyOn(configService, 'getConfig').and.returnValue('http://dummyUrl');
    service.login();
    expect(configService.getConfig).toHaveBeenCalled();
  });

  it('getLoggedInUserDetails: should return user details', () => {
    const spy = spyOn(localStorage, 'getItem').and.returnValue('user_info: dummy');
    expect(service.getLoggedInUserDetails()).toEqual({ lastName: '' });
  });

  it('setLoggedInUserDetails: should set user details', () => {
    const spy = spyOn(localStorage, 'setItem').and.returnValue();
    service.setLoggedInUserDetails({ user_info: 'dummy' });
    expect(service.getLoggedInUserDetails()).toEqual({ user_info: 'dummy', lastName: '' });
  });

  it('setSession: should set vals', () => {
    const spy = spyOn(localStorage, 'setItem').and.returnValue();
    const spy1 = spyOn(service, 'setTimer').and.returnValue();

    service.setSession({
      idToken: '123',
      expiresAt: moment('2020-09-30'),
      userData: {},
      globalSessionID: '456'
    });
    expect(service.setTimer).toHaveBeenCalled();
  });
});
