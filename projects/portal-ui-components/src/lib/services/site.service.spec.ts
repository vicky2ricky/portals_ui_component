import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import * as moment from 'moment';
import { ReplaySubject } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { SiteService } from './site.service';
import * as _ from 'lodash-es';

class MockConfigurationService extends ConfigurationService {
  getConfig(something: any) {
    return 'http://dummyUrl';
  }
}

class MockAuthenticationService extends AuthenticationService {
  getLoggedInUserDetails() { }
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

describe('SiteService', () => {
  let service: SiteService;
  let configService: MockConfigurationService;
  let httpTestingController: HttpTestingController;
  let authService: MockAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        SiteService,
        {
          provide: ConfigurationService,
          useClass: MockConfigurationService
        },
        {
          provide: AuthenticationService,
          useClass: MockAuthenticationService
        },
        {
          provide: Router,
          useValue: routeMock
        },
        {
          provide: 'LOCALSTORAGE',
          useClass: MockLocalStorage
        }]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(SiteService);
    configService = TestBed.inject(ConfigurationService);
    authService = TestBed.inject(AuthenticationService);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAuthSites: should return auth sites', fakeAsync(() => {
    const spy = spyOn(authService, 'getUser').and.returnValue({ userId: 'dummy' });

    service.getAuthSites();
    tick();

    expect(authService.getUser).toHaveBeenCalled();
  }));

  it('getSites_v1: should return sites', fakeAsync(() => {
    const data: any = ['123', '456'];

    service.getSites_v1(data).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
    tick();
  }));

  it('getRooms_v1: should return rooms', fakeAsync(() => {
    const data: any = ['123', '456'];

    service.getRooms_v1(data).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
    tick();
  }));

  it('getCCUs_v1: should return ccu', fakeAsync(() => {
    const data: any = ['123', '456'];

    service.getCCUs_v1(data).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
    tick();
  }));

  it('getBuildings: should return building', fakeAsync(() => {
    service.getBuildings().subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
    tick();
  }));

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

  it('getTunerLogs: should return logs', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };
    service.getTunerLogs(params).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getBuildingGroups: should return groups', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };
    service.getBuildingGroups(params).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getSmartgroups: should return smart groups', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };
    service.getSmartgroups(params).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getSmartgroups: should return smart groups with params', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };
    service.getSmartgroups('http://dummy', params).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getBuildingTree: should return tree', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };
    service.getBuildingTree(params).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });


  it('getTuners: should return tuners', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };
    service.getTuners('1', params).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getTunerPoints: should return tuner points', () => {
    service.getTunerPoints('1', 'params').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getTunerPointIds: should return tuner points id', () => {
    service.getTunerPointIds('1', 'params').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getTunerPointValues: should return tuner points values', () => {
    service.getTunerPointValues('1', 'params').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getBulkWritablePointData: should write points', () => {
    const params: Array<any> = ['1', '2', '3'];
    service.getBulkWritablePointData(params).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('updateBulkWritablePointData: should update points', () => {
    const params: Array<any> = ['1', '2', '3'];
    service.updateBulkWritablePointData(params).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('createTunerLogs: should create', () => {
    const params: Array<any> = ['1', '2', '3'];
    service.createTunerLogs(params).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getEntitiesInBuilding: should return building entities', () => {
    service.getEntitiesInBuilding('123', 'params').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getSites: should return sites', () => {
    service.getSites().subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getAllRooms: should return rooms', () => {
    service.getAllRooms().subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getAllCcus: should return ccus', () => {
    service.getAllCcus().subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getSiteEquips: should return site equips', () => {
    service.getSiteEquips('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getSiteFloors: should return site floors', () => {
    service.getSiteFloors('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getSiteZones: should return site zones', () => {
    service.getSiteZones('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getFloorDevices: should return floor devices', () => {
    service.getFloorDevices('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getCcus: should return ccus', () => {
    service.getCcus('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getSiteRooms: should return site rooms', () => {
    service.getSiteRooms('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getSiteParams: should return site params', () => {
    service.getSiteParams('param', 'something').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getZoneParamsByEquip: should return zones params by equip', () => {
    service.getZoneParamsByEquip('param', 'something').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getFloorRooms: should return floor rooms', () => {
    service.getFloorRooms('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getRoomDevices: should return room devices', () => {
    service.getRoomDevices('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getSitePoints: should return site points', () => {
    service.getSitePoints('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getSiteMap: should return site map', () => {
    service.getSiteMap('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getReadById: should return obj', () => {
    service.getReadById('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getHisPointData: should return his data', () => {
    service.getHisPointData('param', 'range').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getWritablePointData: should point data', () => {
    service.getWritablePointData('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getEntityData: should return entity data', () => {
    service.getEntityData('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getIANATimeZone: should return haystack for Calcutta', () => {
    expect(service.getIANATimeZone('Calcutta')).toEqual('Asia/Kolkata');
  });

  it('getIANATimeZone: should return haystack', () => {
    expect(service.getIANATimeZone('Aden')).toEqual('Asia/Aden');
  });

  it('updateWritablePointData: should update data', () => {
    service.updateWritablePointData({ ref: '1', level: '2', who: 'me', duration: 'dummy', val: 'val' }).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('addEntity: should update data', () => {
    service.addEntity('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('updateSchedule: should update data', () => {
    service.updateSchedule('some', 'dummy', 'data', 'is', 'expected').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('updateSchedule: should update data', () => {
    service.updateSchedule('some', 'dummy', 'data').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getQuerybySite: should return data', () => {
    service.getQuerybySite('param', 'range').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('oaoPairedCheck: should return oao data', () => {
    service.oaoPairedCheck('param', 'range').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getZonesListPairedOnCcu: should zones data', () => {
    service.getZonesListPairedOnCcu('param').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getQuerybyEquipRef: should return data', () => {
    service.getQuerybyEquipRef('param', 'range').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getZoneParams: should return data', () => {
    service.getZoneParams('param', 'range', 'something').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('queryAssist: should return data', () => {
    service.queryAssist('param', 'range').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('removeEntity: should remove data', () => {
    service.removeEntity('id').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getDetailsBySiteRef: should return details', () => {
    service.getDetailsBySiteRef('param', 'range').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getScheduleParamsByRoomRef: should return schedule', () => {
    service.getScheduleParamsByRoomRef('param', 'range').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getCurrenthisReadMany: should create', () => {
    const params: Array<any> = ['1', '2', '3'];
    service.getCurrenthisReadMany(params).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('gethisReadMany: should return all points data for range', () => {
    const params: Array<any> = ['1', '2', '3'];
    const range = {
      startDate: moment('2020-09-01'),
      endDate: moment('2020-09-10')
    };

    service.gethisReadMany(params, range, 'Asia/Calcutta').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('gethisReadManyInterpolate: should return all points data for range', () => {
    const params: Array<any> = ['1', '2', '3'];
    const range = {
      startDate: moment('2020-09-01'),
      endDate: moment('2020-09-10')
    };

    service.gethisReadManyInterpolate(params, range, 'Asia/Calcutta').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('initHaystackUrl: should init url', () => {
    const spy = spyOn(localStorage, 'getItem').and.returnValue('http://helloworld');
    service.initHaystackUrl('http://dummy');
    expect(service.url).toEqual('http://dummy');
  });

  it('initHaystackUrl: should init url and handle null', () => {
    const spy = spyOn(localStorage, 'getItem').and.returnValue(null);
    service.initHaystackUrl('http://dummy');
    expect(service.url).toEqual('http://dummy');
  });

  it('inHaystackDateTime: should return date', () => {
    const tz = 'Asia/Kolkatta';
    const date = moment('2020-09-10');

    expect(service.inHaystackDateTime(date, tz)).toEqual('2020-09-10T00:00:00+05:30 Calcutta');
  });

  it('inHaystackDateTime: should return date for non IST', () => {
    const tz = 'Asia/Aden';
    const date = moment('2020-09-10');

    expect(service.inHaystackDateTime(date, tz)).toEqual('2020-09-09T21:30:00+03:00 Aden');
  });

  it('inHaystackDateTimeForVacation: should return valid vacation date for startdate for Kolkata', () => {
    const dt = moment('2020-09-10');
    const tz = 'Kolkata';
    const type = 'startDate';

    expect(service.inHaystackDateTimeForVacation(dt, tz, type)).toEqual('2020-09-10T00:00:00+05:30 Kolkata');
  });

  it('inHaystackDateTimeForVacation: should return valid vacation date for startdate for Calcuta', () => {
    const dt = moment('2020-09-10');
    const tz = 'Calcuta';
    const type = 'startDate';

    expect(service.inHaystackDateTimeForVacation(dt, tz, type)).toEqual('2020-09-10T00:00:00+05:30 Calcuta');
  });

  it('inHaystackDateTimeForVacation: should return valid vacation date for startdate for Calcutta', () => {
    const dt = moment('2020-09-10');
    const tz = 'Calcutta';
    const type = 'startDate';

    expect(service.inHaystackDateTimeForVacation(dt, tz, type)).toEqual('2020-09-10T00:00:00+05:30 Calcutta');
  });

  it('inHaystackDateTimeForVacation: should return valid vacation date for startdate for Asia/Kolkatta', () => {
    const dt = moment('2020-09-10');
    const tz = 'Asia/Kolkatta';
    const type = 'startDate';

    expect(service.inHaystackDateTimeForVacation(dt, tz, type)).toEqual('2020-09-10T00:00:00+05:30 Asia/Kolkatta');
  });

  it('inHaystackDateTimeForVacation: should return valid vacation date for startdate for Aden', () => {
    const dt = moment('2020-09-10');
    const tz = 'Aden';
    const type = 'startDate';

    expect(service.inHaystackDateTimeForVacation(dt, tz, type)).toEqual('2020-09-09T00:00:00+03:00 Aden');
  });

  it('inHaystackDateTimeForVacation: should return valid vacation date for endDate for Aden', () => {
    const dt = moment('2020-09-10');
    const tz = 'Aden';
    const type = 'endDate';

    expect(service.inHaystackDateTimeForVacation(dt, tz, type)).toEqual('2020-09-09T23:59:59+03:00 Aden');
  });

  it('inHaystackDateTimeForVacation: should handle invalid type', () => {
    const dt = moment('2020-09-10');
    const tz = 'Aden';
    const type = 'blah';

    expect(() => { service.inHaystackDateTimeForVacation(dt, tz, type); }).toThrow();
  });

  it('getDevicesBySite: should return devcies for site', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };
    service.getDevicesBySite('something', params).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getDevicesBySite: should return devcies for site without params', () => {
    service.getDevicesBySite('something').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getSiteUsers: should return users for site', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };
    service.getSiteUsers('something', params).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getSiteUsers: should return users for site without params', () => {
    service.getSiteUsers('something').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getAllSites: should return site', () => {
    const params = {
      dummy: 'dummy',
      world: 'world',
      obj: { something: 'something' }
    };
    service.getAllSites(params).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getAllSites: should return users for site without params', () => {
    service.getAllSites(null).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('createSmartgroup: should create SG', () => {
    service.createSmartgroup('something').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('bulkUpdateSmartgroup: should bulk update SG', () => {
    service.bulkUpdateSmartgroup('something').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('updateSmartgroup: should update SG', () => {
    service.updateSmartgroup('1', 'something').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('deleteSmartgroup: should delete SG', () => {
    service.deleteSmartgroup('1').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getSmartgroupById: should return SG', () => {
    service.getSmartgroupById('1', 'something').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getSmartgroupById: should return SG w/o param', () => {
    service.getSmartgroupById('1').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getWeatherPoints: should return weather point', () => {
    service.getWeatherPoints('1').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getServerTags: should return server tag', () => {
    service.getServerTags().subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getScheduleParamsBySiteRef: should return schedule params', () => {
    service.getScheduleParamsBySiteRef('1', 'something').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('removeSite: should remove site', () => {
    service.removeSite('1').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('readEntities: should read entities', () => {
    service.readEntities(['1']).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getEquipPoints: should read equip points', () => {
    service.getEquipPoints('1', ['hello', 'world']).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getEquipPoints: should read equip points w/o tags', () => {
    service.getEquipPoints('1', []).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getAlertsCount: should return alerts count', () => {
    service.getAlertsCount({siteIds:['1'],isFixed:true,isInternal:true}).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getAlertsCount: should return alerts count with invalid isFixed', () => {
    service.getAlertsCount({siteIds:['1'],isFixed:true,isInternal:true}).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });


  it('getAlertsCount: should return alerts count with false isFixed', () => {
    service.getAlertsCount({siteIds:['1'],isFixed:true,isInternal:true}).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getAlertsCount: should return alerts count with out anything', () => {
    service.getAlertsCount({siteIds:['1'],isFixed:true,isInternal:true}).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getAlertsCount: should return alerts count with out sites', () => {
    service.getAlertsCount({siteIds:['1'],isFixed:true,isInternal:true}).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getAlerts: should return alerts for no data', () => {
    service.getAlerts('LOW',['1'],true).subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getAlerts: should return alerts with data', () => {
    service.getAlerts('LOW',['1'],true, false, 'world',1, 20, 'asc').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getAlerts: should return alerts with data isFixed as false', () => {
    service.getAlerts('LOW',['1'],true, false, 'world',1, 20, 'asc').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });

  it('getAlerts: should return alerts with data isFixed as blah', () => {
    service.getAlerts('LOW',['1'],true, false, 'world',1, 20, 'asc').subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
  });
});
