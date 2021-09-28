import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VacationsComponent } from './vacations.component';
import { Sort } from '@angular/material/sort';
import { Moment } from 'moment';
import * as moment_ from 'moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { VacationScheduleDetails } from '../../models/vacations.model';
import { HelperService } from '../../services/hs-helper.service';
import { SiteService } from '../../services/site.service';
import { VacationsService } from '../../services/vacations.service';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Router, RouterEvent } from '@angular/router';
import { ConfigurationService } from '../../services/configuration.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleChange } from '@angular/core';
describe('VacationsComponent', () => {
  let component: VacationsComponent;
  let fixture: ComponentFixture<VacationsComponent>;
  let siteService: MockSiteService;
  let helperService: MockHelperService;
  // const configService: MockConfigurationService;

  class MockSiteService extends SiteService {
    caretakerUrl = '';
  }

  class MockLocalStorage {

  }

  class MockHelperService extends HelperService { }

  class MockConfigurationService extends ConfigurationService {
    getConfig(something: any) {
      return 'http://dummyUrl';
    }
  }
  const eventSubject = new ReplaySubject<RouterEvent>(1);
  const routeMock = {
    navigate: jasmine.createSpy('navigate'),
    events: eventSubject.asObservable(),
    url: 'dummy'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VacationsComponent,
        ModalComponent,
      ],
      imports: [
        NgxDaterangepickerMd.forRoot(),
        MaterialModule,
        FormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: 'LOCALSTORAGE',
          useClass: MockLocalStorage
        },
        {
          provide: SiteService,
          useClass: MockSiteService
        },
        {
          provide: ConfigurationService,
          useClass: MockConfigurationService
        },
        {
          provide: HelperService,
          useClass: MockHelperService
        },
        {
          provide: Router,
          useValue: routeMock
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacationsComponent);
    siteService = TestBed.get(SiteService);
    helperService = TestBed.get(HelperService);
    component = fixture.componentInstance;
    component.vacationsData = [
      {
        vacId: '5f9bad2434952c2e5e064192',
        siteRef: '5f45076092c6006b83daba76',
        roomRef: '',
        name: 'sorrt',
        strtDate: moment_('2020-10-29T18:30:00.000Z'),
        endDate: moment_('2020-10-31T18:29:59.000Z'),
        isZoneVAc: false,
        isExpired: false,
        dispNameStDate: '30 Oct 20',
        dispNameEdDate: '31 Oct 20'
      },
      {
        vacId: '5f9bad2f34952c2e5e064193',
        siteRef: '5f45076092c6006b83daba76',
        roomRef: '',
        name: 'uping',
        strtDate: moment_('2020-10-31T18:30:00.000Z'),
        endDate: moment_('2020-11-01T18:29:59.000Z'),
        isZoneVAc: false,
        isExpired: false,
        dispNameStDate: '01 Nov 20',
        dispNameEdDate: '01 Nov 20'
      }
    ];
    component.siteTimeZone = 'Calcutta';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Sort vacationName ascending', () => {
    const sort: Sort = {
      active: 'vacationName',
      direction: 'asc',
    };
    component.sortData(sort);
    expect(component.vacationsData).toEqual(
      [
        Object({
          vacId: '5f9bad2434952c2e5e064192', siteRef: '5f45076092c6006b83daba76',
          roomRef: '', name: 'sorrt', strtDate: moment_('2020-10-29T18:30:00.000Z'),
          endDate: moment_('2020-10-31T18:29:59.000Z'), isZoneVAc: false, isExpired: false,
          dispNameStDate: '30 Oct 20', dispNameEdDate: '31 Oct 20'
        }),
        Object({
          vacId: '5f9bad2f34952c2e5e064193', siteRef: '5f45076092c6006b83daba76',
          roomRef: '', name: 'uping', strtDate: moment_('2020-10-31T18:30:00.000Z'),
          endDate: moment_('2020-11-01T18:29:59.000Z'), isZoneVAc: false, isExpired: false,
          dispNameStDate: '01 Nov 20', dispNameEdDate: '01 Nov 20'
        })
      ]
    );
  });

  it('Sort vacationName descending', () => {
    const sort: Sort = {
      active: 'vacationName',
      direction: 'desc',
    };
    component.sortData(sort);
    expect(component.vacationsData).toEqual(
      [
        Object({
          vacId: '5f9bad2f34952c2e5e064193', siteRef: '5f45076092c6006b83daba76',
          roomRef: '', name: 'uping', strtDate: moment_('2020-10-31T18:30:00.000Z'),
          endDate: moment_('2020-11-01T18:29:59.000Z'), isZoneVAc: false, isExpired: false,
          dispNameStDate: '01 Nov 20', dispNameEdDate: '01 Nov 20'
        }),
        Object({
          vacId: '5f9bad2434952c2e5e064192', siteRef: '5f45076092c6006b83daba76',
          roomRef: '', name: 'sorrt', strtDate: moment_('2020-10-29T18:30:00.000Z'),
          endDate: moment_('2020-10-31T18:29:59.000Z'), isZoneVAc: false, isExpired: false,
          dispNameStDate: '30 Oct 20', dispNameEdDate: '31 Oct 20'
        })
      ]
    );
  });

  it('Sort startDate ascending', () => {
    const sort: Sort = {
      active: 'startDate',
      direction: 'asc',
    };
    component.sortData(sort);
    expect(component.vacationsData).toEqual(
      [
        Object({
          vacId: '5f9bad2434952c2e5e064192', siteRef: '5f45076092c6006b83daba76',
          roomRef: '', name: 'sorrt', strtDate: moment_('2020-10-29T18:30:00.000Z'),
          endDate: moment_('2020-10-31T18:29:59.000Z'), isZoneVAc: false, isExpired: false,
          dispNameStDate: '30 Oct 20', dispNameEdDate: '31 Oct 20'
        }),
        Object({
          vacId: '5f9bad2f34952c2e5e064193', siteRef: '5f45076092c6006b83daba76',
          roomRef: '', name: 'uping', strtDate: moment_('2020-10-31T18:30:00.000Z'),
          endDate: moment_('2020-11-01T18:29:59.000Z'), isZoneVAc: false, isExpired: false,
          dispNameStDate: '01 Nov 20', dispNameEdDate: '01 Nov 20'
        })
      ]
    );
  });

  it('Sort startDate descending', () => {
    const sort: Sort = {
      active: 'startDate',
      direction: 'desc',
    };
    component.sortData(sort);
    expect(component.vacationsData).toEqual(
      [
        Object({
          vacId: '5f9bad2f34952c2e5e064193', siteRef: '5f45076092c6006b83daba76',
          roomRef: '', name: 'uping', strtDate: moment_('2020-10-31T18:30:00.000Z'),
          endDate: moment_('2020-11-01T18:29:59.000Z'), isZoneVAc: false, isExpired: false,
          dispNameStDate: '01 Nov 20', dispNameEdDate: '01 Nov 20'
        }),
        Object({
          vacId: '5f9bad2434952c2e5e064192', siteRef: '5f45076092c6006b83daba76',
          roomRef: '', name: 'sorrt', strtDate: moment_('2020-10-29T18:30:00.000Z'),
          endDate: moment_('2020-10-31T18:29:59.000Z'), isZoneVAc: false, isExpired: false,
          dispNameStDate: '30 Oct 20', dispNameEdDate: '31 Oct 20'
        })
      ]
    );
  });

  it('Sort endDate ascending', () => {
    const sort: Sort = {
      active: 'endDate',
      direction: 'asc',
    };
    component.sortData(sort);
    expect(component.vacationsData).toEqual(
      [
        Object({
          vacId: '5f9bad2434952c2e5e064192', siteRef: '5f45076092c6006b83daba76',
          roomRef: '', name: 'sorrt', strtDate: moment_('2020-10-29T18:30:00.000Z'),
          endDate: moment_('2020-10-31T18:29:59.000Z'), isZoneVAc: false, isExpired: false,
          dispNameStDate: '30 Oct 20', dispNameEdDate: '31 Oct 20'
        }),
        Object({
          vacId: '5f9bad2f34952c2e5e064193', siteRef: '5f45076092c6006b83daba76',
          roomRef: '', name: 'uping', strtDate: moment_('2020-10-31T18:30:00.000Z'),
          endDate: moment_('2020-11-01T18:29:59.000Z'), isZoneVAc: false, isExpired: false,
          dispNameStDate: '01 Nov 20', dispNameEdDate: '01 Nov 20'
        })
      ]
    );
  });

  it('Sort endDate descending', () => {
    const sort: Sort = {
      active: 'endDate',
      direction: 'desc',
    };
    component.sortData(sort);
    expect(component.vacationsData).toEqual(
      [
        Object({
          vacId: '5f9bad2f34952c2e5e064193', siteRef: '5f45076092c6006b83daba76',
          roomRef: '', name: 'uping', strtDate: moment_('2020-10-31T18:30:00.000Z'),
          endDate: moment_('2020-11-01T18:29:59.000Z'), isZoneVAc: false, isExpired: false,
          dispNameStDate: '01 Nov 20', dispNameEdDate: '01 Nov 20'
        }),
        Object({
          vacId: '5f9bad2434952c2e5e064192', siteRef: '5f45076092c6006b83daba76',
          roomRef: '', name: 'sorrt', strtDate: moment_('2020-10-29T18:30:00.000Z'),
          endDate: moment_('2020-10-31T18:29:59.000Z'), isZoneVAc: false, isExpired: false,
          dispNameStDate: '30 Oct 20', dispNameEdDate: '31 Oct 20'
        })
      ]
    );
  });

  it('Ngonchanges', () => {
    component.ngOnChanges({
      vacationsServerData: new SimpleChange(component.vacationsData, component.vacationsData, true)
    });
    expect(component).toBeTruthy();
  });

  it('closes modal :closevacationModal', () => {
    const ev = new Event('click');
    component.validationMessage = ['hello', 'test'];
    component.closevacationModal(ev);
    expect(component.validationMessage.length).toEqual(0);
  });


  it('Edit vacation : editVacationSchedule', () => {
    const vacDetails: VacationScheduleDetails = {
      vacId: '5f9bad2f34952c2e5e064193',
      siteRef: '5f45076092c6006b83daba76',
      roomRef: '',
      name: 'uping',
      strtDate: moment_('2020-10-31T18:30:00.000Z'),
      endDate: moment_('2020-11-01T18:29:59.000Z'),
      isZoneVAc: false,
      isExpired: false,
      dispNameStDate: '01 Nov 20',
      dispNameEdDate: '01 Nov 20'
    };
    component.editVacationSchedule(vacDetails);
    expect(component).toBeTruthy();
  });

  it('Edit vacation with no name: editVacationSchedule', () => {
    const vacDetails: VacationScheduleDetails = {
      vacId: '5f9bad2f34952c2e5e064193',
      siteRef: '5f45076092c6006b83daba76',
      roomRef: '',
      name: '',
      strtDate: moment_('2020-10-31T18:30:00.000Z'),
      endDate: moment_('2020-11-01T18:29:59.000Z'),
      isZoneVAc: false,
      isExpired: false,
      dispNameStDate: '01 Nov 20',
      dispNameEdDate: '01 Nov 20'
    };
    component.editVacationSchedule(vacDetails);
    expect(component.validationMessage).toEqual(['Please enter a vacation name.']);
  });

  it('Edit vacation with invalid start date: editVacationSchedule', () => {
    const vacDetails: VacationScheduleDetails = {
      vacId: '5f9bad2f34952c2e5e064193',
      siteRef: '5f45076092c6006b83daba76',
      roomRef: '',
      name: 'uping',
      strtDate: moment_('2020-11-01T18:29:59.000Z'),
      endDate: moment_('2020-11-01T18:29:59.000Z'),
      isZoneVAc: false,
      isExpired: false,
      dispNameStDate: '01 Nov 20',
      dispNameEdDate: '01 Nov 20'
    };
    component.editVacationSchedule(vacDetails);
    expect(component.validationMessage).toEqual(['Invalid Start Date.']);
  });

  it('Edit vacation with invalid end date: editVacationSchedule', () => {
    const vacDetails: VacationScheduleDetails = {
      vacId: '5f9bad2f34952c2e5e064193',
      siteRef: '5f45076092c6006b83daba76',
      roomRef: '',
      name: 'uping',
      strtDate: moment_('2020-11-01T18:29:59.000Z'),
      endDate: moment_('2020-11-01T18:29:59.000Z'),
      isZoneVAc: false,
      isExpired: false,
      dispNameStDate: '01 Nov 20',
      dispNameEdDate: '01 Nov 20'
    };
    component.editVacationSchedule(vacDetails);
  
    expect(component.validationMessage).toEqual(['Invalid End Date.']);
  });

  it('save vacation : handleSave', () => {
   
    expect(component.validationMessage).toEqual(['Please enter a vacation name.']);
  });

  it('Delete vacation : deleteVacationSchedule', () => {
    const vacDetails: VacationScheduleDetails = {
      vacId: '5f9bad2f34952c2e5e064193',
      siteRef: '5f45076092c6006b83daba76',
      roomRef: '',
      name: 'uping',
      strtDate: moment_('2020-10-31T18:30:00.000Z'),
      endDate: moment_('2020-11-01T18:29:59.000Z'),
      isZoneVAc: false,
      isExpired: false,
      dispNameStDate: '01 Nov 20',
      dispNameEdDate: '01 Nov 20'
    };
    component.deleteVacationSchedule(vacDetails);
    expect(component.vacationScheduleDetails).toEqual(vacDetails);
  });

  it('Delete handle : handleDelete', () => {
    component.handleDelete({vacId:'123'});
    expect(component).toBeTruthy();
  });

  it('Delete handle : valueChange', () => {
    const ev = new Event('click');
    component.vacationScheduleDetails.name = 'test';
    component.validationMessage = ['test'];
    expect(component.validationMessage.length).toBe(0);
  });

});
