import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterEvent } from '@angular/router';
import { exception } from 'console';
import * as moment from 'moment';
import { of, ReplaySubject, Subject } from 'rxjs';
import { AlertService } from './alert.service';
import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { DataService } from './data.service';
import { HelperService } from './hs-helper.service';
import { SiteService } from './site.service';

class MockAuthenticationService extends AuthenticationService {
}

class MockConfigurationService extends ConfigurationService {
  getConfig(something: any) {
    return 'http://dummyUrl';
  }
}

class MockSiteService extends SiteService {
}

class MatDialogMock {
  // When the component calls this.dialog.open(...) we'll return an object
  // with an afterClosed method that allows to subscribe to the dialog result observable.
  open() {
    return {
      afterClosed: () => of({ action: true })
    };
  }
}

const eventSubject = new ReplaySubject<RouterEvent>(1);
const routeMock = {
  navigate: jasmine.createSpy('navigate'),
  events: eventSubject.asObservable(),
  url: 'dummy'
};

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

describe('HsHelperService', () => {
  let service: HelperService;
  let authService: MockAuthenticationService;
  let dataService: DataService;
  let siteService: SiteService;
  let alertService: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HelperService,
        DataService,
        AlertService,
        {
          provide: AuthenticationService,
          useClass: MockAuthenticationService
        },
        {
          provide: SiteService,
          useClass: MockSiteService
        },
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
        },
        {
          provide: MatDialog,
          useClass: MatDialogMock
        }]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.get(HelperService);
    authService = TestBed.get(AuthenticationService);
    dataService = TestBed.get(DataService);
    siteService = TestBed.get(SiteService);
    alertService = TestBed.get(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('raiseEvent: should raise event', fakeAsync(() => {
    const sub = service.cancelledChange.subscribe(resp => {
      expect(resp).toEqual({ list: 'Hello world', activeurl: 'http://fakUrl' });
      sub.unsubscribe();
    });
    const spy = spyOn(localStorage, 'getItem').and.returnValue('http://fakUrl');
    service.raiseEvent('Hello world');
    tick();
  }));

  it('isRef: should return true', () => {
    const val = 'r:hello';
    expect(service.isRef(val)).toEqual(true);
  });

  it('isRef: should return false', () => {
    const val = 'b:hello';
    expect(service.isRef(val)).toEqual(false);
  });

  it('getUserName: should return username', () => {
    const spy = spyOn(authService, 'getLoggedInUserDetails').and.returnValue({ firstName: 'Hello', lastName: 'World' });
    expect(service.getUserName()).toEqual('Hello World');
  });

  it('getUserName: should return null', () => {
    const spy = spyOn(authService, 'getLoggedInUserDetails').and.returnValue(undefined);
    expect(service.getUserName()).toEqual(null);
  });

  it('isMarker: should return true', () => {
    const val = 'm:hello';
    expect(service.isMarker(val)).toEqual(true);
  });

  it('isMarker: should return false', () => {
    const val = 'b:hello';
    expect(service.isMarker(val)).toEqual(false);
  });

  it('parseRef: should retrun value', () => {
    const val = 'r:hello world';
    expect(service.parseRef(val)).toEqual('hello');
  });

  it('stripHaystackTypeMapping: should retrun value', () => {
    const val = {
      tz: 'Asia/Calcutta',
      m: 'hello'
    };

    expect(service.stripHaystackTypeMapping(val)).toEqual({ tz: 'Asia/Calcutta', m: 'hello' });
  });

  it('stripHaystackTypeMapping: should retrun empty', () => {
    const val = null;

    expect(service.stripHaystackTypeMapping(val)).toEqual('');
  });

  it('parseVacation: should return vacation', () => {
    const data = {
      stdt: '2020-09-25T00:00:00+05:30 Calcutta',
      etdt: '2020-09-30T11:59:59+05:30 Calcutta'
    };

    expect(service.parseVacation(data, 'Asia/Calcutta')).toEqual([{
      'Start Time': '2020-09-25T00:00:00',
      'End Time': '2020-09-30T11:59:59'
    }]);
  });

  it('processWritableArray: should return value', () => {
    const response = {
      metadata: [
        { errTrace: 'Oops' }
      ],
      rows: [
        { ref: '@123' },
        { level: '1' },
        { duration: '20' }
      ]
    };
    expect(service.processWritableArray('@567', response)).toBeTruthy();
  });

  it('processWritableArray: should return value part2', () => {
    const response = {
      metadata: [
        { errTrace: 'Oops' }
      ],
      rows: [
        { ref: '@123' },
        { level: '1' },
        { duration: 0 }
      ]
    };
    expect(service.processWritableArray('@567', response)).toBeTruthy();
  });

  it('setPointData: should return value', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of(
      ['123|read|key~systemMode|update']
    ));

    const spy2 = spyOn(siteService, 'getHisPointData').and.returnValue(of({
      rows: [
      ]
    }));
    service.opObj = {
      systemMode: '123'
    };

    service.setPointData();
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));

  it('setPointData: should return value part2', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of(
      ['123|read|key~systemMode|update']
    ));

    const spy2 = spyOn(siteService, 'getHisPointData').and.returnValue(of({
      rows: [
        { ref: '@123' },
        { level: '1' },
        { duration: 0 }
      ]
    }));
    service.opObj = {
      systemMode: '123'
    };

    service.setPointData();
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));

  it('setPointData: should return value for write', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of(
      ['123|write|key~systemMode|update']
    ));

    const spy2 = spyOn(siteService, 'getWritablePointData').and.returnValue(of({
      rows: [
      ]
    }));
    service.opObj = {
      systemMode: '123'
    };

    service.setPointData();
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));

  it('setPointData: should return value for write part2', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of(
      ['123|write|key~systemMode|update']
    ));

    const spy2 = spyOn(siteService, 'getWritablePointData').and.returnValue(of({
      rows: [
        { val: 0 }
      ]
    }));
    service.opObj = {
      systemMode: '123'
    };

    service.setPointData();
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));


  it('setPointData: should return value for schedule', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of(
      ['123|schedule|key~systemMode|update']
    ));

    const spy2 = spyOn(siteService, 'getReadById').and.returnValue(of({
      rows: [
      ]
    }));
    service.opObj = {
      systemMode: '123'
    };

    service.setPointData();
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));

  it('setPointData: should return value for schedule part2', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of(
      ['123|schedule|key~systemMode|update']
    ));

    const spy2 = spyOn(siteService, 'getReadById').and.returnValue(of({
      rows: [
        { ref: '@123' },
        { level: '1' },
        { duration: 0 }
      ]
    }));
    service.opObj = {
      systemMode: '123'
    };

    service.setPointData();
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));

  it('setPointData: should return value for vacation', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of(
      ['123|vacation|key~systemMode|update']
    ));

    const spy2 = spyOn(siteService, 'getReadById').and.returnValue(of({
      rows: [
      ]
    }));
    service.opObj = {
      systemMode: '123'
    };

    service.setPointData();
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));

  it('setPointData: should return value for vacation part2', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of(
      ['123|vacation|key~systemMode|update']
    ));

    const spy2 = spyOn(siteService, 'getReadById').and.returnValue(of({
      rows: [
        { ref: '@123' },
        { level: '1' },
        { duration: 0 }
      ]
    }));
    service.opObj = {
      systemMode: '123'
    };

    service.setPointData();
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));

  it('setPointData: should return value for default', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of(
      ['123|blah|key~systemMode|update']
    ));

    const spy2 = spyOn(siteService, 'getReadById').and.returnValue(of({
      rows: [
      ]
    }));
    service.opObj = {
      systemMode: '123'
    };

    service.setPointData();
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));

  it('setPointData: should return value for write', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of(
      ['123|blah|key~systemMode|write']
    ));

    const spy2 = spyOn(siteService, 'getReadById').and.returnValue(of({
      rows: [
      ]
    }));
    service.opObj = {
      systemMode: '123'
    };

    service.setPointData();
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));

  it('setPointData: should return value for write part2', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of(
      ['123|blah|key|update']
    ));

    const spy2 = spyOn(siteService, 'getReadById').and.returnValue(of({
      rows: [
      ]
    }));
    service.opObj = {
      systemMode: '123'
    };

    service.setPointData();
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));

  it('setPointData: should handle empty response', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of(null
    ));

    const spy2 = spyOn(siteService, 'getReadById').and.returnValue(of({
      rows: [
      ]
    }));
    service.opObj = {
      systemMode: '123'
    };

    service.setPointData();
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));

  it('getPointData: should call setPointData', () => {
    const spy = spyOn(service, 'setPointData').and.returnValue();
    service.getPointData();
    expect(service.setPointData).toHaveBeenCalled();
  });

  it('isDataLoaded: shoudl return value', () => {
    expect(service.isDataLoaded('123')).toEqual('123');
  });

  it('isDataLoaded: shoudl return value part2', () => {
    expect(service.isDataLoaded(false)).toEqual('Loading...');
  });

  it('isDataLoaded: shoudl return value part3', () => {
    expect(service.isDataLoaded('Hello')).toEqual('hello');
  });

  it('assemblePointIdData: should return value', () => {
    const spy = spyOn(dataService, 'setId').and.returnValue();
    service.assemblePointIdData('123', 'write', 'whatever', 'equip', 'something');
    expect(dataService.setId).toHaveBeenCalled();
  });

  it('assemblePointIdData: should return part2', () => {
    const spy = spyOn(dataService, 'setId').and.returnValue();
    service.assemblePointIdData('123', 'write', 'whatever', null, 'something');
    expect(dataService.setId).toHaveBeenCalled();
  });

  it('updatePointIdData: should update', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of({
      rows: [
        { id: '123' }
      ]
    }));
    service.updatePointIdData('123', 'write', 'whatever', null, 'something');
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));

  it('updatePointIdData: should update part2', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of({
      rows: [
        { id: '123' }
      ]
    }));
    service.updatePointIdData('123', 'write', 'whatever', 'hello', 'something');
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));

  it('updatePointIdData: should update part3', fakeAsync(() => {
    const spy = spyOn(dataService, 'getId').and.returnValue(of(null));
    service.updatePointIdData('123', 'write', 'whatever', 'hello', 'something');
    tick();
    expect(dataService.getId).toHaveBeenCalled();
  }));

  it('listEntities: should retrun value', () => {
    const res = {
      rows: [
        {
          id: 'r:456 r:123'
        },
        {
          id: 'r:456 r:123',
          r: 'hello'
        }
      ]
    };

    expect(service.listEntities(res)).toBeTruthy();
  });

  it('clearData: should clear data', () => {
    service.clearData();

    expect(service.opObj).toEqual({});
  });

  it('ngOnDestroy: should unsubscribe tokenTimerSubscription', () => {
    service.ngOnDestroy();
    expect(service).toBeTruthy();
  });

  it('listTuners: should retrun tuners', () => {
    const tuners = [
      {
        markers: ['equip', 'zone'], name: 'dabTest1', _id: 'dab1', referenceIDs: {
          equip: '123'
        }
      },
      {
        markers: ['equip', 'tuner', 'siteRef'], name: 'vavTest1', _id: 'vav1', referenceIDs: {
          equip: '123'
        }
      },
      {
        markers: ['tuner', 'equipRef'], name: 'vavTest2', _id: 'vav2', referenceIDs: {
          equip: '123'
        }
      },
      { markers: ['ti'], name: 'timeTest2', _id: 'time1' },
      {
        referenceIDs: {
          equip: '123'
        }
      }
    ];

    service.listTuners(tuners);
    expect(service.tunersInfo).toBeTruthy();
  });

  it('listZones: should return value', () => {
    const data = [{
      id: '123',
      type: 'room'
    }];

    service.listZones(data);
    expect(service.zones).toBeTruthy();
  });

  it('listZones: should return value', () => {
    const data = [];

    service.listZones(data);
    expect(service.zones).toBeTruthy();
  });

  it('listZones: should return value', () => {
    const data = [{
      id: '123',
      type: 'blah'
    }];

    service.listZones(data);
    expect(service.zones).toBeTruthy();
  });

  it('getPointIdbyTags: should retrun value', () => {
    const data = {
      entities: [{
        markers: ['hello', 'world']
      }]
    };
    const res = service.getPointIdbyTags(data, ['hello', 'world'], 'occupancy');
    expect(res).toBeTruthy();
  });

  it('createEntityStructure: should retrun value', () => {
    const data =
      [{
        markers: ['hello', 'world'],
        type: 'ccu',
        referenceIDs: {
          point: '123'
        },
        entities: []
      }];

    const res = service.createEntityStructure(data);
    expect(res).toBeTruthy();
  });

  it('createEntityStructure: should retrun value part2', () => {
    const data =
      [{
        markers: ['hello', 'world'],
        type: 'ccu',
        referenceIDs: {
          point: '123'
        },
        entities: []
      },
      {
        markers: ['hello', 'world'],
        type: 'point',
        referenceIDs: {
          point: '123'
        },
        entities: []
      },
      {
        markers: ['hello', 'world'],
        type: 'floor',
        referenceIDs: {
          point: '123'
        },
        entities: []
      }];

    const res = service.createEntityStructure(data);
    expect(res).toBeTruthy();
  });

  it('forceOverrideData: should force overwrite', () => {
    const data = [{
      level: 8
    }];
    const spy = spyOn(service, 'getUserName').and.returnValue('dummy joe');
    const spy2 = spyOn(service, 'writeDataToHaystack').and.returnValue();
    service.forceOverrideData('write', 'balh', data);
    expect(service.writeDataToHaystack).toHaveBeenCalled();
  });

  it('forceOverrideData: should force overwrite for less level', () => {
    const data = [{
      level: 6
    }];
    const spy = spyOn(service, 'getUserName').and.returnValue('dummy joe');
    const spy2 = spyOn(service, 'writeDataToHaystack').and.returnValue();
    service.forceOverrideData('write', 'balh', data);
    expect(service.writeDataToHaystack).toHaveBeenCalled();
  });

  it('writeDataToHaystack: should write data', () => {
    const data = {
      ref: '123',
      level: 10,
      who: `web_abhi`,
      duration: '0ms',
      val: 'N'
    };

    const spy = spyOn(service, 'updateExistingZoneSetting').and.returnValue();
    const spy2 = spyOn(siteService, 'updateWritablePointData').and.returnValue(of({}));
    const spy3 = spyOn(alertService, 'success').and.returnValue();

    service.writeDataToHaystack(data, 'read');
    expect(siteService.updateWritablePointData).toHaveBeenCalled();
  });

  it('writeDataToHaystack: should write data part2', () => {
    const data = {
      ref: '123',
      level: 10,
      who: `web_abhi`,
      duration: '0ms',
      val: 'hello'
    };

    const spy = spyOn(service, 'updateExistingZoneSetting').and.returnValue();
    const spy2 = spyOn(siteService, 'updateWritablePointData').and.returnValue(of({}));
    const spy3 = spyOn(alertService, 'success').and.returnValue();

    service.writeDataToHaystack(data, 'read');
    expect(siteService.updateWritablePointData).toHaveBeenCalled();
  });

  it('updateExistingZoneSetting: should update', () => {
    const data = {
      ref: '123',
      val: 123
    };

    service.opObj = {
      dummy: {
        id: '123'
      }
    };

    service.updateExistingZoneSetting(data, 'dummy');
    expect(service.opObj).toBeTruthy();
  });

  it('updateExistingZoneSetting: should update part1', () => {
    const data = {
      ref: '123',
      val: 'blah'
    };

    service.opObj = {
      dummy: {
        id: '123'
      }
    };

    service.updateExistingZoneSetting(data, 'dummy');
    expect(service.opObj).toBeTruthy();
  });

  it('updateExistingZoneSetting: should update part2', () => {
    const data = {
      ref: '123',
      val: 'blah'
    };

    service.opObj = {
      dummy: {
        id: '1234'
      }
    };

    service.updateExistingZoneSetting(data, 'dummy');
    expect(service.opObj).toBeTruthy();
  });

  it('updateExistingZoneSetting: should update part3', () => {
    const data = {
      ref: '123',
      val: 'blah'
    };

    service.opObj = {
      dummy: {
        priorityArray: {
          id: '123'
        }
      }
    };

    service.updateExistingZoneSetting(data, 'dummy');
    expect(service.opObj).toBeTruthy();
  });

  it('updateExistingZoneSetting: should update part4', () => {
    const data = {
      ref: '123',
      val: 123
    };

    service.opObj = {
      dummy: {
        priorityArray: {
          id: '123'
        }
      }
    };

    service.updateExistingZoneSetting(data, 'dummy');
    expect(service.opObj).toBeTruthy();
  });

  it('updateExistingZoneSetting: should update part5', () => {
    const data = {
      ref: '123',
      val: 123
    };

    service.opObj = {
      dummy: {
        priorityArray: {
          id: '1234'
        }
      },
      something: []
    };

    service.updateExistingZoneSetting(data, 'dummy');
    expect(service.opObj).toBeTruthy();
  });

  it('removeDeletedZoneSetting: should remove value', () => {
    const data = '123|hello~dummy|dummy~joe|world';
    service.opObj = {
      joe: {
        dummy: {
          id: '123'
        }
      }
    };
    service.removeDeletedZoneSetting(data);
    expect(service.opObj).toBeTruthy();
  });

  it('removeDeletedZoneSetting: should remove value part2', () => {
    const data = 'joe|hello|dummy|world';
    service.opObj = {
      dummy: [{
        id: 'joe'
      }]
    };

    service.removeDeletedZoneSetting(data);
    expect(service.opObj).toBeTruthy();
  });

  it('removeDeletedZoneSetting: should remove value part3', () => {
    const data = '123|hello~dummy|dummy~joe|world';
    service.opObj = {
      joe: {
        dummy: {
          blah: '123'
        }
      }
    };
    service.removeDeletedZoneSetting(data);
    expect(service.opObj).toBeTruthy();
  });

  it('removeDeletedZoneSetting: should remove value part4', () => {
    const data = '123|hello~dummy|dummy~joe|world';
    service.opObj = {
      joe: {
        dummy: {
          id: '1234',
          priorityArray: {
            id: '123'
          }
        }
      }
    };
    service.removeDeletedZoneSetting(data);
    expect(service.opObj).toBeTruthy();
  });

  it('removeDeletedZoneSetting: should remove value part5', () => {
    const data = 'joe|hello|dummy|world';
    service.opObj = {
      dummy: {
        id: 'joe'
      }
    };

    service.removeDeletedZoneSetting(data);
    expect(service.opObj).toBeTruthy();
  });

  it('removeDeletedZoneSetting: should remove value part6', () => {
    const data = 'joe|hello|dummy|world';
    service.opObj = {
      dummy: {
        id: 'joes',
        priorityArray: {
          id: 'joe'
        }
      }
    };

    service.removeDeletedZoneSetting(data);
    expect(service.opObj).toBeTruthy();
  });

  it('removeDeletedZoneSetting: should remove value part6', () => {
    const data = 'joe|hello|dummy|world';
    service.opObj = {
      dummy: {
        id: 'joes',
        priorityArray: {
          id: 'joes'
        }
      }
    };

    service.removeDeletedZoneSetting(data);
    expect(service.opObj).toBeTruthy();
  });

  it('removeDeletedZoneSetting: should remove value part7', () => {
    const data = '123|hello~dummy|dummy~joe|world';
    service.opObj = {
      joe: {
        dummy: {
          id: '1234',
          priorityArray: {
            id: '1234'
          }
        }
      }
    };
    service.removeDeletedZoneSetting(data);
    expect(service.opObj).toBeTruthy();
  });

  it('sortPriorityArray: should sort priority array', () => {
    const data = [{
      level: 3
    },
    {
      level: 7
    },
    {
      level: 2
    }];

    const res = service.sortPriorityArray(data);
    expect(res).toBeTruthy();
  });

  it('getBuildingComponents: should return val', () => {
    const data = [
      { type: 'hello' },
      { type: 'world' },
    ];

    const res = service.getBuildingComponents(data, 'world');
    expect(res).toBeTruthy();
  });

  it('getBuildingTunerPropertyId: should return value', () => {
    const data = [
      {
        markers: ['hello', 'world', 'tuner'],
        entities: [{
          markers: ['blah1', 'blah2', 'tuner'],
        }]
      },
      {
        markers: ['foo', 'bar']
      }
    ];

    const res = service.getBuildingTunerPropertyId(data, ['hello']);

    expect(res).toEqual('');
  });

  it('getBuildingTunerPropertyId: should return value part2', () => {
    const data = [
      {
        markers: ['hello', 'world', 'tuner'],
        entities: [{
          markers: ['blah1', 'blah2', 'tuner'],
        }]
      },
      {
        markers: ['foo', 'bar']
      }
    ];

    const res = service.getBuildingTunerPropertyId(data, ['tuner']);

    expect(res).toEqual(undefined);
  });

  it('getPointInfobyTags: should return value', () => {
    const data = [{
      entities: {
        markers: ['hello', 'wrold']
      }
    }];

    const res = service.getPointInfobyTags(data, ['hello']);

    expect(res).toBeTruthy();
  });

  it('getPointInfobyTags: should return value part2', () => {
    const data = {
      entities: {
        markers: ['hello', 'wrold']
      }
    };

    const res = service.getPointInfobyTags(data, ['hello']);

    expect(res).toBeTruthy();
  });


});

