import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { PucSliderInputOutputData } from '../../models/user-intnet/puc-slider-input-output-data.model';
import { HelperService } from '../../services/hs-helper.service';
import { SiteService } from '../../services/site.service';
import { SliderUserIntentService } from '../../services/slider-user-intent.service';
import { ObjectUtil } from '../../utils/object-util';
import { MatDialog } from '@angular/material/dialog';
import { SchedulerModalComponent } from '../scheduler-modal/scheduler-modal.component';

@Component({
  selector: 'puc-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() scheduleInfo: any;
  @Input() buildingScheduleInfo: any;
  @Input() scheduleId: string;
  // tslint:disable-next-line
  @Input('scheduleType') scheduleTypeVal: any;
  @Input() siteId: string;
  @Input() refId: string;
  @Input() refType: string;
  @ViewChild('scheduler', { static: true }) eRef: ElementRef;
  @Input() buildingLimits: any;
  @Input() sliderInput: PucSliderInputOutputData;
  @Input() zoneName: string;
  @Input() defaultLimits: any;
  @Input() allZoneSchData: any;
  @Input() sliderDisplayFlag: boolean;
  @Input() siteTz;
  // tslint:disable-next-line
  @Output() onScheduleChange = new EventEmitter<any>();

  week: any[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  hours: any[];
  minutes: any[];

  scheduleState = '';
  isModalFixed = true;

  modalWidth: any;

  editScheduleData: any;

  linkedScheduleIndexArr: any = [];


  constructor(

    private helperService: HelperService,
    private siteService: SiteService,
    public dialog: MatDialog,
    private sliderUserIntentService: SliderUserIntentService
  ) {

  }

  ngOnInit() {
    this.hours = Array.from(Array(12), (x, i) => i);
    this.minutes = Array.from(Array(8), (x, i) => i);
    this.sortScheduleByTimeAndDay();
  }

  ngOnChanges(changes: SimpleChanges) {
    const scheduleInfo: SimpleChange = changes.scheduleInfo;
    const allZoneSchData: SimpleChange = changes.allZoneSchData;

    if (scheduleInfo && scheduleInfo.currentValue) {
      this.scheduleInfo = scheduleInfo.currentValue;
      this.recreateOverlays();
    }
    if (allZoneSchData && allZoneSchData.currentValue) {
      this.allZoneSchData = allZoneSchData.currentValue;
      this.recreateOverlays();
    }

  }

  recreateOverlays() {
    const overlays = this.eRef.nativeElement.querySelectorAll('.overlay');
    overlays.forEach((overlay) => {
      overlay.parentNode.removeChild(overlay);
    });
    if (this.scheduleInfo) {
      this.updateScheduler();
    }
  }

  ngAfterViewInit() {
    if (this.scheduleInfo) {
      const day = this.eRef.nativeElement.querySelector('#' + this.week[0]).children;
      if (day) {
        this.updateScheduler();
      }
    }
  }

  formatData(scheduleInfo: string) {
    if (scheduleInfo && typeof scheduleInfo !== 'undefined') {
      return this.helperService.stripHaystackTypeMapping(JSON.parse(scheduleInfo.replace(/([''])?([a-z0-9A-Z_]+)([''])?:/g, '"$2": ')));
    }
  }

  sortScheduleByTimeAndDay() {
    const arr1 = (a, b) => {
      if (a.day == b.day) {
        return a.sthh - b.sthh;
      }
      return a.day - b.day;
    }
    if (this.scheduleInfo)
      this.scheduleInfo.sort(arr1);
  }



  addScheduleClick() {
    this.scheduleState = 'new';
    this.isModalFixed = true;
    this.modalWidth = '80';
    this.openSchedulerModal();
  }

  timeLable() {
    let currentDate;
    if(this.siteTz) {
      const tz: string = this.siteService.getIANATimeZone(this.siteTz);
      currentDate = moment().tz(tz)
    } else {
      currentDate = moment()
    }
    const currentTimeInHrs = currentDate.format('HH');
    const currentTimeInMins = currentDate.format('mm');
    let currentDay = currentDate.day();
    const labelPos = ((((parseInt(currentTimeInHrs, 10) * 60) + parseInt(currentTimeInMins, 10))) * (6 / 15));
    currentDay = currentDay == 0 ? 7 : currentDay;
    const dayentity = this.eRef.nativeElement.querySelector('#' + this.week[currentDay - 1]);
    const day = dayentity ? dayentity.children[0] : undefined;
    if (!(this.eRef.nativeElement.querySelector('.timeLable'))) {
      const timeLable = document.createElement('div');
      timeLable.className = 'timeLable';
      timeLable.style.marginLeft = `${labelPos + 72}px`;
      if (day)
        day.appendChild(timeLable);
    }
  }

  updateScheduler() {
    if (this.scheduleInfo) {
      this.checkLinkedSchedule();
      document.querySelectorAll('.scheduleBreakLine').forEach(el => el.remove());
      for (let i = 0; i < this.scheduleInfo.length; i++) {
        const scheduleEntity = this.scheduleInfo[i];
        const startTime = moment(scheduleEntity.sthh + ':' + scheduleEntity.stmm, 'HH:mm');
        const endTime = moment(scheduleEntity.ethh + ':' + scheduleEntity.etmm, 'HH:mm');
        const daySelected = scheduleEntity.day;
        const startTd = Math.trunc(scheduleEntity.sthh / 2) + 1;
        const coolVal = scheduleEntity.coolVal;
        const heatVal = scheduleEntity.heatVal;
        const timeDiff = Math.abs((startTime).diff(endTime) / (60 * 1000));
        const borderCheck = this.linkedScheduleIndexArr.find(obj => {
          if (obj.idx == i) {
            return 1;
          }
        })
        this.addOverlay(scheduleEntity, startTime, endTime, daySelected, startTd, coolVal, heatVal, timeDiff, borderCheck);
        this.removeDulpicateOverlay(startTd, daySelected);
        if (startTime > endTime) {
          this.removeDulpicateOverlay(1, daySelected + 1);
        }
      }
      this.timeLable();
    }
  }

  editSchedule(event: Event) {
    const editString = (event.currentTarget as HTMLElement).getElementsByTagName('p')[0].innerText.split(',');
    for (let i = 0; i < 5; i++) {
      if (editString[i].length < 2) {
        editString[i] = `0${editString[i]}`;
      }
    }
    const endTime = moment(`${editString[2]}:${editString[3]}`, 'HH:mm');
    const startTime = moment(`${editString[0]}:${editString[1]}`, 'HH:mm');
    const day = editString[4].toString().trim();
    this.editScheduleData = this.scheduleObj(`${editString[0]}`, `${editString[1]}`, `${editString[2]}`, `${editString[3]}`, `${day}`, `${editString[5]}`, `${editString[6]}`);
    if ((endTime).isBefore(startTime)) {
      let nextDay;
      if (day == '6') {
        nextDay = '0';
      } else {
        nextDay = (parseInt(day, 10) + 1).toString();
      }
      this.editScheduleData['startTime'] = startTime;
      this.editScheduleData['endTime'] = endTime;
      this.editScheduleData['effectedDays'] = [day, nextDay]
    } else {
      this.editScheduleData['startTime'] = startTime;
      this.editScheduleData['endTime'] = endTime;
      this.editScheduleData['effectedDays'] = [day];
    }
    this.scheduleState = 'edit';
    this.openSchedulerModal();
  }

  saveScheduleDataToHaystack() {
    const arr = (a, b) => {
      return a.day - b.day;
    }
    this.scheduleInfo.sort(arr);
    this.scheduleInfo = this.scheduleInfo.map(sch => {
      return ObjectUtil.removeKey('isSplit', sch);
    })
    let days = JSON.stringify(this.scheduleInfo).replace(/['"]+/g, '');
    days = days.replace(/(:[\d\.]+)(,)/g, '$1 ');

    this.siteService.updateSchedule(this.scheduleId, this.refId, days, this.refType, this.siteId).subscribe(res => {
    });
  }


  scheduleObj(startTimehh: string,
    startTimemm: string,
    endTimehh: string,
    endTimemm: string,
    day: string,
    coolVal: string,
    heatVal: string,
    tempSthh?: string, tempStmm?: string, tempEthh?: string, tempEtmm?: string) {
    return {
      sthh: startTimehh,
      stmm: startTimemm,
      ethh: endTimehh,
      etmm: endTimemm,
      day,
      coolVal,
      heatVal,
      tempSthh,
      tempStmm,
      tempEthh,
      tempEtmm
    }
  }

  addOverlay(
    scheduleEntity: any,
    startTime: any,
    endTime: any,
    daySelected: number,
    startTd: number,
    coolVal: number,
    heatVal: number,
    timeDiff: number,
    borderCheck: any) {
    if (startTime > endTime) {
      const overlayArr = [startTime, endTime];
      for (let i = 0; i < overlayArr.length; i++) {
        if (i == 1) {
          daySelected = (daySelected > 6) ? 0 : daySelected;
        }
        const time = overlayArr[i] == startTime ? '24:00' : '00:00';
        const timeDiff = Math.abs((overlayArr[i]).diff(moment(time, 'HH:mm')) / (60 * 1000));
        const overlay = document.createElement('div');
        overlay.innerHTML = `<span style= 'color: #e78869ff'> ${heatVal}</span>\
                      <span style= 'color: #6296b7ff'> ${coolVal}</span>\
                      <p>${startTime.get('hour')},${startTime.get('minute')},${endTime.get('hour')},${endTime.get('minute')}, ${overlayArr[i] == startTime ? daySelected : (daySelected == 0 ? 6 : (daySelected - 1))},${coolVal},${heatVal}</p>`;
        overlay.className = 'overlay';
        overlay.style.width = (timeDiff / 15) * 6 + 'px';
        overlay.addEventListener('click', (event: Event) => {
          this.isModalFixed = true;
          this.editSchedule(event);
        });
        const dayentity = this.eRef.nativeElement.querySelector('#' + this.week[parseInt(daySelected.toString(), 10)]);
        const day = dayentity ? dayentity.children : undefined;

        if (borderCheck != undefined && i == 1) {
          overlay.style.borderRight = '3px solid rgba(169,169,169,0.8)';
          overlay.style.boxSizing = 'border-box';
          overlay.style.zIndex = '1';
        }
        if(day) {
          if (i == 0) {
            const breakRight = document.createElement('div');
            breakRight.className = 'scheduleBreakLine';
            breakRight.innerHTML = `<img src='../../../../../assets/images/BREAK_LINE_RIGHT_SVG.svg'/>`;
            breakRight.style.width = '4px';
            breakRight.style.marginLeft = '-5px';
            breakRight.style.position = 'relative';
            breakRight.style.height = '30px';
            day[13].children[0].appendChild(breakRight);
          }
          else if (i == 1) {
            const breakLeft = document.createElement('div');
            breakLeft.className = 'scheduleBreakLine';
            breakLeft.innerHTML = `<img src='../../../../../assets/images/BREAK_LINE_LEFT_SVG.svg'/>`;
            breakLeft.style.width = '4px';
            breakLeft.style.marginLeft = '-10px';
            breakLeft.style.position = 'relative';
            breakLeft.style.height = '30px';
            day[1].children[1].appendChild(breakLeft);
          }
        }
        if (day) {
          if ((overlayArr[i] == startTime ? scheduleEntity.sthh : 0) % 2 == 0) {
            switch (overlayArr[i] == startTime ? parseInt(scheduleEntity.stmm, 10) : 0) {
              case 0: {
                day[startTd].children[0].appendChild(overlay);
                break;
              }
              case 15: {
                day[startTd].children[1].appendChild(overlay);
                break;
              }
              case 30: {
                day[startTd].children[2].appendChild(overlay);
                break;
              }
              case 45: {
                day[startTd].children[3].appendChild(overlay);
                break;
              }
            }
          } else {
            switch (parseInt(scheduleEntity.stmm, 10)) {
              case 0: {
                day[startTd].children[4].appendChild(overlay);
                break;
              }
              case 15: {
                day[startTd].children[5].appendChild(overlay);
                break;
              }
              case 30: {
                day[startTd].children[6].appendChild(overlay);
                break;
              }
              case 45: {
                day[startTd].children[7].appendChild(overlay);
                break;
              }
            }
          }
        }
        daySelected++;
        startTd = 1;
      }
    }
    else {
      const overlay = document.createElement('div');
      overlay.innerHTML = `<span style= 'color: #e78869ff'> ${heatVal}</span>\
                      <span style= 'color: #6296b7ff'> ${coolVal}</span>\
                      <p>${startTime.get('hour')},${startTime.get('minute')},${endTime.get('hour')},${endTime.get('minute')}, ${daySelected},${coolVal},${heatVal}</p>`;
      overlay.className = 'overlay'
      overlay.style.width = (timeDiff / 15) * 6 + 'px';
      if (borderCheck != undefined) {
        overlay.style.borderRight = '3px solid rgba(169,169,169,0.8)';
        overlay.style.boxSizing = 'border-box';
        overlay.style.zIndex = '1';
      }
      overlay.addEventListener('click', (event: Event) => {
        this.isModalFixed = true;
        this.editSchedule(event);
      });

      const dayentity = this.eRef.nativeElement.querySelector('#' + this.week[parseInt(daySelected.toString(), 10)]);
      const day = dayentity ? dayentity.children : undefined;
      if (day) {
        if (parseInt(scheduleEntity.sthh, 10) % 2 == 0) {
          switch (parseInt(scheduleEntity.stmm, 10)) {
            case 0: {
              if (parseInt(scheduleEntity.sthh, 10) == 0 && parseInt(scheduleEntity.stmm, 10) == 0) {
                overlay.style.marginLeft = '-16px';
                day[startTd].children[3].appendChild(overlay);
              }
              else {
                day[startTd].children[0].appendChild(overlay);
              }
              break;
            }
            case 15: {
              day[startTd].children[1].appendChild(overlay);
              break;
            }
            case 30: {
              day[startTd].children[2].appendChild(overlay);
              break;
            }
            case 45: {
              day[startTd].children[3].appendChild(overlay);
              break;
            }
          }
        } else {
          switch (parseInt(scheduleEntity.stmm, 10)) {
            case 0: {
              day[startTd].children[4].appendChild(overlay);
              break;
            }
            case 15: {
              day[startTd].children[5].appendChild(overlay);
              break;
            }
            case 30: {
              day[startTd].children[6].appendChild(overlay);
              break;
            }
            case 45: {
              day[startTd].children[7].appendChild(overlay);
              break;
            }
          }
        }
      }
    }
  }

  checkLinkedSchedule() {
    this.linkedScheduleIndexArr = [];
    this.sortScheduleByTimeAndDay();
    for (let i = 0; i < this.scheduleInfo.length; i++) {
      if (parseInt(this.scheduleInfo[i].sthh, 10) < parseInt(this.scheduleInfo[i].ethh, 10)) {
        if (i != this.scheduleInfo.length - 1
          && parseInt(this.scheduleInfo[i].ethh, 10) == parseInt(this.scheduleInfo[i + 1].sthh, 10)
          && parseInt(this.scheduleInfo[i].etmm, 10) == parseInt(this.scheduleInfo[i + 1].stmm, 10)
          && parseInt(this.scheduleInfo[i].day, 10) == parseInt(this.scheduleInfo[i + 1].day, 10)) {
          this.linkedScheduleIndexArr.push({ idx: i, bar: 'right' });
        }
      }
      else if (parseInt(this.scheduleInfo[i].sthh, 10) > parseInt(this.scheduleInfo[i].ethh, 10)) {
        if (parseInt(this.scheduleInfo[i].day, 10) == 6) {
          if (parseInt(this.scheduleInfo[i].ethh, 10) == parseInt(this.scheduleInfo[0].sthh, 10)
            && parseInt(this.scheduleInfo[i].etmm, 10) == parseInt(this.scheduleInfo[0].stmm, 10)
            && parseInt(this.scheduleInfo[i].day, 10) != parseInt(this.scheduleInfo[0].day, 10)) {
            this.linkedScheduleIndexArr.push({ idx: i, bar: 'right' });
          }
        }
        else {
          if (i != this.scheduleInfo.length - 1
            && parseInt(this.scheduleInfo[i].ethh, 10) == parseInt(this.scheduleInfo[i + 1].sthh, 10)
            && parseInt(this.scheduleInfo[i].etmm, 10) == parseInt(this.scheduleInfo[i + 1].stmm, 10)
            && parseInt(this.scheduleInfo[i].day, 10) != parseInt(this.scheduleInfo[i + 1].day, 10)) {
            this.linkedScheduleIndexArr.push({ idx: i, bar: 'right' });
          }
        }
      }
    }
  }

  removeDulpicateOverlay(startTd, daySelected) {
    daySelected = daySelected > 6 ? 0 : daySelected;
    const dayentity = this.eRef.nativeElement.querySelector('#' + this.week[parseInt(daySelected.toString(), 10)]);
    const day = dayentity ? dayentity.children : undefined;
    const duplicateOverlay = day ? Array.from(day[startTd].children) : undefined;
    if (duplicateOverlay) {
      duplicateOverlay.forEach(e => {
        const targetTd = (e as HTMLInputElement);

        while (targetTd.childNodes.length > 1) {
          targetTd.removeChild(targetTd.firstChild)
        }
      });
    }
  }

  // closeModal
  closeModal() {
    this.scheduleState = '';
    this.sliderUserIntentService.clearData();
  }


  // callback event for add/delete/edit schedule
  scheduleChanged(event) {
    if (event) {
      this.scheduleInfo = event;
      this.saveScheduleDataToHaystack()
    }
    this.updateScheduler();
    this.closeModal();

  }

  openSchedulerModal() {
    const dialogRef:any = this.dialog.open(SchedulerModalComponent);
    dialogRef.componentInstance.sliderDisplayFlag = this.sliderDisplayFlag;
    dialogRef.componentInstance.buildingLimits = this.buildingLimits;
    dialogRef.componentInstance.sliderInput = this.sliderInput;
    dialogRef.componentInstance.zoneName = this.zoneName;
    dialogRef.componentInstance.defaultLimits = this.defaultLimits;
    dialogRef.componentInstance.scheduleType = this.scheduleTypeVal;
    dialogRef.componentInstance.siteId = this.siteId;
    dialogRef.componentInstance.type = this.scheduleState;
    dialogRef.componentInstance.scheduleInfo = ObjectUtil.deepClone(this.scheduleInfo);
    dialogRef.componentInstance.editScheduleData = this.editScheduleData;
    dialogRef.componentInstance.buildingScheduleInfo = this.buildingScheduleInfo;
    dialogRef.componentInstance.allZoneData = this.allZoneSchData;
    dialogRef.componentInstance.refId = this.refId;

    dialogRef.componentInstance.scheduleChanges.subscribe((zoneSch)=>{
      if(zoneSch) {
        this.allZoneSchData = zoneSch;
      }
    })


    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.scheduleChanged(result);
      } else {
        this.updateScheduler();
        // this.recreateOverlays();
      }
      this.closeModal();
    });
  }
}
