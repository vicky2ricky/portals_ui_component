import { AlertService } from '../../services/alert.service';
import { EnumService } from '../../services/enum.service';
import { LoaderService } from '../../services/loader.service';
import { SiteService } from '../../services/site.service';
import { UserService } from '../../services/user.service';
import { ArrayUtil } from '../../utils/array-util';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { OverridePriorityComponent } from '../override-priority/override-priority.component';
import { TunersModalComponent } from '../tuners-modal/tuners-modal.component';
import { Component, Input, ViewEncapsulation, Output, EventEmitter, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'puc-tuner-list',
  templateUrl: './tuner-list.component.html',
  styleUrls: ['./tuner-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TunerListComponent implements OnInit, OnDestroy {
  accHeadStyle = {
    'font-size': '0.8rem',
    margin: '2px 0',
    'font-weight': '500',
    color: '#231f20',
    'text-transform': 'capitalize',
  };
  searchText: any;
  selectedTuner: any = {};
  changedTuners: Array<any> = [];
  @Input() isTunersUpdated$: Subject<any> = new Subject();
  @Input() hasGroup = false;
  @Input()
  get data(): any[] {
    return this._tuners;
  }
  set data(val: any[]) {
    this._tuners = val;
    this.groupData();
  }
  private _level: any;
  @Input()
  get level(): any {
    return this._level;
  }
  set level(val: any) {
    this._level = val;

  }
  private _buildingsData: any;
  @Input()
  get buildingsData(): any {
    return this._buildingsData;
  }
  set buildingsData(val: any) {
    this._buildingsData = val;

  }
  _tuners: Array<any> = [];
  @Input()
  get zoneTuners(): any[] {
    return this._zoneTuners;
  }
  set zoneTuners(val: any[]) {
    this._zoneTuners = val;
  }
  _zoneTuners: Array<any> = [];
  @Input()
  get moduleTuners(): any[] {
    return this._moduleTuners;
  }
  set moduleTuners(val: any[]) {
    this._moduleTuners = val;
  }
  _moduleTuners: Array<any> = [];
  reason: any;
  @Input() siteInfo: any = {};
  priorityLevel: any = '';
  tunersGroup: any;
  @Output() isTunerUpdated: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onEditClick: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onTunerApply: EventEmitter<any> = new EventEmitter();
  subscriptions: any = {};
  parentUrl: string;
  priorityDialogRef: any;
  @Input() portalType: 'internal' | 'facilisight' = 'internal';
  constructor(
    private siteService: SiteService,
    private userService: UserService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private enumService: EnumService,
    private loaderService: LoaderService,
    private dom: DomSanitizer,
  ) {

  }
  ngOnInit() {
    const self = this;
    self.parentUrl = self._activatedRoute.snapshot.parent ? self._activatedRoute.snapshot.parent.url.toString() : '';
    self.subscriptions['isTunerUpdated'] = self.isTunersUpdated$.subscribe((_res) => {
      if (_res) {
        this.reason = '';
        this._tuners = this._tuners.map((_item) => {
          delete _item['newVal'];
          delete _item['isValueChanged'];
          return _item;
        });
      }
    });
  }
  // reset value
  reset(item) {
    if (item) {
      delete item['newVal'];
      delete item['isValueChanged'];
      this.changedTuners = this._tuners.filter((_item) => _item['isValueChanged']);
    }
  }


  // group the data by type
  groupData() {
    const self = this;
    if (self.hasGroup) {
      self._tuners = self._tuners.map((_item) => {
        if (!_item['tunerGroup']) {
          _item['tunerGroup'] = 'other';
        }
        _item['isLoading'] = true;
        return _item;
      });
      self.tunersGroup = ArrayUtil.groupBy(self._tuners, 'tunerGroup');
    }

  }

  async update() {
    const self = this;
    const data: Array<any> = self._tuners.filter((_item) => _item['isValueChanged']);
    if (data.length) {
      if (self.parentUrl.includes('tuners')) {
        self.onTunerApply.emit({ tuners: data, reason: self.reason });
      } else {
        const buildingsData =
          [{
            selected: true,
            children: [{
              selected: true,
              type: 'building',
              dis: (this.siteInfo && this.siteInfo['siteDetails'] && this.siteInfo['siteDetails']['dis']) ?
                this.siteInfo['siteDetails']['dis'] : '',
              address: {
                geoAddr: (this.siteInfo && this.siteInfo['siteDetails'] && this.siteInfo['siteDetails']['geoAddr']) ?
                  this.siteInfo['siteDetails']['geoAddr'] : '',
                geoState: (this.siteInfo && this.siteInfo['siteDetails'] && this.siteInfo['siteDetails']['geoState']) ?
                  this.siteInfo['siteDetails']['geoState'] : '',
                geoPostalCode:
                  (this.siteInfo && this.siteInfo['siteDetails'] && this.siteInfo['siteDetails']['geoPostalCode']) ?
                    this.siteInfo['siteDetails']['geoPostalCode'] : '',
                geoCity: (this.siteInfo && this.siteInfo['siteDetails'] && this.siteInfo['siteDetails']['geoCity']) ?
                  this.siteInfo['siteDetails']['geoCity'] : '',
                geoCountry: (this.siteInfo && this.siteInfo['siteDetails'] && this.siteInfo['siteDetails']['geoCountry']) ?
                  this.siteInfo['siteDetails']['geoCountry'] : '',
              },
              children: [
                {
                  selected: true,
                  type: 'system',
                  siteRef: (this.siteInfo && this.siteInfo['siteRef']) ? '@' + this.siteInfo['siteRef'] : '',
                  dis: (this.siteInfo && this.siteInfo['ccuName']) ? this.siteInfo['ccuName'] : '',
                  ahuRef: (this.siteInfo && this.siteInfo['ahuRef']) ? '@' + this.siteInfo['ahuRef'] : '',
                  children: [
                    {
                      selected: true,
                      type: 'zone',
                      siteRef: (this.siteInfo && this.siteInfo['siteRef']) ? '@' + this.siteInfo['siteRef'] : '',
                      dis: (this.siteInfo && this.siteInfo['zoneName']) ? this.siteInfo['zoneName'] : '',
                      ahuRef: (this.siteInfo && this.siteInfo['ahuRef']) ? '@' + this.siteInfo['ahuRef'] : '',
                      _id: (this.siteInfo && self.siteInfo['roomRef']) ? self.siteInfo['roomRef'] : ''
                    }

                  ]
                }
              ]
            }]
          }];

        const tuners = data.filter((_filterItem) => _filterItem).map((_item) => {
          const obj = {};
          obj['name'] = _item['name'];
          obj['tunerGroup'] = _item['tunerGroup'];
          return obj;
        });
        let refIds: any[] = [];
        if (self._level == 'system') {
          refIds = [].concat(self.siteInfo['ahuRef']);
        } else if (self._level == 'zone') {
          refIds = [].concat(self.siteInfo['roomRef']);
        }
        const payload = {
          refIdList: refIds,
          tuners
        };
        const pointers: any[] = await self.siteService.getTunerPointValues(self._level, payload).toPromise();
        const dialogRef = self.dialog.open(TunersModalComponent, {
          width: '50%',
          panelClass: 'tuner-modal-container',
          data: {
            buildingsInfo: buildingsData, tunerLevel: self._level, tuners: data,
            pointers
          }
        });
        dialogRef.updatePosition({ top: '50px' });
        const result = await dialogRef.afterClosed().toPromise();
        if (result && result == 'apply') {
          self.updateValues(data);
        }
      }
    } else {
      self.alertService.warning('Please update atleast one tuner');
    }

  }

  async updateValues(data) {
    const self = this;
    data.forEach((_item) => {
      if (_item['values']) {
        _item['values'] = _item['values']
          .map((_mapItem) => {
            _mapItem['val'] = _item['newVal'] ? _item['newVal'] : '';
            return _mapItem;
          });
      }

    });
    // tslint:disable-next-line: no-shadowed-variable
    const pointArray: Array<any> = data.reduce((res, elem) => {
      return res = elem['values'] && Array.isArray(elem['values']) ? res.concat(elem['values']) : res;
    }, []);
    const priorityLevel = self.enumService.getEnum('priorityLevel');
    const username = `web_${this.userService.getDisplayId()}`;
    const payload = pointArray.map((_item) => {
      const obj = {};
      obj['val'] = _item['val'];
      obj['who'] = username;
      obj['ref'] = _item['_id'];
      obj['level'] = priorityLevel[self._level]['level'];
      obj['duration'] = '0ms';
      return obj;
    });
    // commented temporarily
    // const logPayload = pointArray.map((_item) => {
    //     const obj = {
    //         ahuRef: self.siteInfo['ahuRef'] || '',
    //         pointId: _item['_id'],
    //         pointName: _item['name'],
    //         command: 'Update Point',
    //         who: `web_${this.userService.getDisplayId().displayableId}`,
    //         val: _item['val'],
    //         level: '14',
    //         reason: self.reason,
    //         siteRef: self.siteInfo['siteRef'] || ''
    //     }
    //     return obj;
    // })
    self.loaderService.active(true);
    const res = await self.siteService.updateBulkWritablePointData(payload).toPromise();
    self.loaderService.active(false);
    self.reason = '';
    self._tuners = this._tuners.map((_item) => {
      delete _item['newVal'];
      delete _item['isValueChanged'];
      return _item;
    });
    self.alertService.success('All changes have been saved');
    // commented temporarily
    // await self.siteService.createTunerLogs(logPayload).toPromise();
    self.isTunerUpdated.emit(true);
    return res;
  }

  getValue(data) {
    return () => {
      data['isLoading'] = false;
    };
  }
  edit(data) {
    const self = this;
    self.selectedTuner = data;
    if (self.parentUrl.includes('tuners')) {
      self.onEditClick.emit(true);
      setTimeout(() => {
        self.openModal();
      }, 0);
    } else {
      self.openModal();
    }

  }


  openModal() {
    const self = this;
    if (Object.keys(self.siteInfo).length !== 0) {
      self._buildingsData = {};
      if (self._level == 'system') {
        self._buildingsData['ahuRefs'] = [].concat(self.siteInfo['ahuRef']);
      } else if (self._level == 'zone') {
        self._buildingsData['zones'] = [].concat(self.siteInfo['roomRef']);
      }

    }
    if (
      (self._buildingsData['buildings'] && self._buildingsData['buildings'].length)
      || (self._buildingsData['ahuRefs'] && self._buildingsData['ahuRefs'].length)
      || (self._buildingsData['zones'] && self._buildingsData['zones'].length)
      || (self._buildingsData['modules'] && self._buildingsData['modules'].length)
    ) {
      self.priorityDialogRef = this.dialog.open(OverridePriorityComponent, {
        panelClass: 'override-modal-container',
        width: (self.selectedTuner && self.selectedTuner['onlyForSystemTuner']) ? '360px' : '80%',
        data: {
          type: self._level,
          priorityDetails: self.selectedTuner,
          buildingsData: self._buildingsData,
          pageType: self.parentUrl
        }
      });

      self.priorityDialogRef.afterClosed().subscribe(result => {
        if (result && result['data']) {
          self.selectedTuner['newVal'] = result['data']['newVal'];
          self.selectedTuner['isValueChanged'] = result['data']['isValueChanged'];
          self.changedTuners = self._tuners.filter((_item) => _item['isValueChanged']);

        }
      });
    } else {
      self.openDialog();
    }


  }
  openDialog() {
    const self = this;
    const dialogRef = self.dialog.open(ConfirmModalComponent, {
      panelClass: 'fs-mat-dialog-container',
      width: '600px',
      disableClose: true
    });
    const htmlContent = `<div >
    Please select atleast one ${this.portalType == 'internal' ? 'SmartGroup/' : ''}
                    Building/System/Zone/Module to apply the edited tuner.</div>`;
    dialogRef.componentInstance.htmlContent = this.dom.sanitize(SecurityContext.HTML, htmlContent);
    dialogRef.componentInstance.type = 'dialog';
    dialogRef.updatePosition({ top: '60px' });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  ngOnDestroy() {
    Object.keys(this.subscriptions).forEach(e => {
      this.subscriptions[e].unsubscribe();
    });
    this._tuners.map((_item) => {
      _item['data'] = {};
      return _item;
    });
  }

}
