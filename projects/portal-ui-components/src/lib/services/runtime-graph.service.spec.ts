import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterEvent } from '@angular/router';
import { of, ReplaySubject } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { HelperService } from './hs-helper.service';

import { RuntimeGraphService } from './runtime-graph.service';
import { SiteService } from './site.service';

class MockSiteService extends SiteService {
  caretakerUrl = '';
}
class MockHelperService extends HelperService { }

class MockConfigurationService extends ConfigurationService {
  getConfig(something: any) {
    return 'http://dummyUrl';
  }
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

describe('RuntimeGraphsService', () => {
  let service: RuntimeGraphService;
  let siteService: MockSiteService;
  let helperService: MockHelperService;
  let httpTestingController: HttpTestingController;
  let configService: MockConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RuntimeGraphService,
        {
          provide: SiteService,
          useClass: MockSiteService
        },
        {
          provide: HelperService,
          useClass: MockHelperService
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
        }
      ]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(RuntimeGraphService);
    siteService = TestBed.inject(SiteService);
    helperService = TestBed.inject(HelperService);
    configService = TestBed.inject(ConfigurationService);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCMPortsMapping: should call', () => {
    service.getCMPortsMapping('123');
    expect(service.iscmBoardPortsMappingsCollectionRequested).toBeTruthy();
  });

  it('getCMPortsMapping: should call part2', () => {
    service.iscmBoardPortsMappingsCollectionFetched.set('123', true);
    service.getCMPortsMapping('123');
    expect(service.iscmBoardPortsMappingsCollectionRequested).toBeTruthy();
  });

  it('getCMPortsMapping: should call part3', () => {
    service.iscmBoardPortsMappingsCollectionRequested.set('123', true);
    service.iscmBoardPortsMappingsCollectionFetched.set('123', false);
    service.getCMPortsMapping('123');
    expect(service.iscmBoardPortsMappingsCollectionRequested).toBeTruthy();
  });

  it('getCMPortsMapping: should call', () => {
    service.getCMPortsMapping('123');
    expect(service.iscmBoardPortsMappingsCollectionFetched).toBeTruthy();
  });

  it('getCMPortsMapping: should call part2', () => {
    service.iscmBoardPortsMappingsCollectionFetched.set('123', true);
    service.getCMPortsMapping('123');
    expect(service.iscmBoardPortsMappingsCollectionFetched).toBeTruthy();
  });

  it('getCMPortsMapping: should call part3', () => {
    service.iscmBoardPortsMappingsCollectionRequested.set('123', true);
    service.iscmBoardPortsMappingsCollectionFetched.set('123', false);
    service.getCMPortsMapping('123');
    expect(service.iscmBoardPortsMappingsCollectionFetched).toBeTruthy();
  });

  it('getCMPortsMappingForDaikin: should call', () => {
    service.getCMPortsMappingForDaikin('123');
    expect(service.iscmBoardPortsMappingsForDaikinCollectionFetched).toBeTruthy();
  });

  it('getCMPortsMappingForDaikin: should call part2', () => {
    const data1 = [{
      rows: [
        { id: 1 }
      ]
    }];
    const spy1 = spyOn(siteService, 'getQuerybyEquipRef').and.returnValue(of(data1));
    service.iscmBoardPortsMappingsForDaikinCollectionFetched.set('123', true);
    service.getCMPortsMappingForDaikin('123');
    expect(service.iscmBoardPortsMappingsForDaikinCollectionFetched).toBeTruthy();
  });

  it('getFullyModulatingProfileTags: should call', () => {
    service.getFullyModulatingProfileTags('123','321');
    expect(service.isFullyModulatingProfileTagsFetched).toBeTruthy();
  });

  it('getFullyModulatingProfileTags: should call part2', () => {
    const data = [{
      rows: [
        { id: 1 }
      ]
    }];
    const spy = spyOn(siteService, 'getQuerybyEquipRef').and.returnValue(of(data));
    service.isFullyModulatingProfileTagsFetched.set('123', true);
    service.getFullyModulatingProfileTags('123','321');
    expect(service.isFullyModulatingProfileTagsFetched).toBeTruthy();
  });

  it('getFullyModulatingProfileTags: should call part3', () => {
    service.isFullyModulatingProfileTagsFetched.set('123', false);
    service.isFullyModulatingProfileTagsCollectionRequested.set('123', true);
    service.getFullyModulatingProfileTags('123','321');
    expect(service.isFullyModulatingProfileTagsFetched).toBeTruthy();
  });
});
