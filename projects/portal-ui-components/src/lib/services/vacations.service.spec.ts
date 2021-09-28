import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, RouterEvent } from '@angular/router';
import * as moment from 'moment';
import { of, ReplaySubject } from 'rxjs';
import { VacationScheduleDetails } from '../models/vacations.model';
import { ConfigurationService } from './configuration.service';
import { SiteService } from './site.service';
import { VacationsService } from './vacations.service';

const eventSubject = new ReplaySubject<RouterEvent>(1);
const routeMock = {
  navigate: jasmine.createSpy('navigate'),
  events: eventSubject.asObservable(),
  url: 'dummy'
};

class MockConfigurationService extends ConfigurationService {
  getConfig(something: any) {
    return 'http://dummyUrl';
  }
}

class MockSiteService extends SiteService {
  caretakerUrl = 'http://dummycareTaker';
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

describe('VacationsService', () => {
  let service: VacationsService;
  let siteService: MockSiteService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VacationsService,
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
        }]
    });

    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(VacationsService);
    siteService = TestBed.inject(SiteService);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    siteService.url$.next('http://dummy');
    expect(service).toBeTruthy();
  });

  it('updateVacation: should update vacation', fakeAsync(() => {
    const vac: VacationScheduleDetails = new VacationScheduleDetails('123', '456',
      '789', 'hello', moment('2020-09-24'), moment('2020-09-25'));
    const tz = 'Asia/Calcutta';

    const spy = spyOn(siteService, 'inHaystackDateTimeForVacation').and.returnValue('2020-09-10T00:00:00+05:30 Calcutta');
    const spy2 = spyOn(service, 'getHttpBody').and.callThrough();
    service.updateVacation(vac, tz);
    tick();
    expect(service.getHttpBody).toHaveBeenCalled();
  }));

  it('getHttpBody: should return body', () => {
    const vac: VacationScheduleDetails = new VacationScheduleDetails('', '456',
      '789', 'hello', moment('2020-09-24'), moment('2020-09-25'), false);
    const tz = 'Asia/Calcutta';
    const spy = spyOn(siteService, 'inHaystackDateTimeForVacation').and.returnValue('2020-09-10T00:00:00+05:30 Calcutta');
    const resp = service.getHttpBody(vac, tz);

    expect(resp).toBeTruthy();
  });

  it('getSIteTz: should return site tz', fakeAsync(() => {
    const spy = spyOn(siteService, 'getReadById').and.returnValue(of(
      {
        rows: [
          { tz: 'Asia/Calcutta' },
          { id: 'Hello' }
        ]
      }
    ));

    const sub = service.siteTimezone.subscribe(resp => {
      expect(resp).toEqual('Asia/Calcutta');
    });

    service.getSIteTz('123');
    tick();
  }));

  it('getSIteTz: should handle no response', fakeAsync(() => {
    const spy = spyOn(siteService, 'getReadById').and.returnValue(of(
      {
        rows: []
      }
    ));

    const sub = service.siteTimezone.subscribe(resp => {
      expect(resp).toEqual('');
    });

    service.getSIteTz('123');
    tick();
  }));

  it('getSIteTz: should handle no tz in response', fakeAsync(() => {
    const spy = spyOn(siteService, 'getReadById').and.returnValue(of(
      {
        rows: [
          { id: 'Hello' }
        ]
      }
    ));

    const sub = service.siteTimezone.subscribe(resp => {
      expect(resp).toEqual('');
    });

    service.getSIteTz('123');
    tick();
  }));
});
