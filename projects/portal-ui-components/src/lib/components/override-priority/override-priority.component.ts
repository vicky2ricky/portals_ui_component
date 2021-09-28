import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { HelperService } from '../../services/hs-helper.service';
import { LoaderService } from '../../services/loader.service';
import { SiteService } from '../../services/site.service';
import { ArrayUtil } from '../../utils/array-util';

export interface DialogData {
  zoneTuners: any[];
  type: 'building' | 'system' | 'zone' | 'module';
  priorityDetails: any;
  moduleTuners: any[];
  systemTuners: any[];
  buildingsData: any;
  pageType?: any;
  dis?: any;
}

@Component({
  selector: 'puc-override-priority',
  templateUrl: './override-priority.component.html',
  styleUrls: ['./override-priority.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class OverridePriorityComponent implements OnInit {
  priorityArray: Array<any> = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
  ];
  _data: any;
  isResetDisabled = false;
  selPriorityVal: any;
  mouseOvered: Array<any> = new Array(17);
  priorityDetails: any = {};
  options: any[] = [];
  priorityLevels: any = {
    system: {
      level: '14'
    },
    building: {
      level: '16'
    },
    zone: {
      level: '10'
    },
    module: {
      level: '8'
    }
  };
  priorityLevel: any;
  /* tslint:disable-next-line */
  @Output() onSave = new EventEmitter();
  zoneTuners: Array<any> = [];
  systemTuners: Array<any> = [];
  moduleTuners: Array<any> = [];
  buildingTuners: Array<any> = [];
  type: 'building' | 'system' | 'zone' | 'module' = 'building';
  tunerChildValues: Array<any> = [];
  pageType: any;
  buildingsData: any;


  constructor(
    private helperService: HelperService,
    private siteService: SiteService,
    public dialogRef: MatDialogRef<OverridePriorityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private loaderService: LoaderService
  ) {
    const self = this;
    self.pageType = self.data['pageType'] ? self.data['pageType'] : '';
    self.priorityDetails = self.data['priorityDetails'] ? self.data['priorityDetails'] : '';
    self.selPriorityVal = self.priorityDetails['newVal'] || '';
    self.buildingsData = self.data['buildingsData'] || [];
    self.type = self.data['type'];
    self.priorityLevel = self.priorityLevels[self.type] ? self.priorityLevels[self.type]['level'] || '' : '';
    const values = self.priorityDetails['values'] || [];
    self.generateOptions();
    this.changeChildTuner();
    if (self.pageType !== 'tuners') {
      self.getData(values);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  // get pointer values
  getData(data: any[]) {
    const self = this;
    const ids = data.map((_item) => _item['_id']);
    const promise = new Promise((resolve, reject) => {
      if (ids.length) {
        const tunerSubscribe = self.siteService.getBulkWritablePointData(ids).pipe(
          map(self.helperService.stripHaystackTypeMapping),
        ).pipe(map(self.mapIds))
          .subscribe(({ rows }) => {
            data.forEach((_item) => {
              const found = ArrayUtil.findInArray(rows, 'id', _item['_id']);
              if (found) {

                const defaultFound = ArrayUtil.findInArray(found['data'], 'level', '17');
                if (defaultFound) {
                  self.priorityDetails['defaultVal'] = defaultFound['val'];
                }
              }
            });
            resolve();
            tunerSubscribe.unsubscribe();
          }, (err) => {

            reject(err);
          });
      } else {
        resolve();
      }
    });
    return promise;


  }
  // get pointer values by Tunername
  async getDataByTunerName() {
    const self = this;
    const name = self.priorityDetails['name'];
    const promise = new Promise((resolve, reject) => {
      if (name) {
        let refIds: any[] = [];
        if (self.type === 'building') {
          refIds = self.buildingsData['buildings'];
        } else if (self.type === 'system') {
          refIds = self.buildingsData['ahuRefs'];
        } else if (self.type === 'zone') {
          refIds = self.buildingsData['zones'];
        } else {
          refIds = self.buildingsData['modules'];
        }
        const payload = {
          refIdList: refIds,
          tunerGroup: self.priorityDetails['tunerGroup'],
          tunerName: name

        };
        this.loaderService.active(true);
        const tunerSubscribe = self.siteService.getTunerPoints(self.type, payload)
          .subscribe((_res) => {
            self.tunerChildValues = _res;
            if (Array.isArray(_res) && _res.length) {
              const pointArrays: any[] = ArrayUtil.deepFlatten(_res, 'pointArray');
              /* tslint:disable-next-line */
              const found: any[] = pointArrays.filter((_item) => _item && _item['level'] == self.priorityLevel && _item['val']);
              if (found.length) {
                self.isResetDisabled = false;
              } else {
                self.isResetDisabled = true;
              }
            } else {
              self.isResetDisabled = true;
            }
            resolve();
            this.loaderService.active(false);
            tunerSubscribe.unsubscribe();
          }, (err) => {
            this.loaderService.active(false);
            reject(err);
          });
      } else {
        resolve();
      }
    });
    return promise;


  }
  // trim the ids
  mapIds(res) {
    if (res['rows'] && Array.isArray(res['rows'])) {
      res['rows'] = res['rows'].map((_item) => {
        _item['id'] = _item['id'].replace(_item['dis'], '').trim();
        return _item;
      });
    }
    return res;
  }
  // generate option values based on minVal and maxVal
  generateOptions() {
    const self = this;
    const data = self.priorityDetails || {};
    if (data.hasOwnProperty('minVal') && data.hasOwnProperty('maxVal') && data.hasOwnProperty('incrementVal')) {
      data['minVal'] = parseFloat(data['minVal']);
      data['maxVal'] = parseFloat(data['maxVal']);
      data['incrementVal'] = parseFloat(data['incrementVal']);
      self.options.push(data['minVal']);
      for (let i = data['minVal']; i < data['maxVal'];) {
        // const sum = Number(parseFloat(i + data['incrementVal']).toPrecision(2)).toString();
        const sum = i + data['incrementVal'];
        if (sum <= data['maxVal']) {
          self.options.push(sum);
        }
        i = sum;
      }
      self.options = self.options.map((_item) => {
        if (Number(_item) === _item && _item % 1 !== 0) {
          _item = parseFloat(_item).toFixed(2);
          _item = Number(_item).toString();
        }
        return _item;
      });
    }
  }
  // select group level tuner
  async changeChildTuner() {
    const self = this;
    self.tunerChildValues = [];
    await self.getDataByTunerName();
  }
  // close dialog
  close(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    const self = this;
  }
  save(data) {
    const self = this;
    data['newVal'] = self.selPriorityVal;
    data['isValueChanged'] = true;
    self.dialogRef.close({ data });
  }

}
