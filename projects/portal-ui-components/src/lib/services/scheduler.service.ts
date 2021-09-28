import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DateUtil, ObjectUtil } from '../../public-api';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  constructor() { }

  forceTrim(forceTrimArray,zoneSchedule) {
    if (forceTrimArray.length) {
        let zoneSchedulesArr = [];
        let arr = (a, b) => {
            return parseInt(a.day) - parseInt(b.day) || parseInt(a.sthh) - parseInt(b.sthh);
        }
        let zoneSchs = this.getSplitSchdules(zoneSchedule.sort(arr));
        zoneSchs.forEach((sch) => {
            let schStart = moment(sch.sthh + ":" + sch.stmm, 'HH:mm');
            let schEnd = moment(sch.ethh + ":" + sch.etmm, 'HH:mm');
            //overnight broken sch end time increase next day 00:00
            if (schStart > schEnd) {
                schEnd.add(1, 'd');
            }

            forceTrimArray.forEach((trimVal) => {
                let trimSplitSch = this.getTrimSplitSchedules(trimVal);
                trimSplitSch.forEach((trimSch)=>{
                    if (parseInt(sch.day) == trimSch.index) {
                        let trimVal = trimSch.trim.split('-');
                        let trimStart = moment(trimVal[0], 'HH:mm');
                        let trimEnd = moment(trimVal[1], 'HH:mm');
                        if (trimStart > trimEnd) {
                            trimEnd.add(1, 'd');
                        }
                        let intersect = DateUtil.intersect(schStart, schEnd, trimStart, trimEnd);
                        if (intersect) {

                            if (schStart.isBefore(intersect[0])) {
                                zoneSchedulesArr.push(this.getSchObj(sch, schStart, intersect[0]));
                            }
                            schStart = intersect[1];
                        }

                    }
                })
            })
            // if schedule is reached after trimming push value to array
            if (schStart.isBefore(schEnd)) {
                zoneSchedulesArr.push(this.getSchObj(sch, schStart, schEnd));
            }

        })
        zoneSchedulesArr = this.combineAdjacentSchWithoutMomnet(zoneSchedulesArr,'day');
        return zoneSchedulesArr;
    }
}

  
  getTrimSplitSchedules(trimSch) {
      let startEndSplit = trimSch.trim.split('-');
      let trimSchSplits = [];
      if(moment(startEndSplit[0], 'HH:mm') > moment(startEndSplit[1], 'HH:mm')) {
          trimSchSplits.push({
              trim: startEndSplit[0] +"-"+ "24:00",
              index:trimSch.index
          })
          trimSchSplits.push({
              trim:"00:00" +"-"+ startEndSplit[1]  ,
              index:this.getNextDayIndex(parseInt(trimSch.index))
          })
      } else {
          trimSchSplits.push(trimSch);
      }
      return trimSchSplits;
  }

  getNextDayIndex(index) {
    return index + 1 > 6 ? 0 : index + 1;
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

  getSplitSchdules(scheduleInfo) {
    let tempScheduleInfo = [];
    if (scheduleInfo.length > 0) {
      for (let i = 0; i < scheduleInfo.length; i++) {
        let startTime = scheduleInfo[i].sthh + ':' + scheduleInfo[i].stmm;
        let endTime = scheduleInfo[i].ethh + ':' + scheduleInfo[i].etmm;
        let startTimeMoment = moment(startTime, "HH:mm");
        let endTimeMoment = moment(endTime, "HH:mm");
        if (endTimeMoment.hours() == 0) {
          endTimeMoment.add(1, 'd');
        }
        if (startTimeMoment > endTimeMoment) {

          tempScheduleInfo.push({
            sthh: String(scheduleInfo[i].sthh),
            stmm: String(scheduleInfo[i].stmm),
            ethh: '24',
            etmm: '00',
            day: parseInt(scheduleInfo[i].day),
            heatVal:String(scheduleInfo[i].heatVal),
            coolVal:String(scheduleInfo[i].coolVal),
            isSplit: true
          })
          tempScheduleInfo.push({
            sthh: '00',
            stmm: '00',
            ethh: String(scheduleInfo[i].ethh),
            etmm: String(scheduleInfo[i].etmm),
            day: this.getNextDayIndex(parseInt(scheduleInfo[i].day)),
            heatVal:String(scheduleInfo[i].heatVal),
            coolVal:String(scheduleInfo[i].coolVal),
            isSplit: true
          })

        } else {

          tempScheduleInfo.push({
            sthh: String(scheduleInfo[i].sthh),
            stmm: String(scheduleInfo[i].stmm),
            ethh: String(scheduleInfo[i].ethh),
            etmm: String(scheduleInfo[i].etmm),
            day: parseInt(scheduleInfo[i].day),
            heatVal:String(scheduleInfo[i].heatVal),
            coolVal:String(scheduleInfo[i].coolVal),
            isSplit: false
          })
        }
      }

    }
    return tempScheduleInfo;
  }

  getSchObj(sch, start, end) {
    let tempSch = ObjectUtil.deepCopy(sch);
    tempSch['sthh'] = start.hours().toString();
    tempSch['stmm'] = start.minutes().toString();
    tempSch['ethh'] = end.hours().toString();
    tempSch['etmm'] = end.minutes().toString();
    return tempSch;
  }

  zoneContainment(buildingScheduleInfo,dayIndex,selectedStart,selectedEnd) {
    let tempBuildingScheduleInfo = [];
    let trimSchArray=[];
    //reduce building array
    tempBuildingScheduleInfo = this.getSplitSchdules(buildingScheduleInfo);
    let arr = (a, b) => {
        return parseInt(a.day) - parseInt(b.day) || parseInt(a.sthh) - parseInt(b.sthh);
    }
  
    // selecting dayIndex from builidng schedule;
    let buildingScheduleArr = tempBuildingScheduleInfo.filter((buildingSchedule) => {
        if (parseInt(buildingSchedule['day']) === parseInt(dayIndex)) {
            return buildingSchedule
        }
    })
    buildingScheduleArr = buildingScheduleArr.sort(arr);
    if (selectedStart > selectedEnd) {
        let index = this.getNextDayIndex(parseInt(dayIndex));
        let val = tempBuildingScheduleInfo.filter((buildingSchedule) => {
            if (parseInt(buildingSchedule['day']) == index) {
                return buildingSchedule
            }
        })
        val = val.sort(arr)
        buildingScheduleArr = buildingScheduleArr.concat(val);
    }
    if (buildingScheduleArr.length) {
  
        let currentStartTime = selectedStart.clone();
        let curEndTime = selectedEnd.clone();
        let isAdd;
        if (currentStartTime.isAfter(curEndTime)) {
            curEndTime.add(1, 'd');
        }
  
        for (let i = 0; i < buildingScheduleArr.length; i++) {
            let buildingSchedule = buildingScheduleArr[i];
            let buildingSchStartTime = moment(buildingSchedule['sthh'] + ':' + buildingSchedule['stmm'], 'HH:mm');
            let buildingSchEndTime = moment(buildingSchedule['ethh'] + ':' + buildingSchedule['etmm'], 'HH:mm');
            let overNightSch;
            //for next schedule to add next date
            if (parseInt(buildingSchedule.day) != dayIndex) {
                buildingSchStartTime.add(1, 'd');
            }
            //for overnight sch for end date increase by 1day
            if (buildingSchStartTime.isAfter(buildingSchEndTime)) {
                buildingSchEndTime.add(1, 'd');
                overNightSch = true;
            }
            if (DateUtil.contains(buildingSchStartTime, buildingSchEndTime, currentStartTime, curEndTime)) {
                isAdd = true;
                break;
            } else if (DateUtil.overlaps(buildingSchStartTime, buildingSchEndTime, currentStartTime, curEndTime)) {
                let intersect = DateUtil.intersect(buildingSchStartTime, buildingSchEndTime, currentStartTime, curEndTime);
                
                // finding disconnected schedules for force trim    
                if (currentStartTime.isSameOrAfter(buildingSchStartTime)) {
                    currentStartTime = intersect[1].clone();
                } else {
                    let val = intersect[0];
                    isAdd = true;
                    //if reaches end of adding / edit schedule
                    //ignore schedules after endtime
                    trimSchArray.push({
                        trim: currentStartTime.format('HH:mm') + '-' + val.format('HH:mm'),
                        index: parseInt(buildingSchedule.day),
                    });
                    if (DateUtil.contains(buildingSchStartTime, buildingSchEndTime, val, curEndTime)) {
                        if (curEndTime.isAfter(buildingSchEndTime)) {
                            trimSchArray.push({
                                trim: buildingSchEndTime.format('HH:mm') + '-' + curEndTime.format('HH:mm'),
                                index: parseInt(buildingSchedule.day)
                            });
                        }
                        break;
                    }
                    currentStartTime = intersect[1].clone();
  
                }
            }
            //schedules outside edit/new schedule
            else if (buildingSchStartTime.isAfter(curEndTime)) {
                isAdd = true;
                trimSchArray.push({
                    trim: currentStartTime.format('HH:mm') + '-' + curEndTime.format('HH:mm'),
                    index:(moment(currentStartTime.format('HH:mm'),'HH:mm').isAfter(moment(curEndTime.format('HH:mm'),'HH:mm'))?dayIndex:parseInt(buildingSchedule.day))
                });
                break;
            }
            if (curEndTime.isAfter(buildingSchEndTime) && i == buildingScheduleArr.length - 1) {
                let index = parseInt(buildingSchedule.day);
                isAdd = true;
                if ((overNightSch || buildingSchEndTime.hours() == 0) && dayIndex == index) {
                    index = this.getNextDayIndex(index)
                }
                trimSchArray.push({
                    trim: buildingSchEndTime.format('HH:mm') + '-' + curEndTime.format('HH:mm'),
                    index: index
                });
            }
  
        }
  
        //sch not with in building sch trim entire added sch
        if (!isAdd) {
          trimSchArray.push({
                trim: currentStartTime.format('HH:mm') + '-' + curEndTime.format('HH:mm'),
                index: parseInt(dayIndex)
            })
        }
  
    }
    else {
      trimSchArray.push({
            trim: selectedStart.format('HH:mm') + '-' + selectedEnd.format('HH:mm'),
            index: parseInt(dayIndex),
            noSch: true
        })
    }
  
    trimSchArray = trimSchArray.sort((a, b) => {
        let val = a.dayIndex - b.dayIndex;
        if (val == 0) {
            if (parseInt(a.dayIndex) - parseInt(b.dayIndex) == 0) {
                //if overnight overlap schedules sort by time range
                let aStart: any = moment(a.trim.split('-')[0], 'HH:mm');
                let bStart: any = moment(b.trim.split('-')[0], 'HH:mm');
                return aStart - bStart
            }
        }
        return val;
    })
  
    return trimSchArray;
  }
}
