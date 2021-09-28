import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIntentRangesliderSchedulerComponent } from './user-intent-rangeslider-scheduler.component';
import { SliderUserIntentService } from '../../services/slider-user-intent.service';
import { ResizeSensor } from 'css-element-queries';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('UserIntentRangesliderSchedulerComponent', () => {
  let component: UserIntentRangesliderSchedulerComponent;
  let fixture: ComponentFixture<UserIntentRangesliderSchedulerComponent>;
  let testBedService: SliderUserIntentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserIntentRangesliderSchedulerComponent],
      providers: [
        {
          provide: ResizeSensor,
          useValue: {}
        },
        {
          provide: SliderUserIntentService,
          useValue: {
            getLatestUpdatedBy: () => of({ name: 'Product' }),
            getData: () => of({
              name: 'Product',
              tempSet: {
                currentTemp: '0.0',
                desiredTempHeating: '70',
                desiredTempCooling: '74',
                heatingUserLimitMin: '72',
                heatingUserLimitMax: '67',
                coolingUserLimitMin: '72',
                coolingUserLimitMax: '77',
                coolingDeadband: '2',
                heatingDeadband: '2',
              }
            }),
            isEquivalent: () => of({ a: 'b', b: 'b' })
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserIntentRangesliderSchedulerComponent);
    component = fixture.componentInstance;
    testBedService = TestBed.get(SliderUserIntentService);
    component.usertemperatureInputs = {
      currentTemp: '0.0',
      desiredTempHeating: '70',
      desiredTempCooling: '74',
      heatingUserLimitMin: '72',
      heatingUserLimitMax: '67',
      coolingUserLimitMin: '72',
      coolingUserLimitMax: '77',
      coolingDeadband: '2',
      heatingDeadband: '2',
    };
    component.sliderDisplay = true;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
