import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { HelperService } from '../../services/hs-helper.service';
import { ZoneSettingsService } from '../../services/zone-settings.service';
import { PucComponentsModule } from '../components.module';

import { ProfilesComponent } from './profiles.component';

describe('ProfilesComponent', () => {
  let component: ProfilesComponent;
  let fixture: ComponentFixture<ProfilesComponent>;

  class MockHelperService extends HelperService { }

  const MockSpyZoneSetting = {
    subject: new Subject()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PucComponentsModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [],
      providers: [
        {
          provide: HelperService,
          useClass: MockHelperService
        },
        {
          provide: ZoneSettingsService,
          useValue: MockSpyZoneSetting
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesComponent);
    component = fixture.componentInstance;
    component.profileName = '9700-pi';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('ngOnInit: with Pi loop', () => {
    component.piLoopData = {
      inputUnit: 'v',
      outputUnit: 'v',
      input: '5',
      target: ''
    };
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('select : all profiles except PI and EMR', () => {
    component.profileShortName = 'vav';
    component.select();
    expect(component.displayProfile).toEqual(component.profileWidget[0]);
  });

  it('select : PI profile', fakeAsync(() => {
    component.profileShortName = 'pid';
    component.select();
    MockSpyZoneSetting.subject.next({
        inputValue: '5',
        dynamicValue: '5'
      });
    tick();
    expect(component).toBeTruthy();
  })
  );

  it('select : EMR profile', () => {
    component.profileShortName = 'emr';
    component.select();
    expect(component.displayProfile).toEqual(component.profileWidget[2]);
  });
});
