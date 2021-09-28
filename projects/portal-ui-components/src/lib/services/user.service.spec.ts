import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { UserService } from './user.service';

class MockConfigurationService extends ConfigurationService {
  getConfig(something: any) {
    return 'http://dummyUrl';
  }
}

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

describe('UserService', () => {
  let service: UserService;
  let configService: MockConfigurationService;
  let httpTestingController: HttpTestingController;
  let authService: MockAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        {
          provide: ConfigurationService,
          useClass: MockConfigurationService
        },
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
    service = TestBed.inject(UserService);
    configService = TestBed.inject(ConfigurationService);
    authService = TestBed.inject(AuthenticationService);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getDisplayId: should return user', () => {
    const spy = spyOn(authService, 'getLoggedInUserDetails').and.callFake(() => ({ firstName: 'Hello', lastName: 'World' }));
    expect(service.getDisplayId()).toEqual('Hello World');
  });

  it('getDisplayId: should return null for no user', () => {
    const spy = spyOn(authService, 'getLoggedInUserDetails').and.callFake(() => '');
    expect(service.getDisplayId()).toEqual(null);
  });

  it('getUserDetails: should return user details', fakeAsync(() => {
    const dummyResp = {
      firstName: 'Hello',
      lastName: 'World'
    };

    // Expect a call to this URL
    const req = httpTestingController.expectNone(
      '/user/dummy'
    );

    const sub = service.getUserDetails('dummy');
    tick();

    expect(sub.subscribe(resp => {
      expect(resp).toEqual({});
    }));
  }));

  it('getUserSites: should return user site', fakeAsync(() => {
    // Expect a call to this URL
    const req = httpTestingController.expectNone(
      '/user/dummy'
    );

    const sub = service.getUserSites('dummy');
    tick();

    expect(sub.subscribe(resp => {
      expect(resp).toEqual({});
    }));
  }));

  it('getAllUsers: should return users', fakeAsync(() => {
    // Expect a call to this URL
    const req = httpTestingController.expectNone(
      '/user/dummy'
    );

    const sub = service.getAllUsers('dummy');
    tick();

    expect(sub.subscribe(resp => {
      expect(resp).toEqual({});
    }));
  }));

  it('getUsersRelatedToSites: should return details', fakeAsync(() => {
    // Expect a call to this URL
    const req = httpTestingController.expectNone(
      '/user/dummy'
    );

    const sub = service.getUsersRelatedToSites('dummy', 'data');
    tick();

    expect(sub.subscribe(resp => {
      expect(resp).toEqual({});
    }));
  }));


  it('transferOwnership: should transfer ownerhsip', fakeAsync(() => {
    // Expect a call to this URL
    const req = httpTestingController.expectNone(
      '/user/dummy'
    );

    const sub = service.transferOwnership('dummy');
    tick();

    expect(sub.subscribe(resp => {
      expect(resp).toEqual({});
    }));
  }));

  it('updateUserDetails: should update user detials', fakeAsync(() => {
    // Expect a call to this URL
    const req = httpTestingController.expectNone(
      '/user/dummy'
    );

    const sub = service.updateUserDetails('dummy', 'data');
    tick();

    expect(sub.subscribe(resp => {
      expect(resp).toEqual({});
    }));
  }));

  it('editUser: should update user', fakeAsync(() => {
    // Expect a call to this URL
    const req = httpTestingController.expectNone(
      '/user/dummy'
    );

    const sub = service.editUser('dummy');
    tick();

    expect(sub.subscribe(resp => {
      expect(resp).toEqual(undefined);
    }));
  }));


  it('changePassword: should change pswd', fakeAsync(() => {
    // Expect a call to this URL
    const req = httpTestingController.expectNone(
      '/user/dummy'
    );

    const sub = service.changePassword('dummy');
    tick();

    expect(sub.subscribe(resp => {
      expect(resp).toEqual(undefined);
    }));
  }));

});
