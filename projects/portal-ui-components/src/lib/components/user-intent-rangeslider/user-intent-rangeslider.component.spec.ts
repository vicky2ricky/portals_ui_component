import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { UserIntentRangesliderComponent } from './user-intent-rangeslider.component';
import { SliderUserIntentService } from '../../services/slider-user-intent.service';
import { ResizeSensor } from 'css-element-queries';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('UserIntentRangesliderComponent', () => {
  let component: UserIntentRangesliderComponent;
  let fixture: ComponentFixture<UserIntentRangesliderComponent>;
  let testBedService: SliderUserIntentService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserIntentRangesliderComponent],
      imports: [],
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
                currentTemp: '0',
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
    fixture = TestBed.createComponent(UserIntentRangesliderComponent);
    component = fixture.componentInstance;
    testBedService = TestBed.get(SliderUserIntentService);
    component.usertemperatureInputs = {
      currentTemp: '0',
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call ngOnInit if slider is true', () => {
    spyOn(testBedService, 'getLatestUpdatedBy')
      .and
      .callThrough();
    component.sliderDisplay = true;
    component.usertemperatureInputs = {
      currentTemp: '0',
      desiredTempHeating: '70',
      desiredTempCooling: '74',
      heatingUserLimitMin: '72',
      heatingUserLimitMax: '67',
      coolingUserLimitMin: '72',
      coolingUserLimitMax: '77',
      coolingDeadband: '2',
      heatingDeadband: '2',
    };
    fixture.detectChanges();
    component.ngOnInit();
    expect(testBedService.getLatestUpdatedBy).toHaveBeenCalled();
  });

  it('call debounced', () => {
    component.debounced(100, component.refreshSliderOnResolutionChange());
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('call debounced', () => {
    component.sliderDisplay = false;
    component.createSlider();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('call mouse down', fakeAsync(() => {
    const evt = { target: { id: 'heatingdesiredtempbutton' }, clientX: 0, preventDefault() { } };
    const selectCool = fixture.debugElement.query(By.css('#coolingdesiredtemplabel')).nativeElement;
    selectCool.hidden = true;
    component.MouseDown(evt);
    fixture.detectChanges();
  })
  );

  it('call mouse down', fakeAsync(() => {
    const evt = { target: { id: 'coolingdesiredtempbutton' }, clientX: 0, preventDefault() { } };
    const selectHeat = fixture.debugElement.query(By.css('#heatingdesiredtemplabel')).nativeElement;
    selectHeat.hidden = true;
    component.MouseDown(evt);
    fixture.detectChanges();
  })
  );

});
