import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, RouterEvent } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { ConfigurationService } from './configuration.service';

import { UserManagementService } from './user-management.service';

class MockConfigurationService extends ConfigurationService {
  getConfig(something: any) {
    return 'http://dummyUrl';
  }
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

const eventSubject = new ReplaySubject<RouterEvent>(1);
const routeMock = {
  navigate: jasmine.createSpy('navigate'),
  events: eventSubject.asObservable(),
  url: 'dummy'
};

describe('UserManagementService', () => {
  let service: UserManagementService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserManagementService,
        {
          provide: Router,
          useValue: routeMock
        },
        {
          provide: 'LOCALSTORAGE',
          useClass: MockLocalStorage
        },
        {
          provide: ConfigurationService,
          useClass: MockConfigurationService
        }]
    });

    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(UserManagementService);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setHttpParams: should set params', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };

    expect(service.setHttpParams(params)).toBeTruthy();
  });

  it('setHttpParams: should handle null', () => {
    const params = null;
    expect(service.setHttpParams(params)).toBeTruthy();
  });

  it('getUserOtherRoles: should return roles', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };

    const spy = spyOn(service, 'getUserOtherRoles').and.callThrough();
    service.getUserOtherRoles('123', params);
    expect(service.getUserOtherRoles).toHaveBeenCalled();
  });

  it('getUserOtherRoles: should return roles w/o params', () => {
    const spy = spyOn(service, 'getUserOtherRoles').and.callThrough();
    service.getUserOtherRoles('123');
    expect(service.getUserOtherRoles).toHaveBeenCalled();
  });

  it('getUsers: should return users', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };

    const spy = spyOn(service, 'getUsers').and.callThrough();
    service.getUsers(params);
    expect(service.getUsers).toHaveBeenCalled();
  });

  it('getUsers: should return users w/o params', () => {
    const spy = spyOn(service, 'getUsers').and.callThrough();
    service.getUsers();
    expect(service.getUsers).toHaveBeenCalled();
  });

  it('getBuildings: should return buildings', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };

    const spy = spyOn(service, 'getBuildings').and.callThrough();
    service.getBuildings(params);
    expect(service.getBuildings).toHaveBeenCalled();
  });

  it('getBuildings: should return buildings w/o params', () => {
    const spy = spyOn(service, 'getBuildings').and.callThrough();
    service.getBuildings();
    expect(service.getBuildings).toHaveBeenCalled();
  });

  it('getBuildingsByUser: should return buildings by user', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };

    const spy = spyOn(service, 'getBuildingsByUser').and.callThrough();
    service.getBuildingsByUser('id', params);
    expect(service.getBuildingsByUser).toHaveBeenCalled();
  });

  it('getBuildingsByUser: should return buildings w/o params', () => {
    const spy = spyOn(service, 'getBuildingsByUser').and.callThrough();
    service.getBuildingsByUser('id');
    expect(service.getBuildingsByUser).toHaveBeenCalled();
  });

  it('getOrgsByUser: should return orgs by user', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };

    const spy = spyOn(service, 'getOrgsByUser').and.callThrough();
    service.getOrgsByUser('id', params);
    expect(service.getOrgsByUser).toHaveBeenCalled();
  });

  it('getOrgsByUser: should return orgs w/o params', () => {
    const spy = spyOn(service, 'getOrgsByUser').and.callThrough();
    service.getOrgsByUser('id');
    expect(service.getOrgsByUser).toHaveBeenCalled();
  });

  it('getPreferences: should return preferences by user', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };

    const spy = spyOn(service, 'getPreferences').and.callThrough();
    service.getPreferences('id', params);
    expect(service.getPreferences).toHaveBeenCalled();
  });

  it('getPreferences: should return preferences w/o params', () => {
    const spy = spyOn(service, 'getPreferences').and.callThrough();
    service.getPreferences('id');
    expect(service.getPreferences).toHaveBeenCalled();
  });

  it('getUserOrganizations: should return orgs by user', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };

    const spy = spyOn(service, 'getUserOrganizations').and.callThrough();
    service.getUserOrganizations('id', params);
    expect(service.getUserOrganizations).toHaveBeenCalled();
  });

  it('getUserOrganizations: should return orgs w/o params', () => {
    const spy = spyOn(service, 'getUserOrganizations').and.callThrough();
    service.getUserOrganizations('id', null);
    expect(service.getUserOrganizations).toHaveBeenCalled();
  });

  it('getOrganizations: should return orgs', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };

    const spy = spyOn(service, 'getOrganizations').and.callThrough();
    service.getOrganizations(params);
    expect(service.getOrganizations).toHaveBeenCalled();
  });

  it('getOrganizations: should return orgs w/o params', () => {
    const spy = spyOn(service, 'getOrganizations').and.callThrough();
    service.getOrganizations();
    expect(service.getOrganizations).toHaveBeenCalled();
  });

  it('getZones: should return zones', () => {
    const spy = spyOn(service, 'getZones').and.callThrough();
    service.getZones();
    expect(service.getZones).toHaveBeenCalled();
  });

  it('getEndUers: should return user', () => {
    const spy = spyOn(service, 'getEndUers').and.callThrough();
    service.getEndUers();
    expect(service.getEndUers).toHaveBeenCalled();
  });

  it('getEndUers: should return end user', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };

    const spy = spyOn(service, 'getEndUers').and.callThrough();
    service.getEndUers(params);
    expect(service.getEndUers).toHaveBeenCalled();
  });

  it('getUserRoles: should return user roles', () => {
    const spy = spyOn(service, 'getUserRoles').and.callThrough();
    service.getUserRoles();
    expect(service.getUserRoles).toHaveBeenCalled();
  });

  it('getUserBySite: should return end user', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };

    const spy = spyOn(service, 'getUserBySite').and.callThrough();
    service.getUserBySite('123', params);
    expect(service.getUserBySite).toHaveBeenCalled();
  });

  it('getUserBySite: should return user roles', () => {
    const spy = spyOn(service, 'getUserBySite').and.callThrough();
    service.getUserBySite('123');
    expect(service.getUserBySite).toHaveBeenCalled();
  });

  it('setUserMgmtTypes: shoudl set', () => {
    service.setUserMgmtTypes(['123', 'id']);
    expect(service.getUserMgmtTypes()).toEqual(['123', 'id']);
  });

  it('createUser: should create user', () => {
    const spy = spyOn(service, 'createUser').and.callThrough();
    service.createUser('hello');
    expect(service.createUser).toHaveBeenCalled();
  });

  it('deleteUser: should delete user', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };

    const spy = spyOn(service, 'deleteUser').and.callThrough();
    service.deleteUser(params);
    expect(service.deleteUser).toHaveBeenCalled();
  });

  it('deleteUser: should delete without params', () => {
    const spy = spyOn(service, 'deleteUser').and.callThrough();
    service.deleteUser(null);
    expect(service.deleteUser).toHaveBeenCalled();
  });

  it('getAllUsers: should return user', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };

    const spy = spyOn(service, 'getAllUsers').and.callThrough();
    service.getAllUsers(params);
    expect(service.getAllUsers).toHaveBeenCalled();
  });

  it('getAllUsers: should return users w/o param', () => {
    const spy = spyOn(service, 'getAllUsers').and.callThrough();
    service.getAllUsers(null);
    expect(service.getAllUsers).toHaveBeenCalled();
  });

  it('updateUserDetails: should update users', () => {
    const spy = spyOn(service, 'updateUserDetails').and.callThrough();
    service.updateUserDetails('123', 'hello');
    expect(service.updateUserDetails).toHaveBeenCalled();
  });

  it('deleteSiteUser: should delete users', () => {
    const spy = spyOn(service, 'deleteSiteUser').and.callThrough();
    service.deleteSiteUser('123', 'hello');
    expect(service.deleteSiteUser).toHaveBeenCalled();
  });

  it('transferOwnership: should transfer ownership', () => {
    const spy = spyOn(service, 'transferOwnership').and.callThrough();
    service.transferOwnership('123');
    expect(service.transferOwnership).toHaveBeenCalled();
  });

  it('getZonesByUser: should return zone users', () => {
    const spy = spyOn(service, 'getZonesByUser').and.callThrough();
    service.getZonesByUser('123');
    expect(service.getZonesByUser).toHaveBeenCalled();
  });
});




