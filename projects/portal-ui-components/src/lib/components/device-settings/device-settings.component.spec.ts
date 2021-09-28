import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeviceSettingsComponent } from './device-settings.component';
import { SimpleChange } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { PucComponentsModule } from '../components.module';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
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
const configServiceSpy = {
  getConfig: jasmine.createSpy('getConfig').and.returnValue({})
};
describe('Component:DeviceSettingsComponent', () => {
  let component: DeviceSettingsComponent;
  let fixture: ComponentFixture<DeviceSettingsComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PucComponentsModule, HttpClientTestingModule, RouterTestingModule,
        BrowserAnimationsModule],
      declarations: [],
      providers: [
        {
          provide: 'LOCALSTORAGE',
          useClass: MockLocalStorage
        },
        {
          provide: ConfigurationService,
          useValue: configServiceSpy
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSettingsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('generateTargetDehumidityVals: generating target humidity, dehumidity values', () => {
    component.generateTargetDehumidityVals();
    expect(component.options.targetHumidity.default.length).toEqual(100);
    expect(component.options.targetHumidity.default[99].name).toEqual(100);
    expect(component.options.targetHumidity.default[99].value).toEqual('100');
  });

  it('isDataLoaded: replace on and add html', () => {
    const res = component.isDataLoaded('On');
    expect(res).toBe('<span>on</span>');
  });

  it('isDataLoaded: replace other than on/off and add html', () => {
    const res = component.isDataLoaded('dummy');
    expect(res).toBe('dummy');
  });

  it('revertValues: should revert selected values', () => {
    component.settings = { fanMode: { val: '1', id: '1' } };
    const data = [{
      mode: 'fanMode',
      val: '2'
    }];
    component.supportedtags = ['fanMode'];
    component.tags = { profileType: 'vav' };
    spyOn(component, 'isDataLoaded').and.returnValue(true);
    component.revertValues(data);
    fixture.detectChanges();
    const select = fixture.debugElement.nativeElement.querySelector('select');
    expect(select.value).toBe('1');
  });

  it('revertValues: should not revert any value for no selct boxes', () => {
    component.settings = { fanMode: { val: '1', id: '1' } };
    const data = [{
      mode: 'fanMode',
      val: '2'
    }];
    component.supportedtags = [];
    component.tags = { profileType: 'vav' };
    spyOn(component, 'isDataLoaded').and.returnValue(true);
    component.revertValues(data);
    fixture.detectChanges();
    const select = fixture.debugElement.nativeElement.querySelector('select');
    expect(select).toBeNull();
  });

  it('onModeChange: emit values when mode change', () => {
    spyOn(component.modeChange, 'emit');
    component.onModeChange({ type: 'text', value: '10' });
    expect(component.modeChange.emit).toHaveBeenCalledWith({ mode: 'text', value: '10' });
  });

  it('onModeChange: should emit object with out values', () => {
    spyOn(component.modeChange, 'emit');
    component.onModeChange({});
    expect(component.modeChange.emit).toHaveBeenCalledWith({ mode: '', value: '' });
  });

  it('ngOnChanges: should change settings details', () => {
    component.settings = { fanMode: { val: '1', id: '1' } };
    component.tags = { profileType: 'cpu' };
    // directly call ngOnChanges
    component.ngOnChanges({
      settings: new SimpleChange(null, { tagetHumidity: { val: '1', id: '1' } }, false),
      // tags: new SimpleChange({ profileType: 'vav' }, { profileType: 'vav' }, false)
    });
    fixture.detectChanges();
    expect(component.settings['tagetHumidity']['val']).toEqual('1');
    expect(component.settings['tagetHumidity']['id']).toEqual('1');
  });

  it('ngOnChanges: Should change fan default values for cpu or hpu profiles', () => {
    component.tags = { profileType: 'cpu' };
    // directly call ngOnChanges
    component.supportedtags = ['targetDehumidity'];

    component.ngOnChanges({
      tags: new SimpleChange(null, { profileType: 'cpu', tags: { fanMode: {}, targetDehumidity: {} } }, false)
    });
    fixture.detectChanges();
    expect(component.options.fanMode.default.length).toEqual(5);
  });

  it('ngOnChanges: Should change fan default values for cpu or hpu profiles', () => {
    component.tags = { profileType: 'hpu' };
    // directly call ngOnChanges
    component.supportedtags = ['fanMode'];
    component.ngOnChanges({
      tags: new SimpleChange(null, { profileType: 'hpu', tags: { fanMode: {} } }, false)
    });
    fixture.detectChanges();
    expect(component.options.fanMode.default.length).toEqual(8);
  });

});
