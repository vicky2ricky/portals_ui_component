import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterEvent } from '@angular/router';
import { of, ReplaySubject } from 'rxjs';
import { ConfigurationService } from './configuration.service';

import { DeviceHelperService } from './device-helper.service';
import { HelperService } from './hs-helper.service';
import { RuntimeGraphService } from './runtime-graph.service';
import { SiteService } from './site.service';

class MockHelperService extends HelperService {
}

class MockRuntimeGraphService extends RuntimeGraphService {
}

class MockConfigurationService extends ConfigurationService {
  getConfig(something: any) {
    return 'http://dummyUrl';
  }
}

class MockSiteService extends SiteService {
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

class MatDialogMock {
  // When the component calls this.dialog.open(...) we'll return an object
  // with an afterClosed method that allows to subscribe to the dialog result observable.
  open() {
    return {
      afterClosed: () => of({ action: true })
    };
  }
}

describe('DeviceHelperService', () => {
  let service: DeviceHelperService;
  let siteService: MockSiteService;
  let helperService: MockHelperService;
  let httpTestingController: HttpTestingController;
  let runtimeGraphService: MockRuntimeGraphService;

  const data = [{
    _id: '5f62f8a4b271c312317386c8',
    name: 'Zone1',
    markers: [
      'dis',
      'migrated',
      'siteRef',
      'floorRef',
      'scheduleRef',
      'room'
    ],
    type: 'room',
    referenceIDs: {
      site: '5f62f78cb271c31231738581',
      floor: '5f62f881b271c312317386ba',
      schedule: '5f62f8c3b271c312317386e5'
    },
    enum: '',
    minVal: '',
    maxVal: '',
    incrementVal: '',
    tunerGroup: '',
    entities: [
      {
        _id: '5f62f8c3b271c312317386e5',
        name: 'Zone Schedule',
        markers: [
          'dis',
          'migrated',
          'siteRef',
          'roomRef',
          'kind',
          'cooling',
          'zone',
          'temp',
          'heating',
          'schedule',
          'days',
          'disabled'
        ],
        type: 'schedule',
        referenceIDs: {
          site: '5f62f78cb271c31231738581',
          room: '5f62f8a4b271c312317386c8'
        },
        enum: '',
        otherProperties: [
          {
            ethh: 'n:17',
            sthh: 'n:8',
            coolVal: 'n:74',
            day: 'n:0.0',
            etmm: 'n:30',
            stmm: 'n:0.0',
            heatVal: 'n:70'
          },
          {
            ethh: 'n:17',
            sthh: 'n:8',
            coolVal: 'n:74',
            day: 'n:1.0',
            etmm: 'n:30',
            stmm: 'n:0.0',
            heatVal: 'n:70'
          },
          {
            ethh: 'n:17',
            sthh: 'n:8',
            coolVal: 'n:74',
            day: 'n:2',
            etmm: 'n:30',
            stmm: 'n:0.0',
            heatVal: 'n:70'
          },
          {
            ethh: 'n:17',
            sthh: 'n:8',
            coolVal: 'n:74',
            day: 'n:3',
            etmm: 'n:30',
            stmm: 'n:0.0',
            heatVal: 'n:70'
          },
          {
            ethh: 'n:17',
            sthh: 'n:8',
            coolVal: 'n:74',
            day: 'n:4',
            etmm: 'n:30',
            stmm: 'n:0.0',
            heatVal: 'n:70'
          }
        ],
        minVal: '',
        maxVal: '',
        incrementVal: '',
        tunerGroup: '',
        entities: []
      },
      {
        _id: '5f62f8a6b271c312317386c9',
        name: 'Vamsi_vkc_dev_11_09-PID-1600',
        markers: [
          'dis',
          'gatewayRef',
          'migrated',
          'siteRef',
          'tz',
          'roomRef',
          'profile',
          'floorRef',
          'equip',
          'zone',
          'pid',
          'group'
        ],
        type: 'equip',
        referenceIDs: {
          gateway: '5f62f855b271c31231738583',
          site: '5f62f78cb271c31231738581',
          room: '5f62f8a4b271c312317386c8',
          floor: '5f62f881b271c312317386ba'
        },
        enum: '',
        minVal: '',
        maxVal: '',
        incrementVal: '',
        tunerGroup: '',
        entities: [
          {
            _id: '5f62f8a8b271c312317386ca',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-analog1AtMaxOutput',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'his',
              'point',
              'writable',
              'kind',
              'hisInterpolate',
              'pointArray',
              'zone',
              'pid',
              'max',
              'output',
              'config',
              'analog1',
              'group'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            enum: '',
            minVal: '',
            maxVal: '',
            incrementVal: '',
            tunerGroup: '',
            entities: []
          },
          {
            _id: '5f62f8a8b271c312317386cb',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-analog2InputSensor',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'point',
              'writable',
              'kind',
              'pointArray',
              'zone',
              'pid',
              'config',
              'analog2',
              'group',
              'input',
              'sensor'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            enum: '',
            minVal: '',
            maxVal: '',
            incrementVal: '',
            tunerGroup: '',
            entities: []
          },
          {
            _id: '5f62f8a8b271c312317386cc',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-processVariable- Generic 0-10 V',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'his',
              'point',
              'maxVal',
              'minVal',
              'kind',
              'unit',
              'hisInterpolate',
              'sp',
              'zone',
              'pid',
              'cur',
              'group',
              'process',
              'shortDis',
              'logical',
              'variable'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            unit: 'V',
            enum: '',
            dispName: 'Generic 0-10 Voltage',
            minVal: '0.0',
            maxVal: '10',
            incrementVal: '',
            tunerGroup: '',
            entities: []
          },
          {
            _id: '5f62f8a8b271c312317386cd',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-pidProportionalRange',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'point',
              'writable',
              'incrementVal',
              'maxVal',
              'minVal',
              'kind',
              'pointArray',
              'zone',
              'pid',
              'config',
              'group',
              'shortDis',
              'prange'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            enum: '',
            dispName: 'PID Proportional Range',
            minVal: '0.0',
            maxVal: '10',
            incrementVal: '0.1',
            tunerGroup: '',
            entities: []
          },
          {
            _id: '5f62f8a8b271c312317386ce',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-scheduleType',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'his',
              'point',
              'writable',
              'kind',
              'hisInterpolate',
              'pointArray',
              'zone',
              'pid',
              'enum',
              'group',
              'scheduleType'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            enum: 'building,zone,named',
            minVal: '',
            maxVal: '',
            incrementVal: '',
            tunerGroup: '',
            entities: []
          },
          {
            _id: '5f62f8a8b271c312317386cf',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-equipStatusMessage',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'point',
              'writable',
              'kind',
              'hisInterpolate',
              'pointArray',
              'zone',
              'pid',
              'status',
              'message',
              'group',
              'logical'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            enum: '',
            minVal: '',
            maxVal: '',
            incrementVal: '',
            tunerGroup: '',
            entities: []
          },
          {
            _id: '5f62f8a8b271c312317386d0',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-pidIntegralTime',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'his',
              'tuner',
              'point',
              'writable',
              'incrementVal',
              'maxVal',
              'minVal',
              'kind',
              'tunerGroup',
              'unit',
              'hisInterpolate',
              'pointArray',
              'sp',
              'pid',
              'itimeout'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            unit: 'm',
            enum: '',
            minVal: '0.1',
            maxVal: '1.0',
            incrementVal: '0.1',
            tunerGroup: 'GENERIC',
            entities: [],
            zoneName: 'Zone1',
            moduleName: 'PID-1600'
          },
          {
            _id: '5f62f8a8b271c312317386d1',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-expectZeroErrorAtMidpoint',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'point',
              'writable',
              'kind',
              'pointArray',
              'zone',
              'pid',
              'enabled',
              'enum',
              'config',
              'group',
              'error',
              'zero',
              'midpoint'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            enum: 'false,true',
            minVal: '',
            maxVal: '',
            incrementVal: '',
            tunerGroup: '',
            entities: []
          },
          {
            _id: '5f62f8a8b271c312317386d2',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-controlVariable',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'his',
              'point',
              'kind',
              'unit',
              'hisInterpolate',
              'sp',
              'zone',
              'pid',
              'group',
              'logical',
              'variable',
              'control'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            unit: '%',
            enum: '',
            minVal: '',
            maxVal: '',
            incrementVal: '',
            tunerGroup: '',
            entities: []
          },
          {
            _id: '5f62f8a8b271c312317386d3',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-th1InputSensor',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'point',
              'writable',
              'kind',
              'pointArray',
              'zone',
              'pid',
              'config',
              'group',
              'input',
              'sensor',
              'th1'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            enum: '',
            minVal: '',
            maxVal: '',
            incrementVal: '',
            tunerGroup: '',
            entities: []
          },
          {
            _id: '5f62f8a8b271c312317386d4',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-analog1InputSensor',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'point',
              'writable',
              'kind',
              'pointArray',
              'zone',
              'pid',
              'config',
              'analog1',
              'group',
              'input',
              'sensor',
              'shortDis'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            enum: '',
            dispName: 'Analog1 Input Config',
            minVal: '',
            maxVal: '',
            incrementVal: '',
            tunerGroup: '',
            entities: []
          },
          {
            _id: '5f62f8a8b271c312317386d5',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-proportionalKFactor',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'his',
              'tuner',
              'point',
              'writable',
              'incrementVal',
              'maxVal',
              'minVal',
              'kind',
              'tunerGroup',
              'hisInterpolate',
              'pointArray',
              'sp',
              'pid',
              'pgain'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            enum: '',
            minVal: '0.1',
            maxVal: '1.0',
            incrementVal: '0.1',
            tunerGroup: 'GENERIC',
            entities: [],
            zoneName: 'Zone1',
            moduleName: 'PID-1600'
          },
          {
            _id: '5f62f8a8b271c312317386d6',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-useAnalogIn2ForSetpoint',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'point',
              'writable',
              'kind',
              'pointArray',
              'zone',
              'pid',
              'enabled',
              'enum',
              'config',
              'analog2',
              'group',
              'setpoint'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            enum: 'false,true',
            minVal: '',
            maxVal: '',
            incrementVal: '',
            tunerGroup: '',
            entities: []
          },
          {
            _id: '5f62f8a8b271c312317386d7',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-integralKFactor',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'his',
              'tuner',
              'point',
              'writable',
              'incrementVal',
              'maxVal',
              'minVal',
              'kind',
              'tunerGroup',
              'hisInterpolate',
              'pointArray',
              'sp',
              'pid',
              'igain'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            enum: '',
            minVal: '0.1',
            maxVal: '1.0',
            incrementVal: '0.1',
            tunerGroup: 'GENERIC',
            entities: [],
            zoneName: 'Zone1',
            moduleName: 'PID-1600'
          },
          {
            _id: '5f62f8a8b271c312317386d8',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-analog1AtMinOutput',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'his',
              'point',
              'writable',
              'kind',
              'hisInterpolate',
              'pointArray',
              'zone',
              'pid',
              'min',
              'output',
              'config',
              'analog1',
              'group'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            enum: '',
            minVal: '',
            maxVal: '',
            incrementVal: '',
            tunerGroup: '',
            entities: []
          },
          {
            _id: '5f62f8a8b271c312317386d9',
            name: 'Vamsi_vkc_dev_11_09-PID-1600-pidTargetValue',
            markers: [
              'dis',
              'equipRef',
              'migrated',
              'siteRef',
              'tz',
              'roomRef',
              'floorRef',
              'his',
              'point',
              'writable',
              'incrementVal',
              'maxVal',
              'minVal',
              'kind',
              'unit',
              'hisInterpolate',
              'pointArray',
              'zone',
              'pid',
              'target',
              'config',
              'group',
              'shortDis',
              'value'
            ],
            type: 'point',
            referenceIDs: {
              equip: '5f62f8a6b271c312317386c9',
              site: '5f62f78cb271c31231738581',
              room: '5f62f8a4b271c312317386c8',
              floor: '5f62f881b271c312317386ba'
            },
            unit: 'V',
            enum: '',
            dispName: 'Target Voltage',
            minVal: '0.0',
            maxVal: '10',
            incrementVal: '0.1',
            tunerGroup: '',
            entities: []
          }
        ]
      }
    ]
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DeviceHelperService,
        {
          provide: 'LOCALSTORAGE',
          useClass: MockLocalStorage
        },
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
          provide: ConfigurationService,
          useClass: MockConfigurationService
        },
        {
          provide: MatDialog,
          useClass: MatDialogMock
        },
        {
          provide: RuntimeGraphService,
          useClass: MockRuntimeGraphService,
          useValue: { fullyModulatingProfileTagsSubject: of({ something: '' }) }
        }
      ]
    });

    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(DeviceHelperService);
    siteService = TestBed.inject(SiteService);
    helperService = TestBed.inject(HelperService);
    runtimeGraphService = TestBed.inject(RuntimeGraphService);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getZoneProfile: should return zone profile', () => {
    const res = service.getZoneProfile(data);
    expect(res).toBeTruthy();
  });

  it('getDeviceWidgets: should return widgets for vav', () => {
    const res = service.getDeviceWidgets('vav', '@123', '@456', true);
    expect(res.length).toBeGreaterThan(0);
  });

  it('getDeviceWidgets: should return widgets for vav part 2', () => {
    const res = service.getDeviceWidgets('vav', '@123', '@456', true);
    expect(res.length).toBeGreaterThan(0);
  });

  it('getDeviceWidgets: should return widgets for dab', () => {
    const res = service.getDeviceWidgets('dab', '@123', '@456', true);
    expect(res.length).toBeGreaterThan(0);
  });

  it('getDeviceWidgets: should return widgets for cpu', () => {
    const res = service.getDeviceWidgets('cpu', '@123', '@456', true, '', '', '1');
    expect(res.length).toBeGreaterThan(0);
  });

  it('getDeviceWidgets: should return widgets for hpu', () => {
    const res = service.getDeviceWidgets('hpu', '@123', '@456', true, '1', '1');
    expect(res.length).toBeGreaterThan(0);
  });

  it('getDeviceWidgets: should return widgets for hpu part2', () => {
    const res = service.getDeviceWidgets('hpu', '@123', '@456', false, '1', '1');
    expect(res.length).toBeGreaterThan(0);
  });

  it('getDeviceWidgets: should return widgets for pipe2', () => {
    const res = service.getDeviceWidgets('pipe2', '@123', '@456', true);
    expect(res.length).toBeGreaterThan(0);
  });

  it('getDeviceWidgets: should return widgets for pipe4', () => {
    const res = service.getDeviceWidgets('pipe4', '@123', '@456', true);
    expect(res.length).toBeGreaterThan(0);
  });

  it('getDeviceWidgets: should return widgets for emr', () => {
    const res = service.getDeviceWidgets('emr', '@123', '@456', true);
    expect(res.length).toBeGreaterThan(0);
  });

  it('getDeviceWidgets: should return widgets for sse', () => {
    const res = service.getDeviceWidgets('sse', '@123', '@456', true);
    expect(res.length).toBeGreaterThan(0);
  });

  it('getDeviceWidgets: should return widgets for ti', () => {
    const res = service.getDeviceWidgets('ti', '@123', '@456', true);
    expect(res.length).toBeGreaterThan(0);
  });

  it('getDeviceWidgets: should return widgets for pid', () => {
    const res = service.getDeviceWidgets('pid', '@123', '@456', true, '', '', '', '', { dynamicTarget: '', target: '', input: '' });
    expect(res.length).toBeGreaterThan(0);
  });

  it('getDeviceWidgets: should return widgets for dualDuct', () => {
    const res = service.getDeviceWidgets('dualDuct', '@123', '@456', true);
    expect(res.length).toBeGreaterThan(0);
  });

  it('getSystemWidgets: should return system widgets', () => {
    const res = service.getSystemWidgets('@123', { ccuAhu: '@456', ccuOAOCheck: true },false,false);
    expect(res.length).toBeGreaterThan(0);
  });

  it('getSystemWidgets: should return system widgets', () => {
    const res = service.getSystemWidgets('@123', { ccuAhu: '@456', ccuOAOCheck: false },false,false);
    expect(res.length).toBeGreaterThan(0);
  });

  it('getSystemProfileRuntimeWidgetData: should return profile', () => {
    const sub = service.systemRuntimeSubject.subscribe(res => {
      expect(res).toBeTruthy();
      sub.unsubscribe();
    });
    service.getSystemProfileRuntimeWidgetData('SYSTEM_DEFAULT', '123', '456',false,'profile');
  });

  it('getSystemProfileRuntimeWidgetData: should return profile SYSTEM_VAV_ANALOG_RTU', () => {
    const sub = service.systemRuntimeSubject.subscribe(res => {
      expect(res).toBeTruthy();
      sub.unsubscribe();
    });
    service.getSystemProfileRuntimeWidgetData('SYSTEM_VAV_ANALOG_RTU', '123', '456',false,'profile');
  });

  it('getSystemProfileRuntimeWidgetData: should return profile SYSTEM_VAV_STAGED_RTU', () => {
    const sub = service.systemRuntimeSubject.subscribe(res => {
      expect(res).toBeTruthy();
      sub.unsubscribe();
    });
    service.getSystemProfileRuntimeWidgetData('SYSTEM_VAV_STAGED_RTU', '123', '456',false,'profile');
  });

  it('getSystemProfileRuntimeWidgetData: should return profile SYSTEM_VAV_STAGED_VFD_RTU', () => {
    const sub = service.systemRuntimeSubject.subscribe(res => {
      expect(res).toBeTruthy();
      sub.unsubscribe();
    });
    service.getSystemProfileRuntimeWidgetData('SYSTEM_VAV_STAGED_VFD_RTU', '123', '456',false,'profile');
  });

  it('getSystemProfileRuntimeWidgetData: should return profile SYSTEM_VAV_HYBRID_RTU', () => {
    const sub = service.systemRuntimeSubject.subscribe(res => {
      expect(res).toBeTruthy();
      sub.unsubscribe();
    });
    service.getSystemProfileRuntimeWidgetData('SYSTEM_VAV_HYBRID_RTU', '123', '456',false,'profile');
  });

  it('getSystemProfileRuntimeWidgetData: should return profile SYSTEM_VAV_IE_RTU', () => {
    const sub = service.systemRuntimeSubject.subscribe(res => {
      expect(res).toBeTruthy();
      sub.unsubscribe();
    });
    service.getSystemProfileRuntimeWidgetData('SYSTEM_VAV_IE_RTU', '123', '456',false,'profile');
  });
});
