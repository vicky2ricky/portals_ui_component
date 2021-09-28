import { Injectable } from '@angular/core';
import { PucSliderInputOutputData } from '../models/user-intnet/puc-slider-input-output-data.model';
import { PucUserLimitDataSources } from '../models/user-intnet/puc-user-limit-data-sources.enum';

@Injectable({
  providedIn: 'root'
})
export class SliderUserIntentService {
  private _data: any[] = [];
  private _buildingLimit: any;
  private _schedulerDefault: any;

  // Add latest UserIntent Temperature Values and the source of data
  public setData(data: PucSliderInputOutputData, source: any, selectedZoneName: string) {
    if (data.desiredTempHeating && data.desiredTempCooling) {
      this.filldatalogarray(data, source, selectedZoneName);
    }
  }

  // Create an tiny array log to check last 5 updates and its sources(only for log)
  private filldatalogarray(data: PucSliderInputOutputData, source: any, selectedZoneName: string) {

    const _zoneDataList = this._data ? this._data.filter((val) => (val.selectedZoneName === selectedZoneName)) : [];

    if (_zoneDataList.length === 0) {
      this._data.push({
        data,
        source, selectedZoneName, timeOfPush: Date.now()
      });
    } else if (_zoneDataList.length > 0) {
      const latestdata = _zoneDataList && _zoneDataList.length > 0 ? _zoneDataList.reduce((prev, current) => {
        return (prev.timeOfPush > current.timeOfPush) ? prev : current;
      }).data : undefined;

      if (!this.isEquivalent(latestdata, data)) {
        if (_zoneDataList.length < 5) {
          this._data.push({ data, source, selectedZoneName, timeOfPush: Date.now() });
        } else {
          const oldestdatatimeOfPush = _zoneDataList && _zoneDataList.length > 0 ? _zoneDataList.reduce((prev, current) => {
            return (prev.timeOfPush < current.timeOfPush) ? prev : current;
          }).timeOfPush : undefined;

          this._data = this._data.filter((obj) => {
            return obj.timeOfPush !== oldestdatatimeOfPush;
          });

          this._data.push({ data, source, selectedZoneName, timeOfPush: Date.now() });
        }
      }
    }
  }

  // Fetch data by passing the latest value holder data source
  public getData(source: PucUserLimitDataSources, selectedZoneName: string): PucSliderInputOutputData {
    let returnObj;
    if (this._data && this._data.length > 0) {
      const _dataEntries = this._data.filter((data) => ((data.selectedZoneName === selectedZoneName) && (data.source === source)));
      const latestdata = _dataEntries && _dataEntries.length > 0 ? _dataEntries.reduce((prev, current) => {
        return (prev.timeOfPush > current.timeOfPush) ? prev : current;
      }).data : undefined;
      returnObj = latestdata ? latestdata : undefined;
    }
    return returnObj;
  }

  // The UserIntent data stream sometimes sends data with already communicated value(i.e. same value)
  // so this is a check which helps in restricting updation of slider on receiving same value
  public isEquivalent(a, b) {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);
    if (aProps.length !== bProps.length) {
      return false;
    }

    for (const propName of aProps) {
      if (parseFloat(a[propName]) !== parseFloat(b[propName])) {
        return false;
      }
    }
    return true;
  }

  // To fetch the latest User Intent data source
  public getLatestUpdatedBy(selectedZoneName: string): PucUserLimitDataSources {
    const _zoneDataList = this._data && this._data.length > 0 ?
      this._data.filter((data) => (data.selectedZoneName === selectedZoneName)) : null;
    const latestdatasource = _zoneDataList && _zoneDataList.length > 0 ? _zoneDataList.reduce((prev, current) => {
      return (prev.timeOfPush > current.timeOfPush) ? prev : current;
    }).source : undefined;
    const _latestUpdatedBy = latestdatasource ? latestdatasource : null;
    return _latestUpdatedBy;
  }

  public clearData() {
    this._data = [];
  }

  public setBuildingLimit(buildingLimit: any) {
    this._buildingLimit = buildingLimit;
  }

  public getBuildingLimit() {
    return this._buildingLimit;
  }

  public setSchedulerDefault(data: any) {
    this._schedulerDefault = data;
  }

  public getSchedulerDefault() {
    return this._schedulerDefault;
  }

  public clearSchedulerDefault() {
    this._schedulerDefault = undefined;
  }

  // For unit testing
  readMockData() {
    return this._data;
  }
  // For unit testing
  fillMockData(data) {
    this._data = data;
  }
}
