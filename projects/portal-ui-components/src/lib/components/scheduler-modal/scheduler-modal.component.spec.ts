import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PucComponentsModule } from '../components.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SchedulerModalComponent } from './scheduler-modal.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigurationService } from '../../services/configuration.service';
import { of } from 'rxjs';

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
class MockConfigurationService extends ConfigurationService {
  getConfig(something: any) {
    return 'http://dummyUrl';
  }
}


describe('SchedulerModalComponent', () => {
  let component: SchedulerModalComponent;
  let fixture: ComponentFixture<SchedulerModalComponent>;
  let httpTestingController: HttpTestingController;
  let configService: MockConfigurationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [PucComponentsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: 'LOCALSTORAGE',
          useClass: MockLocalStorage
        },
        {
          provide: ConfigurationService,
          useClass: MockConfigurationService
        },
      ]
    })
      .compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(ConfigurationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerModalComponent);
    component = fixture.componentInstance;
    component.buildingLimits = {
      min: '10',
      max: '70'
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
