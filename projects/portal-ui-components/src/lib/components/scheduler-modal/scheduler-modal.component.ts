/* tslint:disable */
import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { PucSliderInputOutputData } from '../../models/user-intnet/puc-slider-input-output-data.model';
import { PucUserIntentTempSliderValueChangedIds } from '../../models/user-intnet/puc-user-intent-temp-slider-value-changed-ids.model';
import { PucUserLimitDataSources } from '../../models/user-intnet/puc-user-limit-data-sources.enum';
import { HelperService } from '../../services/hs-helper.service';
import { SiteService } from '../../services/site.service';
import { SliderUserIntentService } from '../../services/slider-user-intent.service';
import { DateUtil } from '../../utils/date-util';
import { ObjectUtil } from '../../utils/object-util';
import { MatDialogRef } from '@angular/material/dialog';
import { SchedulerService } from '../../services/scheduler.service';

@Component({
  selector: 'puc-scheduler-modal',
  templateUrl: './scheduler-modal.component.html',
  styleUrls: ['./scheduler-modal.component.scss']
})
export class SchedulerModalComponent implements OnInit, AfterContentChecked {
  @Input('buildingLimits') buildingLimits: any;
  @Input('sliderInput') sliderInput: PucSliderInputOutputData;
  @Input() sliderDisplayFlag: boolean;
  @Input('zoneName') zoneName: string;
  @Input('scheduleType') scheduleType: any;
  @Input('buildingScheduleInfo') buildingScheduleInfo: any;
  @Input('siteId') siteId: string;
  @Input() scheduleInfo;
  @Input() editScheduleData;
  @Input('type') type: string = 'new';
  @Input('defaultLimits') defaultLimits: any;
  @Input('allZoneSchData') allZoneData: any;
  @Input('refId') refId;

  @Output() scheduleChanges = new EventEmitter();

  isTempValueFirstTime: boolean = true;

  week: any[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  timerArray: any[] = [];
  dayLable: any[] = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];

  startTime = `08:00`;
  endTime = `17:30`;

  coolingTempVal: number;
  heatingTempVal: number;

  alertMessage: string = '';

  totalDaysSelected = [];

  isConfirmDelete: boolean;

  tempScheduleInfo = [];

  allSelectedDayCheckTimeArray: any[];
  curStartTime: moment.Moment;
  curEndTime: moment.Moment;
  //scheduleFlag: number;

  arrayCheckTime: any;
  arrayCheckDay: any;
  decisionArray = [];
  alertArr = [];
  zonesTrimBuilding = {};
  isZoneTrim: boolean = false;
  tempBuildingScheduleInfo: any[];
  isSingleZoneBuOvernight: boolean = false;
  subscriptions = {};
  constructor(
    private sliderUserIntentService: SliderUserIntentService,
    private helperService: HelperService,
    private schedulerService: SchedulerService,
    public dialogRef: MatDialogRef<SchedulerModalComponent>,
    private siteService: SiteService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {

    this.timeDropDown();
    if (this.type == 'edit') {
      this.startTime = this.editScheduleData.sthh + ':' + this.editScheduleData.stmm;
      this.endTime = this.editScheduleData.ethh + ':' + this.editScheduleData.etmm;
      this.totalDaysSelected.push(parseInt(this.editScheduleData.day));
    }
  }

  ngAfterContentChecked() {
    let Ref;
    if (parseInt(this.scheduleType) == 0) {
      Ref = this.siteId;
    }
    else if (parseInt(this.scheduleType) == 1) {
      Ref = this.zoneName;
    }

    if (this.buildingLimits && this.buildingLimits.min && this.buildingLimits.max && this.sliderInput && this.sliderInput.desiredTempHeating
      && this.sliderInput.desiredTempCooling
      && this.sliderInput.heatingUserLimitMin && this.sliderInput.heatingUserLimitMax
      && this.sliderInput.coolingUserLimitMin && this.sliderInput.coolingUserLimitMax
      && this.sliderInput.heatingDeadband && this.sliderInput.coolingDeadband
    ) {
      let sliderValueFromZoneSettings: PucSliderInputOutputData = {
        currentTemp: undefined,
        desiredTempHeating: undefined,
        desiredTempCooling: undefined,
        heatingUserLimitMin: undefined,
        heatingUserLimitMax: undefined,
        coolingUserLimitMin: undefined,
        coolingUserLimitMax: undefined,
        coolingDeadband: undefined,
        heatingDeadband: undefined,
      };
      sliderValueFromZoneSettings.currentTemp = this.sliderInput.currentTemp;
      if (this.type == 'edit') {
        sliderValueFromZoneSettings.desiredTempHeating = this.editScheduleData ? this.editScheduleData.heatVal : this.sliderInput.desiredTempHeating;
        sliderValueFromZoneSettings.desiredTempCooling = this.editScheduleData ? this.editScheduleData.coolVal : this.sliderInput.desiredTempCooling;
      }
      else {
     
      let deadbandMainatainence = (parseFloat(this.defaultLimits.desiredTempCooling) - parseFloat(this.defaultLimits.desiredTempHeating))

      let deadBandMove = ((parseFloat(this.sliderInput.heatingDeadband) == 0 ? 1 : parseFloat(this.sliderInput.heatingDeadband)) + (parseFloat(this.sliderInput.coolingDeadband) == 0 ? 1 : parseFloat(this.sliderInput.coolingDeadband)))

      let movingSliderValueForDeadband = deadbandMainatainence - deadBandMove

      if (movingSliderValueForDeadband < 0) {
        movingSliderValueForDeadband = Math.abs(movingSliderValueForDeadband);

        sliderValueFromZoneSettings.desiredTempHeating = (parseFloat(this.defaultLimits.desiredTempHeating) - (movingSliderValueForDeadband / 2)).toString();

        sliderValueFromZoneSettings.desiredTempCooling = (parseFloat(this.defaultLimits.desiredTempCooling) + (movingSliderValueForDeadband / 2)).toString();
      }
      else {

        sliderValueFromZoneSettings.desiredTempHeating = this.defaultLimits.desiredTempHeating;
        sliderValueFromZoneSettings.desiredTempCooling = this.defaultLimits.desiredTempCooling;

      }
    }
    
      sliderValueFromZoneSettings.heatingUserLimitMin = this.sliderInput.heatingUserLimitMin;
      sliderValueFromZoneSettings.heatingUserLimitMax = this.sliderInput.heatingUserLimitMax;
      sliderValueFromZoneSettings.coolingUserLimitMin = this.sliderInput.coolingUserLimitMin;
      sliderValueFromZoneSettings.coolingUserLimitMax = this.sliderInput.coolingUserLimitMax;
      sliderValueFromZoneSettings.heatingDeadband = this.sliderInput.heatingDeadband;
      sliderValueFromZoneSettings.coolingDeadband = this.sliderInput.coolingDeadband;

      if (this.sliderInput) {

        if (this.sliderUserIntentService.isEquivalent(this.sliderInput, sliderValueFromZoneSettings)) {
          let dataforuserIntentslider;

          let datalastupdatedby = this.sliderUserIntentService.getLatestUpdatedBy(Ref + '_scheduler');
          if (datalastupdatedby)
            dataforuserIntentslider = this.sliderUserIntentService.getData(datalastupdatedby, Ref + '_scheduler');
          if (dataforuserIntentslider) {
            if (!this.sliderUserIntentService.isEquivalent(this.sliderInput, dataforuserIntentslider)) {
              this.sliderUserIntentService.setData(dataforuserIntentslider, PucUserLimitDataSources.EXTERNAL_DEVICE, Ref + '_scheduler');
              this.sliderInput = dataforuserIntentslider;
            }
            else {
              let dataupdatedfirstgo = this.sliderUserIntentService.getLatestUpdatedBy(Ref + '_scheduler');
              if (!dataupdatedfirstgo) {
                this.sliderUserIntentService.setData(dataforuserIntentslider, PucUserLimitDataSources.EXTERNAL_DEVICE, Ref + '_scheduler');
                this.sliderInput = dataforuserIntentslider;
              }
            }
          }
          else {
            this.sliderUserIntentService.setData(this.sliderInput, PucUserLimitDataSources.EXTERNAL_DEVICE, Ref + '_scheduler');
            this.sliderInput = (dataforuserIntentslider) ? dataforuserIntentslider : this.sliderInput;
          }
        }
        else {
          this.sliderInput = (sliderValueFromZoneSettings) ? sliderValueFromZoneSettings : this.sliderInput;
          this.sliderUserIntentService.setData(this.sliderInput, PucUserLimitDataSources.EXTERNAL_DEVICE, Ref + '_scheduler');
        }

        if (this.isTempValueFirstTime) {
          this.heatingTempVal = parseFloat(this.sliderInput.desiredTempHeating);
          this.coolingTempVal = parseFloat(this.sliderInput.desiredTempCooling);
        }
      }

      this.cd.detectChanges();
    }

  }

  toggleDaySelection(val) {
    let index = this.totalDaysSelected.indexOf(val);
    if (index > -1) {
      this.totalDaysSelected.splice(index, 1);
    } else {
      this.totalDaysSelected.push(val)
    }
  }

  timeDropDown() {
    let hr = 0;
    let min = 0;

    for (var i = 1; i < 96; i++) {
      if (i == 1) {
        this.timerArray.push('0' + (hr) + ':' + '0' + (min));
      }
      min = min + 15;
      if (i % 4 == 0) {
        hr = hr + 1;
        min = 0;
        if (i < 40) {
          this.timerArray.push('0' + (hr) + ':' + '0' + (min));
        } else {
          this.timerArray.push((hr) + ':' + '0' + (min));
        }
      } else {
        if (i < 40) {
          this.timerArray.push('0' + (hr) + ':' + (min));
        } else {
          this.timerArray.push((hr) + ':' + (min));
        }
      }
    }
    this.timerArray.splice(0, 0);
    this.timerArray.splice(this.timerArray.length, 0);
  }

  schedulerDesiredTempsChangedHandler(changedbuttonid: PucUserIntentTempSliderValueChangedIds) {
    let Ref;
    if (parseInt(this.scheduleType) == 0) {
      Ref = this.siteId;
    }
    else if (parseInt(this.scheduleType) == 1) {
      Ref = this.zoneName;
    }
    let datalastupdatedby = this.sliderUserIntentService.getLatestUpdatedBy(Ref + '_scheduler');
    let sliderdata = this.sliderUserIntentService.getData(datalastupdatedby, Ref + '_scheduler');
    this.isTempValueFirstTime = false;
    this.coolingTempVal = parseFloat(sliderdata.desiredTempCooling);
    this.heatingTempVal = parseFloat(sliderdata.desiredTempHeating);
  }

  addEntry() {
    this.decisionArray = [];
    if (this.totalDaysSelected.length > 0) {
      this.formTempScheduleArray();
    }
    else {
      this.alertMessage = ('Please select the day');
    }
    if (this.alertMessage.length == 0)
      this.sliderUserIntentService.clearData();
  }

  formTempScheduleArray() {
    this.tempScheduleInfo = [];
    this.curStartTime = moment(this.startTime, "HH:mm");
    this.curEndTime = moment(this.endTime, "HH:mm");
    if (this.curEndTime.hours() == 0) {
      this.curEndTime.add(1, 'd');
    }

    if (this.scheduleInfo.length > 0) {
      for (let i = 0; i < this.scheduleInfo.length; i++) {
        let startTime = this.scheduleInfo[i].sthh + ':' + this.scheduleInfo[i].stmm;
        let endTime = this.scheduleInfo[i].ethh + ':' + this.scheduleInfo[i].etmm;
        let startTimeMoment = moment(startTime, "HH:mm");
        let endTimeMoment = moment(endTime, "HH:mm");
        if (endTimeMoment.hours() == 0) {
          endTimeMoment.add(1, 'd');
        }
        if (startTimeMoment > endTimeMoment) {
          let schedule = this.scheduleObj(String(this.scheduleInfo[i].sthh), String(this.scheduleInfo[i].stmm), '24', '00', String(this.scheduleInfo[i].day),
            String(this.scheduleInfo[i].coolVal), String(this.scheduleInfo[i].heatVal), String(this.scheduleInfo[i].sthh), String(this.scheduleInfo[i].stmm), String(this.scheduleInfo[i].ethh), String(this.scheduleInfo[i].etmm), true);
          this.tempScheduleInfo.push(schedule);
          let schedule2 = this.scheduleObj('00', '00', String(this.scheduleInfo[i].ethh), String(this.scheduleInfo[i].etmm), this.schedulerService.getNextDayIndex(parseInt(this.scheduleInfo[i].day)),
            String(this.scheduleInfo[i].coolVal), String(this.scheduleInfo[i].heatVal), String(this.scheduleInfo[i].sthh), String(this.scheduleInfo[i].stmm), String(this.scheduleInfo[i].ethh), String(this.scheduleInfo[i].etmm), true);
          this.tempScheduleInfo.push(schedule2);
        } else {
          let schedule = this.scheduleObj(String(this.scheduleInfo[i].sthh), String(this.scheduleInfo[i].stmm), String(this.scheduleInfo[i].ethh), String(this.scheduleInfo[i].etmm), String(this.scheduleInfo[i].day),
            String(this.scheduleInfo[i].coolVal), String(this.scheduleInfo[i].heatVal), String(this.scheduleInfo[i].sthh), String(this.scheduleInfo[i].stmm), String(this.scheduleInfo[i].ethh), String(this.scheduleInfo[i].etmm));
          this.tempScheduleInfo.push(schedule);
        }
      }
      if (this.tempScheduleInfo.length > 0) {
        this.checkAlreadyScheduleExitsForSelectedDays();
      }
    }
    else {
      this.addSchedule();
    }
  }

  addSchedule() {
    this.curStartTime = moment(this.startTime, "HH:mm");
    this.curEndTime = moment(this.endTime, "HH:mm");
    let coolVal = (this.coolingTempVal).toString();
    let heatVal = (this.heatingTempVal).toString();
    let sthh = this.curStartTime.hour().toString();
    let stmm = this.curStartTime.minute().toString();
    let ethh = this.curEndTime.hour().toString();
    let etmm = this.curEndTime.minute().toString();
    this.decisionArray = [];
    this.alertMessage = "";
    // check for zone-containment on selected days for zone schedule. 
    if (parseInt(this.scheduleType) == 1) {
      this.totalDaysSelected.forEach((daySelected) => { this.zoneContainment(daySelected) })
      if (!this.decisionArray.length) {
        this.totalDaysSelected.forEach(dayIndex => {
          let schedule;
          schedule = this.scheduleObj(sthh, stmm, ethh, etmm, dayIndex, coolVal, heatVal);
          this.scheduleInfo.push(schedule);
          let ele = document.getElementById('sch'+this.refId)
          if(ele) {
            ele.querySelectorAll('.overlay').forEach(function (a) {
              a.remove()
            })
          }
         
        });
        this.decisionArray = [];
        //this.scheduleChanges.emit(this.scheduleInfo);
        this.dialogRef.close(this.scheduleInfo);
      }
      else {
        this.isZoneTrim = true;
        if (this.decisionArray.length) {
          this.decisionArray.map((_mapItem) => {
            this.alertMessage += (this.alertMessage.length ? " " : '') + this.week[_mapItem['index']] + "(" + _mapItem['trim'] + ")"
          })

        }
        else {
          this.isZoneTrim = false
          this.alertMessage = 'There is No Building schedule on selected day';
        }
      }
    }
    else {
      //schedule type building
      //buliding containment check
      this.totalDaysSelected.forEach(dayIndex => {
        let schedule;
        schedule = this.scheduleObj(sthh, stmm, ethh, etmm, dayIndex, coolVal, heatVal);
        this.scheduleInfo.push(schedule);
        let ele = document.getElementById('sch'+this.refId)
          if(ele) {
            ele.querySelectorAll('.overlay').forEach(function (a) {
              a.remove()
            })
          }
      });
      if (this.type == 'edit') {
        this.editBuildingSch();
      }
      else {
        //this.scheduleChanges.emit(this.scheduleInfo);
        this.dialogRef.close(this.scheduleInfo);
      }
    }
  }

  //method to force trim
  zoneForceTrim() {
    if (this.decisionArray.length) {

      let schedulesForceTrimmed = [];

      let dayIndexArr = [];
      this.decisionArray.map(sch => {
        if (dayIndexArr.indexOf(sch.index) == -1) dayIndexArr.push(sch.index);
      })
      dayIndexArr.forEach((day) => {
        let curStart;
        let curEnd;
        let overNightSch;
        curStart = this.curStartTime.clone()
        curEnd = this.curEndTime.clone();
        if (curStart > curEnd) {
          curEnd.add(1, 'd');
          overNightSch = true;
        }
        let filterList = this.decisionArray.filter(sch => sch.index == day);
        if (overNightSch) {
          let nextDayIndex = this.schedulerService.getNextDayIndex(day);
          filterList = filterList.concat(this.decisionArray.filter(sch => {
            if (sch.index == nextDayIndex) {
              let trimStart = moment(sch.trim.split('-')[0], 'HH:mm');
              let trimEnd = moment(sch.trim.split('-')[1], 'HH:mm');
              trimStart.add(1, 'd');
              trimEnd.add(1, 'd');
              if (trimEnd < trimStart) {
                trimEnd.add(1, 'd')
              }

              return DateUtil.overlaps(curStart, curEnd, trimStart, trimEnd);
            }
          }));
        }
        filterList.forEach((trimSch, index) => {


          let trimVal = trimSch.trim.split('-');
          let trimStart = moment(trimVal[0], 'HH:mm');
          let trimEnd = moment(trimVal[1], 'HH:mm');
          if (parseInt(day) != trimSch.index) {
            trimStart.add(1, 'd');
            trimEnd.add(1, 'd');
          }
          if (trimStart > trimEnd) {
            trimEnd.add(1, 'd');
          }
          let intersect = DateUtil.intersect(curStart, curEnd, trimStart, trimEnd);
          if (intersect) {

            if (curStart.isBefore(intersect[0])) {
              schedulesForceTrimmed.push({
                time: curStart.format('HH:mm') + "-" + intersect[0].format('HH:mm'),
                index: (moment(curStart.format('HH:mm'), 'HH:mm').isAfter(moment(intersect[0].format('HH:mm'), 'HH:mm')) ? day : trimSch.index)
              })
            }
            curStart = intersect[1];

            if (index == filterList.length - 1 && curStart.isBefore(curEnd)) {
              schedulesForceTrimmed.push({
                time: curStart.format('HH:mm') + "-" + curEnd.format('HH:mm'),
                index: day
              })
            }
          }


        })
      })

      //compare dayIndexArr with selected days if selected day index is not present then add sch to that day index
      let uniqueArr = this.totalDaysSelected.filter(obj => { return dayIndexArr.indexOf(obj) == -1; })

      schedulesForceTrimmed.forEach(sch => {
        let startTime = moment(sch.time.split('-')[0], 'HH:mm')
        let endTime = moment(sch.time.split('-')[1], 'HH:mm')
        this.scheduleInfo.push({ ethh: endTime.hour().toString(), sthh: startTime.hour().toString(), coolVal: this.coolingTempVal.toString(), day: sch.index, etmm: endTime.minute().toString(), stmm: startTime.minute().toString(), heatVal: this.heatingTempVal.toString() })
      })
      uniqueArr.forEach(_dayIdx => {
        this.scheduleInfo.push({ ethh: this.curEndTime.hour().toString(), sthh: this.curStartTime.hour().toString(), coolVal: this.coolingTempVal.toString(), day: _dayIdx, etmm: this.curEndTime.minute().toString(), stmm: this.curStartTime.minute().toString(), heatVal: this.heatingTempVal.toString() })
      })

      //this.scheduleChanges.emit(this.scheduleInfo);
      this.dialogRef.close(this.scheduleInfo);
    }
  }

  checkAlreadyScheduleExitsForSelectedDays() {
    let overlapArr = [];
    this.totalDaysSelected.sort();

    //If same time selected 
    if ((this.curStartTime).isSame(this.curEndTime)) {
      this.alertMessage = ('Schedule cannot be added with same start and end time.');
      if (this.type == 'edit') {
        this.scheduleInfo.push(this.editScheduleData);
      }
      return
    }
    let selectedStartTime = this.curStartTime.clone();
    let selectedEndTime = this.curEndTime.clone();

    if (selectedStartTime > selectedEndTime) {
      selectedEndTime.add(1, 'd');
    }
    for (let i = 0; i < this.totalDaysSelected.length; i++) {
      this.allSelectedDayCheckTimeArray = [];
      this.daysArryScheduleInfo(this.totalDaysSelected[i]);
      if (this.curStartTime > this.curEndTime) {
        let index = this.totalDaysSelected[i] + 1 > 6 ? 0 : this.totalDaysSelected[i] + 1;
        this.daysArryScheduleInfo(index);
      }

      this.allSelectedDayCheckTimeArray.forEach((sch) => {
        let schSplit = sch.split(' ');
        let startTime = moment(schSplit[0], 'HH:mm');
        let endTime = moment(schSplit[1], 'HH:mm');
        let dayIndex = schSplit[2];
        let isSplit = parseInt(schSplit[6]) == 1
        if (startTime > endTime) {
          endTime.add(1, 'd');
        }
        if (this.totalDaysSelected[i] != dayIndex) {
          startTime.add(1, 'd');
          endTime.add(1, 'd');
        }

        let intersection = DateUtil.intersect(selectedStartTime, selectedEndTime, startTime, endTime)
        if (intersection) {
          overlapArr.push({
            start: intersection[0],
            end: intersection[1],
            dayIndex: dayIndex,
            isSplit: schSplit[6]
          })
        }
      })
    }

    overlapArr = this.combineAdjacentSch(overlapArr, 'dayIndex');
    overlapArr = overlapArr.sort((a, b) => {
      let val = a.dayIndex - b.dayIndex;
      if (val == 0) {
        if (parseInt(a.dayIndex) - parseInt(b.dayIndex) == 0) {
          //if overnight overlap schedules sort by time range
          let aStart: any = moment(a.start.format('HH:mm'), 'HH:mm');
          let bStart: any = moment(b.start.format('HH:mm'), 'HH:mm');
          return aStart - bStart
        }
      }
      return val;
    })
    if (!overlapArr.length) {
      this.addSchedule();
    } else {
      this.alertMessage = 'The current settings cannot be overridden because the following duration of the schedules are overlapping <br/>';
      overlapArr.map(_mapItem => {
        this.alertMessage += this.week[_mapItem.dayIndex] + "(" + _mapItem['start'].format('HH:mm') + '-' + _mapItem['end'].format('HH:mm') + ") ";
      })
    }
  }

  combineAdjacentSch(overlapArr, key, updateKey?) {
    for (let i = 0; i < overlapArr.length - 1;) {
      let index = parseInt(overlapArr[i][key]) + 1
      index = index > 6 ? 0 : index;
      if (overlapArr[i].end.hours() == 0 && overlapArr[i].end.minutes() == 0 && overlapArr[i + 1].start.hours() == 0 && overlapArr[i + 1].start.minutes() == 0 && index == parseInt(overlapArr[i + 1][key]) && overlapArr[i + 1].isSplit && overlapArr[i].isSplit) {
        overlapArr[i].end = overlapArr[i + 1].end;
        if (updateKey) {
          overlapArr[i][updateKey] = overlapArr[i].start.format('HH:mm') + "-" + overlapArr[i + 1].end.format('HH:mm');
        }
        overlapArr.splice(i + 1, 1);
      } else {
        i++
      }
    }

    return overlapArr;

  }

  combineAdjacentSchWithoutMomnet(overlapArr, key?) {
    for (let i = 0; i < overlapArr.length - 1;) {
      let index = parseInt(overlapArr[i][key]) + 1
      index = index > 6 ? 0 : index;
      if (overlapArr[i].ethh == 0 && overlapArr[i].etmm == 0 && overlapArr[i + 1].sthh == 0 && overlapArr[i + 1].stmm == 0 && index == parseInt(overlapArr[i + 1][key])) {
        overlapArr[i].ethh = overlapArr[i + 1].ethh;
        overlapArr[i].etmm = overlapArr[i + 1].etmm;
        overlapArr.splice(i + 1, 1);
      } else {
        i++
      }
    }
    return overlapArr;
  }

  //reads raw schedule info and format data using moment
  formatStartAndEndTime(scheduleArray) {
    for (let i = 0; i < scheduleArray.length; i++) {
      let startHour = moment(String(scheduleArray[i].sthh), "HH");
      let startMin = moment(String(scheduleArray[i].stmm), "mm");
      let endHour = moment(String(scheduleArray[i].ethh), "HH");
      let endMin = moment(String(scheduleArray[i].etmm), "mm");
      let day = parseInt(scheduleArray[i].day)
      scheduleArray[i].sthh = startHour.format("HH");
      scheduleArray[i].stmm = startMin.format("mm");
      scheduleArray[i].ethh = endHour.format("HH");
      scheduleArray[i].etmm = endMin.format("mm");
      scheduleArray[i].day = day
    }
    return scheduleArray
  }

  //checks If ZoneSchedule's Exceeding BuildingSchedule
  zoneContainment(dayIndex) {
    this.buildingScheduleInfo = this.formatStartAndEndTime(this.buildingScheduleInfo);
    this.scheduleInfo = this.formatStartAndEndTime(this.scheduleInfo);
    this.tempBuildingScheduleInfo = [];

    let forceTrimArray = this.schedulerService.zoneContainment(this.buildingScheduleInfo,dayIndex,this.curStartTime,this.curEndTime);
    this.decisionArray = this.decisionArray.concat(forceTrimArray);
  }

  //array of days in scheduleinfo
  daysArryScheduleInfo(dayIndex) {
    this.arrayCheckTime = [];
    this.arrayCheckDay = [];
    let checkStartTime;
    let checkEndTime;
    let tempCheckStartTime;
    let tempCheckEndTime;
    for (let i = 0; i < this.tempScheduleInfo.length; i++) {
      let scheduleEntity = this.tempScheduleInfo[i];
      this.arrayCheckDay.push(scheduleEntity.day);
      //create array of schedule timings of specific day
      if (dayIndex == this.arrayCheckDay[i]) {
        checkStartTime = `${scheduleEntity.sthh}:${scheduleEntity.stmm}`;
        checkEndTime = `${scheduleEntity.ethh}:${scheduleEntity.etmm}`;
        tempCheckStartTime = `${scheduleEntity.tempSthh}:${scheduleEntity.tempStmm}`;
        tempCheckEndTime = `${scheduleEntity.tempEthh}:${scheduleEntity.tempEtmm}`;
        this.arrayCheckTime.push(`${checkStartTime} ${checkEndTime}`);
        this.allSelectedDayCheckTimeArray.push(`${checkStartTime} ${checkEndTime} ${dayIndex} ${tempCheckStartTime} ${tempCheckEndTime} ${scheduleEntity.isSplit ? 1 : 0}`);
      }
    }
    this.arrayCheckTime.sort((one, two) => (one > two ? -1 : 1));
    return this.arrayCheckDay;
  }

  //edit building schedule
  editBuildingSch() {
    let allZoneSchdata: any[] = [];
    this.zonesTrimBuilding = {};
    this.alertMessage = "";
    let isOverNight = false;
    let dayIndex = parseInt(this.editScheduleData['day']);
    allZoneSchdata = this.getAllZonesFormatData();

    let beforeEditStartTime = moment(this.editScheduleData.sthh + ":" + this.editScheduleData.stmm, 'HH:mm');
    let beforeEditEndTime = moment(this.editScheduleData.ethh + ":" + this.editScheduleData.etmm, 'HH:mm');
    if (this.curStartTime > this.curEndTime) {
      this.curEndTime.add(1, 'd');
      isOverNight = true;
    }
    if (beforeEditStartTime > beforeEditEndTime) {
      beforeEditEndTime.add(1, 'd');
      isOverNight = true;
    }
    //find the differnce in the edited value and old value
    if (!DateUtil.contains(this.curStartTime, this.curEndTime, beforeEditStartTime, beforeEditEndTime)) {
      let intersect = DateUtil.intersect(this.curStartTime, this.curEndTime, beforeEditStartTime, beforeEditEndTime);

      let diffFromOldAndNew = [];

      // new start value is after old start value then add diff to array 
      if (intersect[0] > beforeEditStartTime) {
        diffFromOldAndNew.push({
          start: beforeEditStartTime,
          end: intersect[0]
        })
      }
      // new end value is after old end value then add diff to array
      if (intersect[1] < beforeEditEndTime) {
        diffFromOldAndNew.push({
          start: intersect[1],
          end: beforeEditEndTime
        })
      }

      allZoneSchdata.forEach((zoneInfo) => {
        let forceTrimarr = [];
        let currentStartTime = this.curStartTime.clone();
        let curEndTime = this.curEndTime.clone();

        let arr = (a, b) => {
          return parseInt(a.day) - parseInt(b.day) || parseInt(a.sthh) - parseInt(b.sthh);
        }
        if (currentStartTime.isAfter(curEndTime)) {
          curEndTime.add(1, 'd');
        }
        let zoneSch = this.schedulerService.getSplitSchdules(zoneInfo.days.sort(arr));


        // filter selected day from zone schedule;
        let zoneScheduleArr = zoneSch.filter((sch) => {
          if (parseInt(sch['day']) == dayIndex) {
            return sch
          }
        })
        zoneScheduleArr = zoneScheduleArr.sort(arr);
        // filter next day from zone schedule;
        if (isOverNight) {
          let index = this.schedulerService.getNextDayIndex(dayIndex);
          let val = zoneSch.filter((sch) => {
            if (parseInt(sch['day']) == index) {
              return sch
            }
          })
          val = val.sort(arr)
          zoneScheduleArr = zoneScheduleArr.concat(val);
        }

        for (let i = 0; i < zoneScheduleArr.length; i++) {
          let zoneSch = zoneScheduleArr[i];
          let zoneSchStartTime = moment(zoneSch['sthh'] + ':' + zoneSch['stmm'], 'HH:mm');
          let zoneSchEndTime = moment(zoneSch['ethh'] + ':' + zoneSch['etmm'], 'HH:mm');
          let overNightSch;
          //for next schedule to add next date
          if (parseInt(zoneSch.day) != dayIndex) {
            zoneSchStartTime.add(1, 'd');
          }
          //for overnight sch for end date increase by 1day
          if (zoneSchStartTime.isAfter(zoneSchEndTime)) {
            zoneSchEndTime.add(1, 'd');
            overNightSch = true;
          }

          diffFromOldAndNew.forEach((trimval) => {
            let intersect = DateUtil.intersect(trimval.start, trimval.end, zoneSchStartTime, zoneSchEndTime)
            if (intersect) {
              forceTrimarr.push({
                floorName: zoneInfo.floorName,
                index: zoneSch.day,
                trim: intersect[0].format('HH:mm') + "-" + intersect[1].format('HH:mm'),
                isSplit: zoneSch.isSplit,
                start: intersect[0],
                end: intersect[1]
              })
            }
          })
        }

        if (forceTrimarr.length > 0) {
          forceTrimarr = this.combineAdjacentSch(forceTrimarr, 'index', 'trim');
          this.zonesTrimBuilding[zoneInfo.zoneName] = forceTrimarr;
        }


      });

      this.showTrimErrorMsg();
      if (!Object.keys(this.zonesTrimBuilding).length) {
        //this.scheduleChanges.emit(this.scheduleInfo);
        this.dialogRef.close(this.scheduleInfo);
      }
    } else {
      //this.scheduleChanges.emit(this.scheduleInfo);
      this.dialogRef.close(this.scheduleInfo);
    }
  }

  showTrimErrorMsg() {
    this.alertMessage = "";
    if (Object.keys(this.zonesTrimBuilding).length) {
      Object.keys(this.zonesTrimBuilding).map(key => {
        this.zonesTrimBuilding[key].map(_item => {
          this.alertMessage += `Floor ${_item['floorName']} -> <br/> Zone ${key} ${this.week[_item['index']]} (${_item['trim']})<br/>`;
        });
      })
      this.alertArr.push(this.zonesTrimBuilding);

    }
  }

  getAllZonesFormatData() {
    let allZoneSchdata = []
    this.allZoneData.forEach(zoneSchInfo => {
      let schArray = [];
      const obj = {};
      obj['scheduleId'] = this.helperService.stripHaystackTypeMapping(zoneSchInfo.id).split(' ')[0];
      obj['roomRef'] = this.helperService.stripHaystackTypeMapping(zoneSchInfo.roomRef).split(' ')[0];
      obj['days'] = JSON.parse(JSON.stringify(zoneSchInfo.days).replace(/n:/g, ''));
      obj['zoneName'] = zoneSchInfo.zoneName,
        obj['floorName'] = zoneSchInfo.floorName,
        allZoneSchdata.push(obj);
    });
    allZoneSchdata = allZoneSchdata.filter(z=>z.days && z.days.length);
    return allZoneSchdata;
  }


  //trims zone schedule after editing building schedule 
  forceTrim() {

    //removing building schedule entry
    if (this.isConfirmDelete) {
      let tempEditScheduleIndex = this.scheduleInfo.findIndex(obj => parseInt(obj.day) == parseInt(this.editScheduleData.day) && (parseInt(obj.sthh) == parseInt(this.editScheduleData.sthh) && parseInt(obj.stmm) == parseInt(this.editScheduleData.stmm)));
      if (tempEditScheduleIndex >= 0) {
        this.scheduleInfo.splice(tempEditScheduleIndex, 1);
      }
    }
    // updates building schedule
    let ele = document.getElementById('sch'+this.refId);
    if(ele) {
      ele.querySelectorAll('.overlay').forEach(function (a) {
        a.remove()
      })
    }

    let zonesToTrim = Object.keys(this.zonesTrimBuilding) || [];
    if (zonesToTrim.length) {

      let allZoneSchdata: any[] = [];
      this.alertMessage = "";

      allZoneSchdata = this.getAllZonesFormatData();

      allZoneSchdata = allZoneSchdata.filter((zone) => zonesToTrim.indexOf(zone.zoneName) > -1);

      //Loop overlapping zone schedules
      allZoneSchdata.forEach((zoneInfo) => {
        let zoneSchedulesArr = [];
        let arr = (a, b) => {
          return parseInt(a.day) - parseInt(b.day) || parseInt(a.sthh) - parseInt(b.sthh);
        }

        //spilt overnight schedules
        let zoneSchs = this.schedulerService.getSplitSchdules(zoneInfo.days.sort(arr));
        zoneSchs.forEach((sch) => {
          let schStart = moment(sch.sthh + ":" + sch.stmm, 'HH:mm');
          let schEnd = moment(sch.ethh + ":" + sch.etmm, 'HH:mm');
          //overnight broken sch end time increase next day 00:00
          if (schStart > schEnd) {
            schEnd.add(1, 'd');
          }

          this.zonesTrimBuilding[zoneInfo.zoneName].forEach((trimVal) => {
            let trimSplitSch = this.schedulerService.getTrimSplitSchedules(trimVal);
              trimSplitSch.forEach((trimSch)=>{
              //if schdule to be trim , day index same 
              if (parseInt(sch.day) == trimSch.index) {
                let trimVal = trimSch.trim.split('-');
                let trimStart = moment(trimVal[0], 'HH:mm');
                let trimEnd = moment(trimVal[1], 'HH:mm');
                if (trimStart > trimEnd) {
                  trimEnd.add(1, 'd');
                }
                // check if both schdule overlapping with trim value
                let intersect = DateUtil.intersect(schStart, schEnd, trimStart, trimEnd);
                if (intersect) {

                  if (schStart.isBefore(intersect[0])) {
                    zoneSchedulesArr.push(this.schedulerService.getSchObj(sch, schStart, intersect[0]));
                  }
                  schStart = intersect[1];
                }

              }
            })
          })
          // if schedule is reached after trimming push value to array 
          if (schStart.isBefore(schEnd)) {
            zoneSchedulesArr.push(this.schedulerService.getSchObj(sch, schStart, schEnd));
          }

        })
        //combine adjacent schedules in schedule info
        zoneInfo.days = this.combineAdjacentSchWithoutMomnet(zoneSchedulesArr,'day');
      })
      //save all zoneschedule
      allZoneSchdata.forEach(zonesInfo => {
        zonesInfo.days = zonesInfo.days.filter((_item) => _item);
        zonesInfo.days = zonesInfo.days.map(sch => {
          return ObjectUtil.removeKey('isSplit', sch);
        })
        let index = this.allZoneData.findIndex(z=>z.zoneName == zonesInfo.zoneName);
        if(index > -1) {
          this.allZoneData[index].days = zonesInfo.days;
        }

        this.siteService.updateSchedule(
          this.helperService.stripHaystackTypeMapping(zonesInfo.scheduleId),
          this.helperService.stripHaystackTypeMapping(zonesInfo.roomRef),
          this.helperService.stripHaystackTypeMapping(JSON.stringify(zonesInfo.days)).replace(/['"]+/g, '').replace(/(:[\d\.]+)(,)/g, '$1 '),
          'zoneRef',
          this.helperService.stripHaystackTypeMapping(this.allZoneData[0].siteRef)
        ).subscribe(res => {
        });
      });
      this.scheduleChanges.emit(this.allZoneData);
      this.dialogRef.close(this.scheduleInfo);

    }
  }

  //checks zones schedule on deleting buliding schedule
  deleteBuildingSch() {
    let allZoneSchdata: any[] = [];
    this.zonesTrimBuilding = {};
    this.alertMessage = "";

    let dayIndex = parseInt(this.editScheduleData['day']);
    allZoneSchdata = this.getAllZonesFormatData();
    allZoneSchdata.forEach((zoneInfo) => {
      let forceTrimarr = [];
      let currentStartTime = this.curStartTime.clone();
      let curEndTime = this.curEndTime.clone();

      let arr = (a, b) => {
        return parseInt(a.day) - parseInt(b.day) || parseInt(a.sthh) - parseInt(b.sthh);
      }

      //if current start is after current end time its overnight schedule so increase day 1
      if (currentStartTime.isAfter(curEndTime)) {
        curEndTime.add(1, 'd');
      }

      //break over schedules 
      let zoneSch = this.schedulerService.getSplitSchdules(zoneInfo.days.sort(arr));


      // selecting dayIndex from builidng schedule;
      let zoneScheduleArr = zoneSch.filter((sch) => {
        if (parseInt(sch['day']) == dayIndex) {
          return sch
        }
      })

      //sort zone schedules 
      zoneScheduleArr = zoneScheduleArr.sort(arr);
      if (this.curStartTime > this.curEndTime) {
        let index = this.schedulerService.getNextDayIndex(dayIndex);
        let val = zoneSch.filter((sch) => {
          if (parseInt(sch['day']) == index) {
            return sch
          }
        })
        val = val.sort(arr)
        zoneScheduleArr = zoneScheduleArr.concat(val);
      }

      for (let i = 0; i < zoneScheduleArr.length; i++) {
        let zoneSch = zoneScheduleArr[i];
        let zoneSchStartTime = moment(zoneSch['sthh'] + ':' + zoneSch['stmm'], 'HH:mm');
        let zoneSchEndTime = moment(zoneSch['ethh'] + ':' + zoneSch['etmm'], 'HH:mm');

        //for next schedule to add next date
        if (parseInt(zoneSch.day) != dayIndex) {
          zoneSchStartTime.add(1, 'd');
        }
        //for overnight sch for end date increase by 1day
        if (zoneSchStartTime.isAfter(zoneSchEndTime) || (zoneSchEndTime.hours() == 0)) {
          zoneSchEndTime.add(1, 'd');
        }

        //if building schedule is inside zone schedule 
        if (DateUtil.contains(zoneSchStartTime, zoneSchEndTime, currentStartTime, curEndTime)) {
          forceTrimarr.push({
            trim: currentStartTime.format('HH:mm') + "-" + curEndTime.format('HH:mm'),
            index: zoneSch.day,
            start: zoneSchStartTime,
            end: zoneSchEndTime,
            isSplit: zoneSch.isSplit,
            floorName: zoneInfo.floorName,
          })
          break;
        }
        //Zone schedule overlaps to building schedule
        else if (DateUtil.overlaps(zoneSchStartTime, zoneSchEndTime, currentStartTime, curEndTime)) {
          let intersect = DateUtil.intersect(zoneSchStartTime, zoneSchEndTime, currentStartTime, curEndTime);

          // finding disconnected schedules for force trim    
          forceTrimarr.push({
            trim: intersect[0].format('HH:mm') + '-' + intersect[1].format('HH:mm'),
            index: parseInt(zoneSch.day),
            start: currentStartTime,
            end: intersect[1],
            isSplit: zoneSch.isSplit,
            floorName: zoneInfo.floorName
          });
          currentStartTime = intersect[1].clone();
        }
      }

      if (forceTrimarr.length > 0) {
        forceTrimarr = this.combineAdjacentSch(forceTrimarr, 'index', 'trim');
        this.zonesTrimBuilding[zoneInfo.zoneName] = forceTrimarr;
      }


    })

    this.showTrimErrorMsg();

    if (allZoneSchdata.length == 0 || !this.alertMessage) {
      this.alertMessage = 'Are you Sure you want to delete the current Schedule?';
    }
  }

  //calls to remove zone schedule of a selected day while deleting the building schedule 
  removeSchEntry() {

    this.confirmDeleteSchedule();

  }

  scheduleObj(startTimehh: string, startTimemm: string, endTimehh: string, endTimemm: string, day: string, coolVal: string, heatVal: string, tempSthh = undefined, tempStmm = undefined, tempEthh = undefined, tempEtmm = undefined, isSplit = false) {
    return {
      sthh: startTimehh,
      stmm: startTimemm,
      ethh: endTimehh,
      etmm: endTimemm,
      day: day,
      coolVal: coolVal,
      heatVal: heatVal,
      tempSthh: tempSthh,
      tempStmm: tempStmm,
      tempEthh: tempEthh,
      tempEtmm: tempEtmm,
      isSplit: isSplit
    }
  }

  cancel() {
    this.alertMessage = '';
    if (this.isConfirmDelete) {
      this.isConfirmDelete = false;
    } else {
      //this.scheduleChanges.emit(null);
      this.dialogRef.close(null);
    }
    this.alertArr = [];
  }

  reEdit() {
    if (this.type == "edit") {
      this.alertArr = [];
      let tempEditScheduleIndex = this.scheduleInfo.findIndex(obj => obj.day == parseInt(this.editScheduleData.day) && (obj.sthh == this.curStartTime.hours() && obj.stmm == this.curStartTime.minutes()));
      if (!(tempEditScheduleIndex == -1)) {
        this.scheduleInfo.splice(tempEditScheduleIndex, 1);
      }
      this.scheduleInfo.push(this.editScheduleData);
      this.alertMessage = '';
      this.startTime = this.editScheduleData.sthh + ':' + this.editScheduleData.stmm;
      this.endTime = this.editScheduleData.ethh + ':' + this.editScheduleData.etmm;
      this.alertMessage = '';
      this.isZoneTrim = false;
      this.isSingleZoneBuOvernight = false;
    }
    else {
      this.alertMessage = '';
      this.isZoneTrim = false;
      this.isSingleZoneBuOvernight = false;
    }
  }

  cancelDelete() {
    this.alertMessage = '';
    this.isConfirmDelete = false;
  }

  deleteSchedule() {
    this.isConfirmDelete = true;

    if (parseInt(this.scheduleType) == 0) {
      this.curStartTime = moment(this.startTime, "HH:mm");
      this.curEndTime = moment(this.endTime, "HH:mm");
      this.deleteBuildingSch()
    }
    else {
      this.alertMessage = 'Are you sure you want to delete the current Schedule?';
    }
  }

  confirmDeleteSchedule() {

    let tempEditScheduleIndex = this.scheduleInfo.findIndex(obj => parseInt(obj.day) == parseInt(this.editScheduleData.day) && (parseInt(obj.sthh) == parseInt(this.editScheduleData.sthh) && parseInt(obj.stmm) == parseInt(this.editScheduleData.stmm)));
    if (tempEditScheduleIndex >= 0) {
      this.scheduleInfo.splice(tempEditScheduleIndex, 1);
    }
    let ele = document.getElementById('sch'+this.refId);
          if(ele) {
            ele.querySelectorAll('.overlay').forEach(function (a) {
              a.remove()
            })
          }
    //this.saveScheduleDataToHaystack();
    if (parseInt(this.scheduleType) == 1) {
      //this.scheduleChanges.emit(this.scheduleInfo);
      this.dialogRef.close(this.scheduleInfo);
    }
    else {
      //schedule type building
      //this.scheduleChanges.emit(this.scheduleInfo);
      this.dialogRef.close(this.scheduleInfo);
    }
  }

  saveEditSchedule() {
    if (this.totalDaysSelected.length > 0) {
      this.decisionArray = [];
      this.alertMessage = "";
      let editStarthour = parseInt(this.editScheduleData.sthh);
      let editStartminute = parseInt(this.editScheduleData.stmm);
      let editDayIndex = parseInt(this.editScheduleData.day);

      let tempEditScheduleIndex = this.scheduleInfo.findIndex(obj => obj.day == editDayIndex && (obj.sthh == editStarthour && obj.stmm == editStartminute));

      let startTimeInput = this.startTime
      let endTimeInput = this.endTime;
      this.curStartTime = moment(startTimeInput, "HH:mm");
      this.curEndTime = moment(endTimeInput, "HH:mm");
      if (!(tempEditScheduleIndex == -1)) {
        this.scheduleInfo.splice(tempEditScheduleIndex, 1);
      }
      this.formTempScheduleArray();
      this.sliderUserIntentService.clearData();
      
    } else {
      this.alertMessage = ('Please Select Day')
    }
  }


}

