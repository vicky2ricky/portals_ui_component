import { TestBed } from '@angular/core/testing';
import { PucSliderInputOutputData } from '../models/user-intnet/puc-slider-input-output-data.model';
import { PucUserLimitDataSources } from '../models/user-intnet/puc-user-limit-data-sources.enum';

import { SliderUserIntentService } from './slider-user-intent.service';

describe('SliderUserIntentService', () => {
  let service: SliderUserIntentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SliderUserIntentService]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(SliderUserIntentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setData: should set values', () => {
    const data: PucSliderInputOutputData = {
      desiredTempHeating: '10',
      desiredTempCooling: '20',
      currentTemp: '40',
      heatingUserLimitMin: '30',
      heatingUserLimitMax: '20',
      coolingUserLimitMin: '10',
      coolingUserLimitMax: '30',
      coolingDeadband: '10',
      heatingDeadband: '20'
    };
    service.setData(data, {}, 'hello');

    expect(service.readMockData().length).toBeGreaterThan(0);
  });

  it('setData: should set values part2', () => {
    const data: PucSliderInputOutputData = {
      desiredTempHeating: '',
      desiredTempCooling: '',
      currentTemp: '40',
      heatingUserLimitMin: '30',
      heatingUserLimitMax: '20',
      coolingUserLimitMin: '10',
      coolingUserLimitMax: '30',
      coolingDeadband: '10',
      heatingDeadband: '20'
    };
    service.setData(data, {}, 'hello');

    expect(service.readMockData().length).toEqual(0);
  });

  it('isEquivalent: should return false', () => {
    const data1 = {
      hello: 'world',
      hi: '10'
    };

    const data2 = {
      hello: 'world'
    };

    expect(service.isEquivalent(data1, data2)).toBeFalsy();
  });

  it('isEquivalent: should return false', () => {
    const data1 = {
      hello: 'world',
    };

    const data2 = {
      hello: 'world'
    };

    expect(service.isEquivalent(data1, data2)).toBeFalsy();
  });

  it('isEquivalent: should return true', () => {
    const data1 = {
      hello: '10'
    };

    const data2 = {
      hello: '10'
    };

    expect(service.isEquivalent(data1, data2)).toBeTruthy();
  });

  it('clearData: should clear data', () => {
    service.clearData();

    expect(service.readMockData()).toEqual([]);
  });

  it('clearSchedulerDefault: should clear data', () => {
    service.clearSchedulerDefault();

    expect(service.getSchedulerDefault()).toEqual(undefined);
  });

  it('setSchedulerDefault: should set data', () => {
    const data = {
      hello: 'world'
    };
    service.setSchedulerDefault(data);

    expect(service.getSchedulerDefault()).toEqual(data);
  });

  it('setBuildingLimit: should set data', () => {
    const data = {
      high: '10'
    };
    service.setBuildingLimit(data);

    expect(service.getBuildingLimit()).toEqual(data);
  });

  it('getData: should return undefined', () => {
    expect(service.getData(PucUserLimitDataSources.SLIDER, 'hello')).toEqual(undefined);
  });

  it('getData: should return data', () => {
    const data = [{
      selectedZoneName: 'hello',
      source: PucUserLimitDataSources.SLIDER
    }];

    service.fillMockData(data);
    expect(service.getData(PucUserLimitDataSources.SLIDER, 'hello')).toEqual(undefined);
  });

  it('getLatestUpdatedBy: should return null', () => {
    expect(service.getLatestUpdatedBy('hello')).toEqual(null);
  });
});
