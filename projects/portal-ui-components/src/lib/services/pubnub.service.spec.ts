import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterEvent } from '@angular/router';
import { of, ReplaySubject } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { DataService } from './data.service';
import { HelperService } from './hs-helper.service';
import { PubNubService } from './pubnub.service';
import { EventSourcePolyfill } from 'event-source-polyfill';

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

class MockConfigurationService extends ConfigurationService {
  getConfig(something: any) {
    return 'http://dummyUrl';
  }
}

class MockHelperService extends HelperService {

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

describe('PubnubService', () => {
  let service: PubNubService;
  let configService: MockConfigurationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DataService,
        HelperService,
        {
          provide: ConfigurationService,
          useClass: MockConfigurationService
        },
        {
          provide: 'LOCALSTORAGE',
          useClass: MockLocalStorage
        },
        {
          provide: Router,
          useValue: routeMock
        },
        {
          provide: MatDialog,
          useClass: MatDialogMock
        },
        {
          provide: HelperService,
          useClass: MockHelperService
        }
      ]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(PubNubService);
    configService = TestBed.inject(ConfigurationService);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterAll(() => {
    service.unsubscribe();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('subscribe: should subscribe', () => {
    service.eventSource = new EventSourcePolyfill('', {});

    const spy = spyOn(configService, 'getConfig').and.returnValue('http://dummyUrl');
    const spy2 = spyOn(localStorage, 'getItem').and.returnValue('some_token');

    service.subscribe(['123', '456']);

    expect(service.eventSource).toBeTruthy();
  });

  it('subscribe: should subscribe part2', () => {
    service.eventSource = null;

    const spy = spyOn(configService, 'getConfig').and.returnValue('http://dummyUrl');
    const spy2 = spyOn(localStorage, 'getItem').and.returnValue('some_token');

    service.subscribe(['123', '456']);

    expect(service.eventSource).toBeTruthy();
  });

  it('unsubscribe: should unsubscribe', () => {
    service.eventSource = new EventSourcePolyfill('', {});

    service.unsubscribe();

    expect(service.eventSource).toEqual(null);
  });

  it('unsubscribe: should unsubscribe part2', () => {
    service.eventSource = null;

    service.unsubscribe();

    expect(service.eventSource).toEqual(null);
  });

  it('fetchHistory: should fetch history', () => {
    const spy = spyOn(configService, 'getConfig').and.returnValue('http://dummy');
    service.fetchHistory('123');
    expect(configService.getConfig).toHaveBeenCalled();
  });

  it('publish: should publish', () => {
    const spy = spyOn(configService, 'getConfig').and.returnValue('http://dummy');
    service.publish('123', 'hello');
    expect(configService.getConfig).toHaveBeenCalled();
  });

  it('parsePubnubContent: should return val updatePoint', () => {
    const data = {
      command: 'updatePoint',
      who: 'dummy',
      id: '123',
      val: '456',
      level: 10
    };

    const res = service.parsePubnubContent(data);
    expect(res).toBeTruthy();
  });

  it('parsePubnubContent: should return val updateSchedule', () => {
    const data = {
      command: 'updateSchedule',
      id: '123'
    };

    const res = service.parsePubnubContent(data);
    expect(res).toBeTruthy();
  });

  it('parsePubnubContent: should return val sync', () => {
    const data = {
      command: 'sync',
      siteId: '123'
    };

    const res = service.parsePubnubContent(data);
    expect(res).toBeTruthy();
  });

  it('parsePubnubContent: should return val defualt', () => {
    const data = {
      command: 'hello',
      ids: '123'
    };

    const res = service.parsePubnubContent(data);
    expect(res).toBeTruthy();
  });

  it('parsePubnubContent: should return val remoteCmdUpdate', () => {
    const data = {
      command: 'remoteCmdUpdate',
      who: 'dummy',
      remoteCmdType: 'update'
    };

    const res = service.parsePubnubContent(data);
    expect(res).toBeTruthy();
  });
});
