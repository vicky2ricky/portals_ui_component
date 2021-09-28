import * as _ from 'lodash-es';
import * as moment_ from 'moment';

import { BehaviorSubject, Observable, Subject, forkJoin, of } from 'rxjs';
import { EventEmitter, Injectable, OnDestroy, SecurityContext } from '@angular/core';
import { catchError, map, take, takeUntil } from 'rxjs/operators';

import { AlertService } from './alert.service';
import { AuthenticationService } from './authentication.service';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { DataService } from './data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { SiteService } from './site.service';

const moment = moment_;

@Injectable({
  providedIn: 'root'
})

export class HelperService implements OnDestroy {
  private _data: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private unsubscribe: Subject<void> = new Subject();
  userName: string;
  pointIdSet: any = new Set();
  pointIdMaster: any = new Set();
  opObj: any = {};
  ccuLevel: any;
  building: any;
  public revertPointValues: any = [];
  propertyNameAndValue: any;
  popUpCancelClick = new Subject();
  cancelledChange: EventEmitter<any>;
  public multiModulePointsOverride = false;
  public multiModuleOverridePopUpSelectedValue: boolean;
  tunersInfo: Map<string, any> = new Map();
  equipZones: Array<any> = [];
  zones: Array<any> = [];
  equipId: any;
  isDashboardPage$: Subject<any> = new Subject();
  popupOpened = false;
  prevData: any;
  forcedOverrideData: Map<string, any[]> = new Map();

  constructor(
    private dataService: DataService,
    private siteService: SiteService,
    private alertService: AlertService,
    private authService: AuthenticationService,
    private dom: DomSanitizer,
    private dialog: MatDialog,
  ) {
    this.cancelledChange = new EventEmitter<any>();
  }

  raiseEvent(propertyNameAndValue: any): void {
    this.propertyNameAndValue = propertyNameAndValue;
    const url = localStorage.getItem('url');
    this.cancelledChange.emit({ list: propertyNameAndValue, activeurl: url });
  }


  isRef(refValue: any) {
    return (typeof (refValue) === 'string') && refValue.startsWith('r:');
  }

  getUserName() {
    const loggedInUserDetails = this.authService.getLoggedInUserDetails();
    if (loggedInUserDetails) {
      return loggedInUserDetails.firstName + ' ' + loggedInUserDetails.lastName;
    } else {
      return null;
    }
  }

  isMarker(marker: any) {
    return (typeof (marker) === 'string') && marker.startsWith('m:');
  }

  parseRef(refValue: any): any {
    return refValue.split(' ')[0].split('r:')[1];
  }

  stripHaystackTypeMapping(response: any) {
    return (response) ? JSON.parse(JSON.stringify(response).replace(/"r:|"c:|"n:|"t:|"b:|"m:|"z:|"s:/g, '"')) : '';
  }

  /**
   *
   * @param rangeStr response.rows[0].range
   * @param tz IANA timezone
   */
  parseVacation(data: any, tz: string) {
    let stdt;
    let etdt;
    stdt = moment(data.stdt.split(' ')[0]).tz(tz).format('YYYY-MM-DDTHH:mm:ss');
    etdt = moment(data.etdt.split(' ')[0]).tz(tz).format('YYYY-MM-DDTHH:mm:ss');

    const vacationData = [
      {
        'Start Time': stdt,
        'End Time': etdt
      }
    ];
    return vacationData;
  }

  processWritableArray(pointRef: any, response: any) {
    const rows = [];

    for (let i = 0; i < 16; i++) {
      rows[i] = {
        ref: pointRef,
        level: i + 1,
        who: '',
        duration: '',
        val: ''
      };
    }
    if (Object.keys(response.metadata).indexOf('errTrace') !== -1) {

    } else {
      response.rows.forEach((row: any) => {
        row['ref'] = pointRef;
        row['level'] = parseInt(row['level'], 10);
        // convert millis time to ms elapsed
        row['duration'] = parseInt(row['duration'],10) === 0 ? row['duration'] = 0 : `${parseInt(row['duration'], 10) - new Date().getTime()}ms`;
        rows[row['level'] - 1] = row;
      });
    }

    return rows;
  }

  setPointData() {
    let reqIds = [];

    this.dataService.getId()
      .pipe(
        takeUntil(this.unsubscribe),
        take(1),
      )
      .subscribe(res => {
        if (res) {
          reqIds = Array.from(res);
          const fetchTypes = {
            pointWrite:[],
            hisRead:[],
            pointReadById:[]
          };
          let noChangeList = [];
          this.pointIdSet = new Set();
          reqIds.forEach(id => {
            const reqParams = id.toString().split('|');
            const reqId = reqParams[0];
            const reqType = reqParams[1];
            const reqKey = reqParams[2];
            const reqChange = (reqParams[3] === 'update') ? true : false;
            this.pointIdSet.add(reqId + '|' + reqType + '|' + reqKey + '|updated');

            if (reqChange) {
              if (reqKey.split('~').length > 1) {
                const prop = reqKey.split('~')[1];
                const value = this.opObj[prop];
                if (value && prop !== 'systemMode') {
                  Object.assign(this.opObj, { [prop]: value });
                } else {
                  Object.assign(this.opObj, { [prop]: [] });
                }
              } else {
                const prop = reqKey.split('~')[0];
                const value = this.opObj[prop];
                if (value && prop !== 'systemMode') {
                  Object.assign(this.opObj, { [prop]: value });
                } else {
                  Object.assign(this.opObj, { [prop]: {} });
                }
              }
              switch (reqType) {
                case 'read':
                 fetchTypes.hisRead.push({
                   id: reqId,
                   key:reqKey
                 })
                 break;

                case 'write':
                  fetchTypes.pointWrite.push({
                    id: reqId,
                    key:reqKey
                  })
                  break;

                case 'schedule':
                  fetchTypes.pointReadById.push({
                    id: reqId,
                    key:reqKey,
                    type:'schedule'
                  })

                  break;

                case 'vacation':
                  fetchTypes.pointReadById.push({
                    id: reqId,
                    key:reqKey,
                    type:'vacation'
                  })

                  break;

                case 'read&hisRead':

                  fetchTypes.hisRead.push({
                    id: reqId,
                    key:reqKey
                  })
                  fetchTypes.pointReadById.push({
                    id: reqId,
                    key:reqKey,
                    type:'modbus'
                  })
                  break;

                case 'read&hisWrite':
                  fetchTypes.pointReadById.push({
                    id: reqId,
                    key:reqKey,
                    type:'modbus'
                  })
                  fetchTypes.pointWrite.push({
                    id: reqId,
                    key:reqKey
                  })

                  break;

                default:
                  console.log('Unknown end point');
                  break;
              }
            } else {
              noChangeList.push({
                type: reqType,
                id: reqId,
                key: reqKey
              })
            }
          });

          const readPoints = fetchTypes.pointReadById.map(p=>p.id);
          const writePoints = fetchTypes.pointWrite.map(p=>p.id);
          const hisReadPoints = fetchTypes.hisRead.map(p=>p.id);

          const forkJoinRq = []
          if(readPoints.length) {
            forkJoinRq.push(
              this.siteService.getReadByIdMany(readPoints).pipe(
                catchError(err => of(undefined)),
                takeUntil(this.unsubscribe),
                map(this.stripHaystackTypeMapping),
              )
            )
          }
          if(writePoints.length) {
            forkJoinRq.push(
              this.siteService.getBulkWritablePointData(writePoints).pipe(
                catchError(err => of(undefined)),
                takeUntil(this.unsubscribe),
                map(this.stripHaystackTypeMapping),
              )
            )
          }

          if(hisReadPoints.length) {
            forkJoinRq.push(
              this.siteService.getCurrenthisReadMany(hisReadPoints).pipe(
                catchError(err => of(undefined)),
                takeUntil(this.unsubscribe),
                map(this.stripHaystackTypeMapping),
              )
            )
          }

          forkJoin(forkJoinRq).subscribe((response)=>{
            let readRes;
            let writeRes;
            let hisReadRes;
            // assign response based on request types
            if(readPoints.length && writePoints.length && hisReadPoints.length)  {
              readRes = response[0];
              writeRes = response [1];
              hisReadRes = response [2];
            } else if(forkJoinRq.length>1) {
              if(readPoints.length)  {
                readRes = response[0];
                if(writePoints.length)  writeRes = response [1];
                else hisReadRes = response [1];
              } else {
                writeRes = response [0];
                hisReadRes = response [1]
              }

            } else {
              if(readPoints.length)  {
                readRes = response[0];
              } else if(writePoints.length) {
                writeRes = response [0];
              } else {
                hisReadRes = response [0]
              };
            }


            if(writePoints.length) {
              writeRes.rows.forEach(row => {
                let  pointvals = fetchTypes.pointWrite.filter(p => p.id == this.stripHaystackTypeMapping(row.id));
                const duplicatePointsUpdate = noChangeList.filter(p=>p.id == this.stripHaystackTypeMapping(row.id) && (p.reqType=='write' || p.reqType=='read&hisWrite'));
                pointvals = pointvals.concat(duplicatePointsUpdate);
                pointvals.forEach((pointval)=>{
                  this.getPointWrite(pointval.id,pointval.key,row);
                });

              });
            }
            if(hisReadPoints.length) {
              hisReadRes.rows.forEach(row => {
                let pointvals = fetchTypes.hisRead.filter(p => p.id == this.stripHaystackTypeMapping(row.id));
                const duplicatePointsUpdate = noChangeList.filter(p=>p.id == this.stripHaystackTypeMapping(row.id) && (p.reqType=='read' || p.reqType=='read&hisRead'));
                pointvals = pointvals.concat(duplicatePointsUpdate);
                pointvals.forEach((pointval)=>{
                  this.getHisReadData(pointval.id,pointval.key,row);
                })
              });
            }

            if(readPoints.length) {
              readRes.rows.forEach(row => {
                let pointvals = fetchTypes.pointReadById.filter(p => p.id == this.stripHaystackTypeMapping(row.id));
                const duplicatePointsUpdate = noChangeList.filter(p=>p.id == this.stripHaystackTypeMapping(row.id) && (p.reqType!='read' && p.reqType!='write'));
                pointvals = pointvals.concat(duplicatePointsUpdate);
                pointvals.forEach((pointval)=>{
                  this.getReadData(pointval.id,pointval.key,pointval.type,row)
                })
              });
            }

            this._data.next(this.opObj);
          })

          this.dataService.setId(this.pointIdSet);
        }
      });
  }

  public getPointData() {
    this.setPointData();
    return this._data;
  }

  getHisReadData(reqId, reqKey, row) {

    if (row) {
      if (reqKey.split('~').length < 2) {
        if (this.opObj[reqKey.split('~')[0]]) {
          this.opObj[reqKey.split('~')[0]]['val'] = row.data.length?row.data[row.data.length - 1].val:'';
          this.opObj[reqKey.split('~')[0]]['id'] = reqId;
          this.opObj[reqKey.split('~')[0]]['time'] = row.data.length?row.data[row.data.length - 1].ts.split(" ")[0]:'';
        }
      } else {
        if (this.opObj[reqKey.split('~')[1]]) {
          if (!this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]) {
            Object.assign(this.opObj[reqKey.split('~')[1]], { [reqKey.split('~')[0]]: {} });
          }
          this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]['val'] = row.data.length?row.data[row.data.length - 1].val:'';
          this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]['id'] = reqId;
          this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]['time'] = row.data.length?row.data[row.data.length - 1].ts.split(" ")[0]:'';
        }
      }
    }
    else if (!row) {
      if (reqKey.split('~').length < 2) {
        if (this.opObj[reqKey.split('~')[0]]) {
          this.opObj[reqKey.split('~')[0]]['error'] = 'No data received' + reqKey.split('~')[0];
        }
      } else {
        if (this.opObj[reqKey.split('~')[1]] && !this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]) {
          Object.assign(this.opObj[reqKey.split('~')[1]], { [reqKey.split('~')[0]]: {} });
          // tslint:disable-next-line
          this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]['error'] = 'No data received' + reqKey.split('~')[0] + 'of' + [reqKey.split('~')[1]];
        }
      }
    }
  }

  getPointWrite(reqId, reqKey,val) {

    if (val) {
      if (reqKey.split('~').length < 2) {
        if (this.opObj[reqKey.split('~')[0]]) {
          // tslint:disable-next-line

          this.opObj[reqKey.split('~')[0]]['val'] = val.data && val.data.length?
            ((!isNaN(Number(val.data[0].val))) ? Number(val.data[0].val) : val.data[0].val.toString()):'';
          this.opObj[reqKey.split('~')[0]] = Object.assign(this.opObj[reqKey], { ['priorityArray']: {} });
          this.opObj[reqKey.split('~')[0]]['priorityArray']['data'] = val.data;
          this.opObj[reqKey.split('~')[0]]['priorityArray']['id'] = reqId;

        }
      } else {
        if (this.opObj[reqKey.split('~')[1]]) {
          if (!this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]) {
            Object.assign(this.opObj[reqKey.split('~')[1]], { [reqKey.split('~')[0]]: {} });
          }
          // tslint:disable-next-line
          this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]['val'] = val.data && val.data.length ? ((!isNaN(Number(val.data[0].val))) ? Number(val.data[0].val) : val.data[0].val.toString()):'';
          // tslint:disable-next-line
          this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]] = Object.assign(this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]], { ['priorityArray']: {} });
          this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]['priorityArray']['data'] = val.data;
          this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]['priorityArray']['id'] = reqId;

        }
      }
    } else if (!val) {
      if (reqKey.split('~').length < 2) {
        if (this.opObj[reqKey.split('~')[0]]) {
          this.opObj[reqKey.split('~')[0]]['error'] = 'No data received' + reqKey.split('~')[0];

        }
      } else {
        if (this.opObj[reqKey.split('~')[1]]) {
          Object.assign(this.opObj[reqKey.split('~')[1]], { [reqKey.split('~')[0]]: {} });
          // tslint:disable-next-line
          this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]['error'] = 'No data received' + reqKey.split('~')[0] + 'of' + [reqKey.split('~')[1]];

        }
      }
    }
  }

  getReadData(reqId, reqKey,type,row) {
    if(type=='schedule') {
      this.getSchData(reqId,reqKey,row);
    } else if(type=='vacation') {
      this.getVacationData(reqId,reqKey,row);
    } else {

      if (row) {
        if (reqKey.split('~').length < 2) {
          this.opObj[reqKey.split('~')[0]]['data'] = this.formatEnums(row);
          this.opObj[reqKey.split('~')[0]]['id'] = reqId;
        } else {
          if (!this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]) {
            Object.assign(this.opObj[reqKey.split('~')[1]], { [reqKey.split('~')[0]]: {} });
          }
          this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]['data'] = this.formatEnums(row);
          this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]['id'] = reqId;
        }
      }
    }
  }

  getSchData(reqId, reqKey,row) {

    if (row) {
      if (reqKey.split('~').length < 2) {
        if (this.opObj[reqKey.split('~')[0]]) {
          this.opObj[reqKey.split('~')[0]]['val'] = row.days;
          this.opObj[reqKey.split('~')[0]]['id'] = reqId;
        }
      } else {
        if (this.opObj[reqKey.split('~')[1]]) {
          Object.assign(this.opObj[reqKey.split('~')[1]], { [reqKey.split('~')[0]]: {} });
          this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]] = row;

        }
      }
    }
  }

  getVacationData(reqId, reqKey,row) {

    if (reqKey.split('~').length < 2) {
      if (!this.opObj[reqKey.split('~')[0]].length) {
        this.opObj[reqKey.split('~')[0]] = [];
      }
      if (row) {
        const vacData = {
          id: reqId,
          val: {
            name: row.dis,
            range: row.range
          }
        };
        let vacExists = false;

        this.opObj[reqKey.split('~')[0]].map((vac, index) => {
          if (vac.id === vacData.id) {
            this.opObj[reqKey.split('~')[0]][index] = vacData;
            vacExists = true;
          }
        });

        if (!vacExists) {
          this.opObj[reqKey.split('~')[0]].push(vacData);
        }
      }
    } else {
      if (!this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]]) {
        this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]] = [];
      }
      if (row) {
        const vacData = {
          id: reqId,
          val: {
            name: row.dis,
            range: row.range
          }
        };
        let vacExists = false;

        this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]].map((vac, index) => {
          if (vac.id === vacData.id) {
            this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]][index] = vacData;
            vacExists = true;
          }
        });

        if (!vacExists) {
          this.opObj[reqKey.split('~')[1]][reqKey.split('~')[0]].push(vacData);
        }
      }
    }
  }

  formatEnums(data) {
    if (data['enum']) {
      if (data['enum'].includes(',')) {
        data['enum'] = data['enum'].split(',');
      } else {
        data['enum'] = '';
      }
      if(data['enum'] && data['enum'].length) {
        data['enum'] = data['enum'].map(val=>{
          const enums = val.split('=');
          if(enums.length>0) {
            return {
              value:enums[1],
              name:enums[0]
            }
          }
        })
      }
    }

    if (data && data.hasOwnProperty('writable')) {
      if (!data['enum']) {
        data['options'] = this.generateRange(Number(data['minVal']), Number(data['maxVal']), Number(data['incrementVal']));
      }
    }

    return data;
  }

  generateRange(min, max, step) {
    const arr = [];
    for (let i = min; i <= max; i += step) {
       arr.push(i);
    }

    return arr;
  }

  isDataLoaded(data: any) {
    // return (!data) ? 'Loading...' : (isNaN(data)) ? data.toString().toLowerCase().replace(/\bon\b/g,
    //   '<span>on</span>').replace(/\boff\b/g, '<span>off</span>') : data;
    return (!data) ? 'Loading...' : this.getReplaceData(data);
  }

  getReplaceData(data) {
    if(data.toString().toLowerCase().indexOf('\bon\b')>-1 || data.toString().toLowerCase().indexOf('\boff\b')>-1) {
      return data.toString().toLowerCase().replace(/\bon\b/g, '<span>on</span>').replace(/\boff\b/g, '<span>off</span>')
    }
    return data;
  }

  assemblePointIdData(pointId: string, endPointType: string, settingType: string, profileEquipName: string, trigger: string) {
    (profileEquipName) ? this.pointIdMaster.add(`${pointId}|${endPointType}|${settingType}~${profileEquipName}|${trigger}`) :
      this.pointIdMaster.add(`${pointId}|${endPointType}|${settingType}|${trigger}`);
    this.dataService.setId(this.pointIdMaster);
  }

  updatePointIdData(pointId: string, endPointType: string, settingType: string, profileEquipName: string, trigger: string) {
    let reqIds = [];
    this.dataService.getId()
      .pipe(
        takeUntil(this.unsubscribe),
        take(1),
      )
      .subscribe(res => {
        if (res) {
          reqIds = Array.from(res);
          // tslint:disable-next-line
          const entry = (profileEquipName) ? `${pointId}|${endPointType}|${settingType}~${profileEquipName}|${trigger}` : `${pointId}|${endPointType}|${settingType}|${trigger}`;
          reqIds.push(entry);
          this.dataService.setId(reqIds);
        }
      });
  }

  sortResponse(res) {
    res.rows = res.rows.reverse();
    return res;
  }

  listEntities(response: any) {
    const entityTypes = [
      'ccu',
      'device',
      'point',
      'equip',
      'room',
      'floor',
      'schedule',
      'vacation',
    ];
    const entities = response.rows.map((row: any) => {
      const keys = Object.keys(row);
      const referenceIDs = {};

      keys.forEach((key) => {
        const referenceMatch = key.match(/(.+?)Ref$/);
        if (referenceMatch && row[key].replace(/^r:/, '').search(/SYSTEM/i) < 0) {
          referenceIDs[referenceMatch[1]] = row[key].replace(/^r:/, '');
        }
      });
      // tslint:disable-next-line
      const entities: any[] = [];
      const entity = {
        _id: row.id.replace(/^r:/, ''),
        name: row.dis,
        markers: keys.filter(k => k !== 'id'), // ignore id key
        type: entityTypes.find((entityType: any) => keys.includes(entityType)),
        referenceIDs,
        currentValue: row.curValue,
        unit: row.unit,
        enum: row.enum || '',
        dispName: row.shortDis,
        otherProperties: row.days,
        minVal: row.minVal ? row.minVal.replace(/^r:|^n:|^t:|^b:|^m:|^z:|^s:/, '') : '',
        maxVal: row.maxVal ? row.maxVal.replace(/^r:|^n:|^t:|^b:|^m:|^z:|^s:/, '') : '',
        incrementVal: row.incrementVal ? row.incrementVal.replace(/^r:|^n:|^t:|^b:|^m:|^z:|^s:/, '') : '',
        tunerGroup: row.tunerGroup || '',
        entities,
        
      };
      if(entity['type'] == 'floor') {
        entity["floorNum"] =  row.floorNum ? row.floorNum.replace(/^r:|^n:|^t:|^b:|^m:|^z:|^s:/, '') : '';
      }

      return entity;
    });
    return entities;
  }

  createEntityStructure(entities: any[]) {
    const entityTypes = [
      'ccu',
      'device',
      'point',
      'equip',
      'room',
      'floor',
      'schedule',
      'vacation',
    ];
    const entityGroups: any = {};
    entityTypes.forEach((entityType: any) => {
      entityGroups[`${entityType}s`] = [];
    });
    const entityIndexes = {};

    entities.forEach((entity, index) => {
      entityIndexes[entity._id] = index;
      if (entity.type) {
        entityGroups[`${entity.type}s`].push(entity);
      }
    });

    entityTypes.forEach((entityType: any) => {
      if (entityType === 'device' || entityType === 'ccu') {
        return;
      }

      const entityGroup = entityGroups[`${entityType}s`];
      let index = entityGroup.length;
      while (index--) {
        const entity = entityGroup[index];
        // tslint:disable-next-line
        const referenceType = entityTypes.find((entityType: any) => Object.keys(entity.referenceIDs).includes(entityType));
        if (referenceType) {
          const referenceID = entity.referenceIDs[referenceType];
          const reference = entities[entityIndexes[referenceID]];
          if (typeof reference !== 'undefined') {
            reference.entities.push(entityGroup.splice(index, 1)[0]);
          }
        }
      }
    });
    entities.forEach((entity) => {
      entity.entities.reverse();
    });

    return [].concat(...Object.values(entityGroups).reverse());
  }

  /* istanbul ignore next  */
  handleInputChange(ponitsToUpdate: any[]) {
    let forceOverridePoints = [];
    const dataToWrite = [];
    ponitsToUpdate.forEach((pointData: any) => {
      const data = {
        ref: null,
        level: '10',
        who: `web_${this.getUserName()}`,
        duration: '0.0ms',
        val: null
      };
      // tslint:disable-next-line
      const prevPointArray = (typeof pointData.priorityArray !== 'undefined') ? ('data' in pointData.priorityArray) ? pointData.priorityArray.data : undefined : false;
      this.ccuLevel = (prevPointArray) ? this.stripHaystackTypeMapping(prevPointArray[0]['level']) : undefined;
      const modeId = pointData.priorityArray.id;
      data.ref = modeId;
      data.val = pointData.value;
      if (prevPointArray && this.ccuLevel) {
        if ((prevPointArray.length >= 1 && this.ccuLevel <= 8) || forceOverridePoints.length > 0) {
          forceOverridePoints.push({
            data,
            pointData
          });
        } else {
          dataToWrite.push({
            data,
            pointData
          });
        }
      } else {
        dataToWrite.push({
          data,
          pointData
        });
      }
    });

    if (forceOverridePoints.length) {
      forceOverridePoints = forceOverridePoints.concat(dataToWrite);
      this.presentAlert(forceOverridePoints);
    } else {
      dataToWrite.forEach((data) => {
        this.writeDataToHaystack(data.data, data.pointData.type);
      });
    }
  }

  forceOverrideData(mode: any, data: any, prevData: any) {
    prevData.map(priorityArray => {
      if (priorityArray.level > 7 && priorityArray.level < 10) {
        const overrideLevel8 = {
          ref: data.ref,
          level: String(priorityArray.level),
          who: `web_${this.getUserName()}`,
          duration: '0ms',
          val: 'N'
        };

        this.writeDataToHaystack(overrideLevel8, mode);
      }
    });
    this.writeDataToHaystack(data, mode);
  }

  writeDataToHaystack(data: any, mode: any) {
    if (data.val !== 'N') {
      this.updateExistingZoneSetting(data, mode);
    }
    this.siteService.updateWritablePointData(data)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.alertService.success('Settings updated successfully');
      }
      );
  }


  updateExistingZoneSetting(data: any, mode: any) {
    if (this.opObj[mode] && this.opObj[mode].id) {
      if (this.opObj[mode].id === data.ref) {
        this.opObj[mode].val = !isNaN(parseFloat(data.val)) && isFinite(data.val) ? Number(data.val) : data.val;
      }
    } else {
      if (this.opObj[mode] && this.opObj[mode].priorityArray.id === data.ref) {
        this.opObj[mode].val = !isNaN(parseFloat(data.val)) && isFinite(data.val) ? Number(data.val) : data.val;
      } else {
        Object.entries(this.opObj).forEach(([key, ent]) => {
          if (Array.isArray(ent)) {
            if (this.opObj[key][mode] && this.opObj[key][mode].id) {
              if (this.opObj[key][mode].id === data.ref) {
                this.opObj[key][mode].val = !isNaN(parseFloat(data.val)) && isFinite(data.val) ? Number(data.val) : data.val;
              }
            } else {
              if (this.opObj[key][mode] && this.opObj[key][mode].priorityArray.id === data.ref) {
                this.opObj[key][mode].val = !isNaN(parseFloat(data.val)) && isFinite(data.val) ? Number(data.val) : data.val;
              }
            }

          } else {
            if (this.opObj[key] && this.opObj[key].id) {
              if (this.opObj[key].id === data.ref) {
                this.opObj[key].val = !isNaN(parseFloat(data.val)) && isFinite(data.val) ? Number(data.val) : data.val;
              }
            }
          }
        });

      }
    }
    this._data.next(this.opObj);

  }

  removeDeletedZoneSetting(data: any) {
    const removedPubnubString = data;
    const removedid = data.split('|')[0];
    const prop = data.split('|')[2];
    if (prop.includes('~')) {
      const profile = prop.split('~')[1];
      const mode = prop.split('~')[0];
      if (this.opObj[profile][mode].id) {
        if (this.opObj[profile][mode].id === removedid) {
          this.opObj[profile][mode] = Array.isArray(this.opObj[profile][mode]) ? [] : {};
        } else {
          if (this.opObj[profile][mode].priorityArray.id === removedid) {
            this.opObj[profile][mode] = Array.isArray(this.opObj[profile][mode]) ? [] : {};
          }
        }
      }

    } else {
      const mode = prop;
      if (Array.isArray(this.opObj[mode])) {

        this.opObj[mode] = this.opObj[mode].filter((x) => {
          return x.id !== removedid;
        });

      } else {
        if (this.opObj[mode] && this.opObj[mode].id === removedid) {
          this.opObj[mode] = Array.isArray(this.opObj[mode]) ? [] : {};
        } else {
          if (this.opObj[mode] && this.opObj[mode].priorityArray.id === removedid) {
            this.opObj[mode] = Array.isArray(this.opObj[mode]) ? [] : {};
          }
        }
      }

    }

    this._data.next(this.opObj);

  }

  getTextForAlert(mode) {
    if (!mode) { return ''; }
    let fromatted_mode = mode.replace(/([A-Z])/g, ' $1').trim();
    fromatted_mode = fromatted_mode.charAt(0).toUpperCase() + fromatted_mode.slice(1);
    return fromatted_mode;
  }

  presentAlert(forceOverridePoints) {
    let mode = '';
    let typeCode = '';
    forceOverridePoints.forEach(point => {
      this.prevData = point.pointData.priorityArray.data = point.pointData.priorityArray.data || [];
      if (mode.indexOf(point.pointData.type) === -1) {
        mode += (mode ? ',' : '') + this.getTextForAlert(point.pointData.type);
      }
      typeCode = point.pointData.type;
      if (this.forcedOverrideData.has(point.pointData.type)) {
        let modeData = this.forcedOverrideData.get(point.pointData.type);
        modeData = modeData.concat({ data: point.data, existingPriorityArrData: this.prevData });
        this.forcedOverrideData.set(point.pointData.type, modeData);
      } else {
        this.forcedOverrideData.set(point.pointData.type,
          [].concat({ data: point.pointData.priorityArray.data, existingPriorityArrData: this.prevData }));
      }

    });
    const level = (this.prevData) ? this.stripHaystackTypeMapping(this.prevData[0]['level']) : undefined;
    let alert;
    if (this.popupOpened && this.forcedOverrideData.has(mode) && this.forcedOverrideData.get(mode).length > 1) {
      return;
    }
    mode = Array.from(new Set(mode.split(','))).toString();
    mode = mode.split('').reverse().join('')
      .replace(',', ' dna ')
      .split('').reverse().join('');
    this.popupOpened = true;
    setTimeout(async () => {
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        panelClass: 'fs-mat-dialog-container',
        width: '450px',
        disableClose: true,
        id: mode
      });
      // tslint:disable-next-line
      const htmlContent = `<div>Currently the ${mode} has following higher priorities in effect. \n CCU level ${level} \n Would you like to override those priorities? </div>`;
      dialogRef.componentInstance.title = 'Confirmation';
      dialogRef.componentInstance.htmlContent = this.dom.sanitize(SecurityContext.HTML, htmlContent);
      alert = undefined;
      alert = await dialogRef.afterClosed().toPromise();
      if (alert === 'confirm') {

        this.popupOpened = false;

        forceOverridePoints.forEach(pointData => {
          this.prevData = pointData.pointData.priorityArray.data = pointData.pointData.priorityArray.data || [];
          this.prevData.map(priorityArray => {
            if (priorityArray.level > 7 && priorityArray.level < 9) {
              const overrideLevel8 = {
                ref: pointData.data.ref,
                level: String(priorityArray.level),
                who: `web_${this.getUserName()}`,
                duration: '0ms',
                val: 'N'
              };

              this.writeDataToHaystack(overrideLevel8, pointData.pointData.type);
            }
          });
          this.writeDataToHaystack(pointData.data, pointData.pointData.type);
        });
      } else {

        // this.forcedOverrideData.delete(mode);
        // let sortedArray = this.sortPriorityArray(existingData.priorityArray.data);
        // let revertedValue = sortedArray[0].val;
        // this.revertPointValues.push({ 'mode': mode, 'val': revertedValue });
        // this.raiseEvent(this.revertPointValues);

        this.popupOpened = false;
        this.popUpCancelClick.next(true);
        this.forcedOverrideData.delete(mode);
        const sortedArray = this.sortPriorityArray(this.prevData);
        const revertedValue = sortedArray[0].val;
        this.revertPointValues.push({ mode:typeCode, val: revertedValue });
        this.raiseEvent(this.revertPointValues);
      }

    }, 0);
  }

  sortPriorityArray(InputArray: any) {
    const SortedArray = InputArray.map(
      (x) => {
        parseInt(x.level, 10);
        return x;
      });
    SortedArray.sort((a, b) => a.level - b.level);
    return SortedArray;
  }

  getBuildingComponents(buildingObj: any, Comptype: string) {
    return buildingObj.filter(res => res.type === Comptype);
  }

  getBuildingTunerPropertyId(buildingObj: any, zoneTags: any) {
    let pt = '';
    const TunerObj = buildingObj.filter(entity => {
      const matchedentity = entity.markers.indexOf('tuner') > -1;
      return matchedentity ? entity : null;
    });
    const Property = TunerObj[0].entities.filter(entity => {
      const matchEntity = zoneTags.every(elem => entity.markers.indexOf(elem) > -1);

      if (matchEntity) {
        pt = entity._id;
      }
    });
    return pt;
  }

  getPointInfobyTags(array, zoneTags: any) {
    const flat = [];
    if (!Array.isArray(array)) {
      array = [].concat(array);
    }
    array.forEach((rec) => {
      if (Array.isArray(rec['entities']) && rec['entities'].length > 0) {
        flat.push(...this.getPointInfobyTags(rec['entities'], zoneTags));
      } else {
        const found = (rec.markers && Array.isArray(rec.markers)) ? zoneTags.every(elem => rec.markers.indexOf(elem) > -1) : false;
        if (found) {
          flat.push(rec);
        }
      }
    });
    return flat;
  }

  // tslint:disable-next-line
  getPointIdbyTags(buildingObj: any, zoneTags: any, roomRef: string = undefined) {
    const pt = [];

    if (buildingObj && typeof buildingObj.buildings === 'undefined') {
      if (typeof buildingObj.entities !== 'undefined') {
        // tslint:disable-next-line
        buildingObj.entities.filter(entity => {
          const matchEntity = zoneTags.every(elem => entity.markers.indexOf(elem) > -1);

          if (matchEntity) {
            pt.push(entity._id);
          }
        })[0];
      } else {
        // tslint:disable-next-line
        buildingObj.filter(entity => {
          const matchEntity = zoneTags.every(elem => entity.markers.indexOf(elem) > -1);

          if (matchEntity) {
            pt.push(entity._id);
          }
        })[0];
      }
    } else {
      const equipObj = buildingObj.floors.map(floor => floor.entities.map(room =>
        room.entities.filter(equip => equip.referenceIDs.room === roomRef)));

      equipObj.map(equiplist => {
        equiplist.map(equip => equip.filter(device => {
          if (device.entities.length > 0) {
            return device.entities.filter(entity => {
              const matchEntity = zoneTags.every(elem => entity.markers.indexOf(elem) > -1);

              if (matchEntity) {
                pt.push(entity._id);
              }
            })[0];
          } else {
            const matchEntity = zoneTags.every(elem => device.markers.indexOf(elem) > -1);

            if (matchEntity) {
              pt.push(device._id);
            }
          }
        }));
      });
    }

    if (pt) {
      return pt;
    }
  }
  listZones = (_res: any) => {
    const self = this;
    if (_res && Array.isArray(_res) && _res.length) {
      for (let i = 0; i < _res['length']; i++) {
        if (_res[i]['type'] === 'room') {
          self.zones.push(_res[i]);
        }
      }
    }
    return _res;
  }

  listTuners = (_res: any) => {
    const self = this;
    // self.tunersInfo = new Map();

    for (let i = 0; i < _res['length']; i++) {
      const tags = ['tuner', 'equipRef'];
      const equipTags = ['equip', 'tuner', 'siteRef'];
      const zoneEquips = ['equip', 'zone'];
      const zoneEquipFound = (_res[i].markers && Array.isArray(_res[i].markers)) ?
        zoneEquips.every(elem => _res[i].markers.indexOf(elem) > -1) : false;
      if (zoneEquipFound) {
        self.equipZones.push(_res[i]);
      }
      const equipfound = (_res[i].markers && Array.isArray(_res[i].markers)) ?
        equipTags.every(elem => _res[i].markers.indexOf(elem) > -1) : false;
      if (equipfound) {
        this.equipId = _res[i]['_id'];
      }
      const systemTunersfound = (_res[i].markers && Array.isArray(_res[i].markers)) ?
        (tags.every(elem => _res[i].markers.indexOf(elem) > -1)) : false;
      if (systemTunersfound) {
        if (_res[i]['name']) {

          const names: Array<any> = _res[i]['name'].split('-') || [];
          const name = ((names.length) ? names[names.length - 1] : _res[i]['name']) + '_' + _res[i]['tunerGroup'];
          if (self.tunersInfo.has(name)) {
            let data = self.tunersInfo.get(name);
            if ((_res[i]['referenceIDs']['equip'] !== this.equipId)) {
              const found = _.find(self.zones, '_id', _res[i]['referenceIDs']['room']);
              if (found) {
                _res[i]['zoneName'] = found['name'];
              }
              // tslint:disable-next-line
              const names: Array<any> = _res[i]['name'].split('-') || [];
              const trimmedData: Array<any> = names.slice(1, -1);
              if (trimmedData.length > 1) {
                trimmedData.splice(1, 0, ['-']);
              }
              _res[i]['moduleName'] = trimmedData.join('');
              data = data.concat(_res[i]);
            }
            self.tunersInfo.set(name, data);
          } else {
            const tunerData: any[] = [];
            if ((_res[i]['referenceIDs']['equip'] !== this.equipId)) {
              const found = _.find(self.zones, '_id', _res[i]['referenceIDs']['room']);
              if (found) {
                _res[i]['zoneName'] = found['name'];
              }
              // tslint:disable-next-line
              const names: Array<any> = _res[i]['name'].split('-') || [];
              const trimmedData: Array<any> = names.slice(1, -1);
              if (trimmedData.length > 1) {
                trimmedData.splice(1, 0, ['-']);
              }

              _res[i]['moduleName'] = trimmedData.join('');

              tunerData.push(_res[i]);
              self.tunersInfo.set(name, tunerData);
            }

          }
        }
      }
    }

    // response.subscribe((_res) => {

    // })
    return _res;
  }

  pointIsWritable(buildingObj: any, id: string, roomRef?: string ) {
    if (typeof buildingObj.buildings === 'undefined') {
      if (typeof
        buildingObj.entities !== 'undefined') {
        const matchEntity = buildingObj.entities.find(entity => entity._id === id);
        if (matchEntity) {
          return matchEntity.markers.indexOf('writable') > -1;
        }
        return false;
      } else {
        const matchEntity = buildingObj.find(entity => entity._id === id);
        if (matchEntity) {
          return matchEntity.markers.indexOf('writable') > -1;
        }
        return false;
      }
    }  else {
      const equipObj = buildingObj.floors.map(floor => floor.entities
        .map(room => room.entities.filter(equip => equip.referenceIDs.room === roomRef)));

      equipObj.map(equiplist => {
        equiplist.map(equip => equip.filter(device => {
          if (device.entities.length > 0) {
            const matchEntity =  device.entities.find(entity => entity._id);
            return matchEntity.markers.indexOf('writable') > -1;
          } else {
            const matchEntity =  device.markers.find(entity => entity._id);
            return matchEntity.markers.indexOf('writable') > -1;
          }
        }));
      });
    }

    return false;
  }


  clearData() {
    this._data = new BehaviorSubject<any>(null);
    this.pointIdMaster.clear();
    this.dataService.setId(new Set());
    this.opObj = {};
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
