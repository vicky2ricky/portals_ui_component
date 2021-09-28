import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { OverridePriorityComponent } from './override-priority.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { SiteService } from '../../services/site.service';
import { HelperService } from '../../services/hs-helper.service';
import { FormsModule } from '@angular/forms';
import { ConfigurationService } from '../../services/configuration.service';
import { Router, RouterEvent } from '@angular/router';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

export class MdDialogMock {
  // When the component calls this.dialog.open(...) we'll return an object
  // with an afterClosed method that allows to subscribe to the dialog result observable.
  open() {
    return {
      afterClosed: () => of([0])
    };
  }
}
const data = [
  { markers: ['dab'], name: 'dabTest1', _id: 'dab1' },
  { markers: ['vav'], name: 'vavTest1', _id: 'vav1' },
  { markers: ['vav'], name: 'vavTest2', _id: 'vav2' },
  { markers: ['ti'], name: 'timeTest2', _id: 'time1' }
];
describe('OverridePriorityComponent', () => {
  let component: OverridePriorityComponent;
  let fixture: ComponentFixture<OverridePriorityComponent>;
  let helperService: HelperService;
  let siteService: SiteService;
  let store = {};

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MaterialModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [OverridePriorityComponent],
      providers: [
        {
          provide: MatDialog, useClass: MdDialogMock,
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
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
      ]

    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [OverridePriorityComponent]
      }
    });
    TestBed.compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(OverridePriorityComponent);
    component = fixture.componentInstance;
    siteService = fixture.debugElement.injector.get(SiteService);
    helperService = fixture.debugElement.injector.get(HelperService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('get pointer values', () => {

    component.priorityDetails = {};
    const res = {
      meta: { ver: '2.0' },
      cols: [
        { name: 'duration' },
        { name: 'val' },
        { name: 'level' },
        { name: 'who' }
      ],
      rows: [
        {
          duration: 'n:0.0', id: 'dab1', dis: 'sha', val: 'n:0.0', level: 'n:8', who: 'ccu',
          data: [{ level: '17', val: '2' }, { level: '8', val: '3' }, { level: '10', val: '4' },
          { level: '14', val: '5' }
          ]
        },
      ]
    };

    const spy = spyOn(siteService, 'getBulkWritablePointData').and.callFake(() => {
      return of(res);
    });

    component.getData(data);
    expect(spy).toHaveBeenCalled();
    //  tick();
    fixture.detectChanges();
    expect(component.priorityDetails.defaultVal).toBe('2');
    expect(component.zoneTuners.length).toBe(0);
    expect(component.moduleTuners.length).toBe(0);
    expect(component.systemTuners.length).toBe(0);
  });

  it('generate option values without min,max and increment', () => {
    component.priorityDetails = {};
    component.generateOptions();
    expect(component.options.length).toBe(0);
  });

  it('generate option values with min,max and increment', () => {
    component.priorityDetails = {
      min: 0,
      max: 10,
      increment: 2
    };
    component.generateOptions();
    expect(component.options.length).toBe(0);
  });

  it('click on building sub group', () => {
    component.buildingTuners = [{ _id: '1' }];
    component.priorityDetails = {
      min: 0,
      max: 10,
      increment: 2,
      name: 'dummy'
    };
    component.type = 'building';
    component.changeChildTuner();
    expect(component.tunerChildValues.length).toBe(0);
  });

  it('click on system sub group', () => {
    component.systemTuners = [{ _id: '1' }, { _id: 2 }];
    component.priorityDetails = {
      min: 0,
      max: 10,
      increment: 2,
      name: 'dummy'
    };
    component.type = 'system';
    component.changeChildTuner();
    expect(component.tunerChildValues.length).toBe(0);
  });

  it('click on zone sub group', () => {
    component.zoneTuners = [{ _id: '1' }];
    component.priorityDetails = {
      min: 0,
      max: 10,
      increment: 2,
      name: 'dummy'
    };
    component.type = 'zone';
    component.changeChildTuner();
    expect(component.tunerChildValues.length).toBe(0);
  });

  it('click on module group', () => {
    component.zoneTuners = [{ _id: '1' }];
    component.priorityDetails = {
      min: 0,
      max: 10,
      increment: 2,
      name: 'dummy'
    };
    component.type = 'module';
    component.changeChildTuner();
    expect(component.tunerChildValues.length).toBe(0);
  });

});
