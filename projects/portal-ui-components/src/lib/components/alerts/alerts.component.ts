import { Component, OnInit,Input,
  ViewChild,SecurityContext, OnChanges} from '@angular/core';
import { MatPaginatorIntl, PageEvent, MatPaginator } from '@angular/material/paginator';
import { AlertsPopupComponent } from '../../components/alerts-popup/alerts-popup.component';
import { SiteService } from '../../services/site.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { forkJoin, Subject } from 'rxjs';
import * as moment from 'moment';
import { NotificationsService } from '../../services/notifications.service';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ObjectUtil } from '../../utils/object-util';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export class MatPaginatorIntlCro extends MatPaginatorIntl {
    itemsPerPageLabel = 'Rows per page';
  }

// export function CustomPaginator() {
//     const customPaginatorIntl = new MatPaginatorIntl();

//     customPaginatorIntl.itemsPerPageLabel = 'Rows per page';

//     return customPaginatorIntl;
// }

enum alertType {
    Severe = 2,
    Moderate = 1,
    Low = 0
};

@Component({
  selector: 'puc-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }
],
})
export class AlertsComponent implements OnInit, OnChanges {
  @Input() siteRefs: any = [];
  pageSize = 10;
  page = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  searchText: any = '';
  pageSizeOptions: number[] = [10, 20, 30, 40, 50];
  pageEvent: PageEvent;
  recordlength: any = 0;
  displayedColumns: string[] = [];

  severeAlertCount: number;
  moderateAlertCount: number;
  lowAlertCount: number;

  alertsData: any = [];
  displayData: any = [];

  displayAllSite: boolean;
  selectedsiteRefs: any = [];
  siteList: any = [];
  hideFixed = true;
  sortDirection = 'DESC';
  sortField = 'startTime';
  displayNoRecord = false;
  selectedRow = 0;
  userMutePref = [];
  searchTextChanged = new Subject<string>();
  @Input() showMute = false;
  @Input() showAlertType = false;
  @Input() allAlerts = false;
  @Input() autoRefreshSubject;
  @Input() isInternal:boolean = false;
  @Input() siteTimeZones = {};
  severity='';

  constructor(
      private siteService: SiteService,
      private dialog: MatDialog,
      private dom: DomSanitizer,
      private alert: AlertService,
      private authService: AuthenticationService,
      private notificationService: NotificationsService
  ) {

    this.searchTextChanged.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe((search) => {
        this.searchText = search.trim();
        this.searchCall()
      });


  }

  ngOnInit() {
    if(this.autoRefreshSubject) {
        this.autoRefreshSubject.subscribe(()=>{
            this.page = 0;
            this.fetchDataAndCount(this.selectedsiteRefs, this.searchText, this.page);
        })
    }

  }

  ngOnChanges() {
    if(this.siteRefs && this.siteRefs.length) {
        this.searchText = '';
        if(this.allAlerts) {
            this.severity = ''
        }
        else {
            this.severity = 'SEVERE,LOW,MODERATE';
        }
        this.fetchSelectedSiteData(this.siteRefs);
        this.displayedColumns =  this.getColumns(this.siteRefs.length>1);
    }
  }

  getColumns(multiSite) {
      const columns = ['Type', 'Time', 'siteName', 'EquipName', 'mAlertType', 'MuteState', 'Description']
    if(!multiSite) {
        columns.splice(columns.indexOf('siteName'),1);
    }
    if(!this.showMute) {
        columns.splice(columns.indexOf('MuteState'),1);
    }
    if(!this.showAlertType) {
        columns.splice(columns.indexOf('mAlertType'),1);
    }

    return columns;
  }

  fetchSelectedSiteData(siteId: string) {
      this.displayNoRecord = false;
      this.selectedsiteRefs = siteId;
      this.page = 0;
      this.fetchDataAndCount(this.selectedsiteRefs, this.searchText, this.page);

  }

  onChangePage(event: any) {
     // this.loaderService.active(true);
      this.displayNoRecord = false;

     if(this.pageSize != event.pageSize) {
        event.pageIndex = 0;
     }
     this.pageSize = event.pageSize;
      this.page = event.pageIndex;

      this.fetchDataAndCount(this.selectedsiteRefs, this.searchText, this.page);

  }


  sortData(sort: Sort) {
      this.sortDirection = undefined;
      this.sortField = undefined;
      // this.loaderService.active(true);
      if(sort.direction) {
        switch (sort.active) {
            case 'Type':
                this.sortDirection = sort.direction;
                this.sortField = 'mSeverity';
                break;
            case 'Time':
                this.sortDirection = sort.direction;
                this.sortField = 'startTime';
                break;
            case 'mAlertType':
                this.sortDirection = sort.direction;
                this.sortField = 'mAlertType';
                break;
            case 'Description':
                this.sortDirection = sort.direction;
                this.sortField = 'mMessage';
                break;
            case 'EquipName':
                this.sortDirection = sort.direction;
                this.sortField = 'equipName';
                break;
            case 'siteName':
                this.sortDirection = sort.direction;
                this.sortField = 'siteName';
                break;
            case 'Description':
                this.sortDirection = sort.direction;
                this.sortField = 'mMessage';
                break;
        }
    } else {
        this.sortDirection = 'DESC';
        this.sortField = 'startTime';
    }
    this.sort();
  }

  sort() {
      this.displayNoRecord = false;
      // this.paginator.pageIndex = 0;
      this.page = 0;
      this.fetchDataAndCount(this.selectedsiteRefs, this.searchText, this.page);
  }


  search(searchText: any) {
      this.searchTextChanged.next(searchText);


  }

  searchCall() {
    this.displayNoRecord = false;
    this.page = 0;
    this.fetchDataAndCount(this.selectedsiteRefs, this.searchText, this.page);
  }


  openAlertDetailsPopup(selectedRecord: any) {
      const dialogRef = this.dialog.open(AlertsPopupComponent, {
          panelClass: 'alert-details-popup',
          autoFocus: false,
          data: {
              title: selectedRecord.title,
              type: selectedRecord.type,
              fixed: selectedRecord.fixed,
              cancelrequired: false
          }
      });
      const htmlContent = `<div>` + selectedRecord.message + `</div><br/>
      <div>Alert Generated at : ` + selectedRecord.time + `</div>` +
          (selectedRecord.fixed ? `<div>Alert Fixed at : ` + selectedRecord.fixedTime + `</div>` : ``);
      dialogRef.componentInstance.htmlContent = this.dom.sanitize(SecurityContext.HTML, htmlContent);

  }


  toggleFixedData(event: any) {
      this.displayNoRecord = false;
      this.hideFixed = event;
      this.page = 0;
      this.fetchDataAndCount(this.selectedsiteRefs, this.searchText, this.page);
  };

  errHandle() {
    this.displayNoRecord = true;
    this.alertsData = [];
    this.displayData = [];
  }

  fetchDataAndCount(siteRefs?: any[],
    searchText?: string, page?: number) {

        const userPref = this.notificationService.getPreferencesForAccessSite();

        const alerts = this.siteService.getAlerts(this.severity, siteRefs,  this.isInternal,this.hideFixed,  searchText, page,
        this.pageSize, this.sortField, this.sortDirection);
        this.displayNoRecord = false;
        const alertsUnfixedCount = this.siteService.getAlertsCount({siteIds:siteRefs, isFixed: this.hideFixed, isInternal:this.isInternal});
        const siteSpecificSubscription = forkJoin(this.showMute?[alerts, alertsUnfixedCount,userPref]:[alerts, alertsUnfixedCount])
          .subscribe((res) => {
            const alertsdata:any = res[0];
            const alertsCount:any = res[1];
            const userPref = this.showMute ? res[2] : [];
            this.alertsData = [];
            this.displayData = [];
            this.userMutePref = userPref['data'] || [];
            this.recordlength = alertsdata.total;
            this.displayNoRecord = true;
            alertsdata.data.forEach(element => {
                let elementobj = {};
                switch (element.mSeverity) {
                    case 'SEVERE':
                    case 'INTERNAL_SEVERE':
                        elementobj['type'] = alertType.Severe;
                        break;
                    case 'MODERATE':
                    case 'INTERNAL_INFO':
                        elementobj['type'] = alertType.Moderate;
                        break;
                    case 'LOW':
                        case 'INTERNAL_LOW':
                        elementobj['type'] = alertType.Low;
                        break;
                }
                const starttime = Number(element.startTime);
               
                let timezone = this.siteTimeZones[element.siteId] ? this.siteTimeZones[element.siteId] : moment.tz.guess();
                elementobj['time'] = moment(starttime).tz(timezone).format('DD MMM YYYY HH:mm');
                elementobj['title'] = element.mTitle;
                elementobj['message'] = element.mMessage;
                elementobj['fixed'] = element.isFixed;
                elementobj['siteId'] = element.siteId;
                elementobj['siteName'] = element.siteName;
                elementobj['ccuName'] = element.ccuName;
                elementobj['equipName'] = element.equipName;
                elementobj['equipId'] = element.equipId;
                elementobj['definitionId'] = element.definitionId;
                elementobj['ccuId'] = element.ccuId;
                elementobj['mAlertType'] = element.mAlertType
                if(this.showMute)
                    elementobj = this.getMuteValueByEquipId(elementobj);
                if (element.isFixed) {
                    const endtime = Number(element.endTime);
                    elementobj['fixedTime'] = moment(endtime).tz(timezone).format('DD MMM YYYY HH:mm');
                }
                else
                    elementobj['fixedTime'] = 0;
                this.alertsData.push(elementobj);
            });
            this.displayData = Array.from(this.alertsData);
            this.severeAlertCount = alertsCount.severity['SEVERE'] || 0;
            this.moderateAlertCount = alertsCount.severity['MODERATE'] || 0;
            this.lowAlertCount = alertsCount.severity['LOW'] || 0;
            // this.loaderService.active(false);
            siteSpecificSubscription.unsubscribe();
          },
          (err)=> {
              this.errHandle();
          });

  }

getMuteValueByEquipId(alert) {
    alert['disableDateTimeFrom'] = null;
    alert['disableDateTimeThru'] = null;
    const defIdx:any = this.userMutePref.findIndex(p=>p.siteAlertDefinitionId == alert.definitionId);
    if(defIdx > -1 && this.userMutePref[defIdx].mutedDevices && this.userMutePref[defIdx].mutedDevices.length > 0) {
        const def = this.userMutePref[defIdx];
        const muteDeviceIdx = def.mutedDevices.findIndex(m=>m.deviceId == alert.ccuId);
        if(muteDeviceIdx > -1 && def.mutedDevices[muteDeviceIdx]['mutedEquips'] && def.mutedDevices[muteDeviceIdx]['mutedEquips'].length) {
            const muteDevice = def.mutedDevices[muteDeviceIdx];
            const muteEquipidx = muteDevice.mutedEquips.findIndex(m=>m.equipId == alert.equipId);
            if(muteEquipidx > -1) {
                alert['disableDateTimeFrom'] = muteDevice.mutedEquips[muteEquipidx]['muteDateTimeFrom']?
                moment(muteDevice.mutedEquips[muteEquipidx]['muteDateTimeFrom']): muteDevice.mutedEquips[muteEquipidx]['muteDateTimeFrom'] ;
                alert['disableDateTimeThru'] = muteDevice.mutedEquips[muteEquipidx]['muteDateTimeThru']?
                moment(muteDevice.mutedEquips[muteEquipidx]['muteDateTimeThru']): muteDevice.mutedEquips[muteEquipidx]['muteDateTimeThru'] ;
            }
        }

        // ccu device shallow muted
        else if(muteDeviceIdx > -1) {
            alert['disableDateTimeFrom'] = def.mutedDevices[muteDeviceIdx]['muteDateTimeFrom']?
                moment(def.mutedDevices[muteDeviceIdx]['muteDateTimeFrom']): def.mutedDevices[muteDeviceIdx]['muteDateTimeFrom'] ;
                alert['disableDateTimeThru'] = def.mutedDevices[muteDeviceIdx]['muteDateTimeThru']?
                moment(def.mutedDevices[muteDeviceIdx]['muteDateTimeThru']): def.mutedDevices[muteDeviceIdx]['muteDateTimeThru'] ;
        }
    }
    return alert;

}

  onDateChanged(res: any,alert) {
    const selectedrange = {
      from: res.range ? moment(res.range.split(',')[0]) : null,
      to: res.range ? moment(res.range.split(',')[1]) : null
    }
   this.updateUserMutePref(alert,selectedrange,res.type);

  }

  updateUserMutePref(alert,selectedrange,type) {
    const equipObj = {
        equipId: alert.equipId,
        muteDateTimeFrom: selectedrange.from?selectedrange.from.utc().format():null,
        muteDateTimeThru: selectedrange.to?selectedrange.to.utc().format():null
    }
    let reqBody;
    let tempMutedDevices = [];
    const userMutePrefTemp = ObjectUtil.deepClone(this.userMutePref);
    const defIndex = userMutePrefTemp.findIndex(p=>p.siteAlertDefinitionId == alert.definitionId);
    if(defIndex == -1) {
        tempMutedDevices = type=='ccu'? [
              {
                deviceId: alert.ccuId,
                muteDateTimeFrom: selectedrange.from?selectedrange.from.utc().format():null,
                muteDateTimeThru: selectedrange.to?selectedrange.to.utc().format():null,
                mutedEquips: []
              }
            ] : [{
                deviceId: alert.ccuId,
                mutedEquips: [equipObj]
              }]
    }
    else if(userMutePrefTemp[defIndex].mutedDevices && userMutePrefTemp[defIndex].mutedDevices.length > 0) {
        const mutedDevices = userMutePrefTemp[defIndex].mutedDevices;
        const muteDeviceIdx = mutedDevices.findIndex(m=>m.deviceId == alert.ccuId);
        if(muteDeviceIdx > -1) {
            if(type == 'ccu') {
                mutedDevices[muteDeviceIdx]['muteDateTimeFrom'] = equipObj['muteDateTimeFrom'];
                mutedDevices[muteDeviceIdx]['muteDateTimeThru'] =  equipObj['muteDateTimeThru'];
            } else {
                const equipInx = mutedDevices[muteDeviceIdx].mutedEquips.findIndex(m=>m.equipId == alert.equipId);
                if(equipInx > -1) {
                    if(!selectedrange.to || !selectedrange.from) {
                        mutedDevices[muteDeviceIdx].mutedEquips.splice(equipInx, 1);
                        if(!mutedDevices[muteDeviceIdx].mutedEquips.length) {
                            userMutePrefTemp[defIndex].mutedDevices = mutedDevices.splice(muteDeviceIdx,1)
                        }
                    } else {
                        mutedDevices[muteDeviceIdx].mutedEquips[equipInx] = equipObj
                    }

                } else {
                    mutedDevices[muteDeviceIdx].mutedEquips.push(equipObj)
                }
            }

        } else {
            mutedDevices.push(
                type=='ccu'?{
                    deviceId: alert.ccuId,
                    muteDateTimeFrom: equipObj['muteDateTimeFrom'],
                    muteDateTimeThru: equipObj['muteDateTimeThru'],
                    mutedEquips: []
                  } : {
                    deviceId: alert.ccuId,
                    mutedEquips:[equipObj]
                  }
            )
        }
    } else {


        userMutePrefTemp[defIndex].mutedDevices = [
            type=='ccu'? {
                deviceId: alert.ccuId,
                muteDateTimeFrom: equipObj['muteDateTimeFrom'],
                muteDateTimeThru: equipObj['muteDateTimeThru'],
                mutedEquips: []
            }: {
                deviceId: alert.ccuId,
                mutedEquips: [equipObj]
            }
        ]
    }

    reqBody = {
        mutedDevices : defIndex > -1?userMutePrefTemp[defIndex].mutedDevices : tempMutedDevices
    }

    reqBody.mutedDevices = reqBody.mutedDevices.filter(device=> {
        return device.mutedEquips.length || device['muteDateTimeFrom'] || device['muteDateTimeThru'];
    })
    const userId = this.authService.getUser() ? this.authService.getUser().userId : null;
      this.notificationService.setPrefreneceForSite(alert.siteId,userId,alert.definitionId,reqBody).subscribe((res)=>{
        alert['disableDateTimeFrom'] = selectedrange.from;
        alert['disableDateTimeThru'] = selectedrange.to;
        if(defIndex > -1) {
            this.userMutePref[defIndex]['mutedDevices'] = reqBody.mutedDevices;
        } else {
            this.userMutePref.push(res);
        }

        this.refreshMutevalues();
        this.alert.success('User preference updated successfully');
      }, err=>{
          this.alert.error(err['error'] || 'Something went wrong');
      })
  }

  refreshMutevalues() {
      this.displayData = this.displayData.map(a=>{
        return this.getMuteValueByEquipId(a);
      })
  }
}
