// tslint:disable: max-line-length

import * as moment from 'moment';

import { Observable, Subject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DeviceHelperService } from './device-helper.service';
import { HelperService } from './hs-helper.service';
import { Injectable } from '@angular/core';
import { SiteService } from './site.service';
import { ZoneDefaultFilter } from './zone-color-default.service';

@Injectable({
    providedIn: 'root'
})
export class HeatmapService {
    constructor(private helperService: HelperService,
        private deviceHelper: DeviceHelperService,
        private siteService: SiteService,
        private zoneDefaultFilter: ZoneDefaultFilter) {
    }

    ccusWithPairedZones;
    buildings;
    buildingCcus;
    buildingFloors;

    heatingDeadBandRoomRefList = [];
    coolingDeadBandRoomRefList = [];

    deadbandScale = [];
    prefetchZonePoints = [];

    private zoneColorsCalculated$: Subject<any> = new Subject(); // Emits the zone colors that have been calculated
    getZoneColorsCalculated(): Observable<any> {
        return this.zoneColorsCalculated$.asObservable();
    }

    setZoneColorsCalculated(zoneColorInfo) {
        this.zoneColorsCalculated$.next(zoneColorInfo);
    }

    setCcusWithPairedZones(data) {
        this.ccusWithPairedZones = data;
    }

    getCcusWithPairedZones() {
        return this.ccusWithPairedZones;
    }

    setBuildingCcus(buildingCcus) {
       this.buildingCcus = buildingCcus;
    }

    setBuildingFloors(buildingFloors) {
        this.buildingFloors = buildingFloors;
    }

    setBuildings(buildings) {
       this.buildings = buildings;
    }

    commaSeparatedPointIds = (a, b) => a + ',' + b;
    average = (array) => array.reduce((a, b) => a + b) / array.length;

    findMaxValuefromCommaSeparated = (input) => {
        let output = input.split(',');
        output.pop();
        if (output.length > 0) {
            output = output.reduce((prev, curr) => {
                return Math.max(Number(prev), Number(curr));
            });
        }
        return output.toString();
    }

    mostOccuringArrayValues = (arr) => [...new Set(arr)]
        .map((value) => [value, arr.filter((v) => v === value).length])
        .sort((a, b) => a[1] - b[1])
        .reverse()
        .filter((value, i, a) => a.indexOf(value) === i)
        .filter((v, i, a) => v[1] === a[0][1])
        .map((v) => v[0])


    getMostOccuringHighestArrayValue(array) {
        const mostOccuringArrayValues = this.mostOccuringArrayValues(array);
        if (mostOccuringArrayValues.length == 1) {
            return mostOccuringArrayValues[0];
        } else if (mostOccuringArrayValues.length > 1) {
            return Math.max(...array);
        } else {
            return 0;
        }
    }

    setSpreadRange(heatingDeadband, coolingDeadband) {
        heatingDeadband = heatingDeadband == 0 ? 1 : heatingDeadband;
        coolingDeadband = coolingDeadband == 0 ? 1 : coolingDeadband;
        this.deadbandScale = [];
        this.deadbandScale.push(-(3 * heatingDeadband));
        this.deadbandScale.push(-(2 * heatingDeadband));
        this.deadbandScale.push(-(1 * heatingDeadband));
        this.deadbandScale.push(0);
        this.deadbandScale.push(1 * coolingDeadband);
        this.deadbandScale.push(2 * coolingDeadband);
        this.deadbandScale.push(3 * coolingDeadband);
    }

    getCCUPariedWithZone(zoneId: string) {
        if (!this.ccusWithPairedZones.length) { return null; }
        for (let i = 0; i < this.ccusWithPairedZones.length; i++) {
            if (this.ccusWithPairedZones[i].pairedZoneList.indexOf(zoneId) > -1) {
                return [this.ccusWithPairedZones[i].id, this.ccusWithPairedZones[i].CCUName];
            }
        }
    }

    getCCUColor(ccuId) {
        return (this.buildingCcus.find(ccu => ccu._id === ccuId) || {}).color ?? '';
    }

    propertyValues = (zone, input) => {
        const output = parseFloat(this.prefetchZonePoints[zone].points.find(x => x.pointName.includes(input))?.val);
        return output || output === 0 ? Number(output) : '--';
    }

    pointIDOrPointIDsWithComma = (buildingObj, roomRef, tagsList: any) => {
        const returnPointIds = this.helperService.getPointIdbyTags(buildingObj, tagsList, roomRef);
        if (returnPointIds) {
            if (returnPointIds.length > 0) {
                return returnPointIds.join();
            } else if (returnPointIds.length == 0) {
                return undefined;
            } else {
                return returnPointIds;
            }
        }
    }

    pointIDOrPointIDsWithCommaAndProfiles = (buildingObj, profileObj, roomRef, tagsList: any) => {
        const returnPointIds = this.helperService.getPointIdbyTags(buildingObj, tagsList, roomRef);
        if (returnPointIds) {
            if (returnPointIds.length > 0) {
                profileObj.forEach((profile) => {
                    returnPointIds.forEach((point, index) => {
                        const profileOfPoint = profile.profile.entities.filter((points) => {
                            if (points._id.includes(point)) {
                                return points;
                            }
                        });
                        if (profileOfPoint.length) {
                            returnPointIds[index] = point + '|' + profile.profileType + '|' + profile.profile._id;
                        }
                    });

                });
                return returnPointIds.join();
            } else {
                return returnPointIds;
            }
        }
    }

    fetchColourScaleDeadbands(): Observable<any> {
        return new Observable(observer => {
            this.heatingDeadBandRoomRefList = [];
            this.coolingDeadBandRoomRefList = [];
            this.buildingFloors.forEach(floor => {
                floor.entities.forEach(ent => {
                    if (ent.type === 'room') {
                        this.heatingDeadBandRoomRefList.push({
                            pointId: this.pointIDOrPointIDsWithComma(this.buildings, ent._id, ['heating', 'deadband', 'base']),
                            roomRef: ent._id,
                            zoneName: ent.name,
                            val: '' }
                        );
                        this.coolingDeadBandRoomRefList.push({
                            pointId: this.pointIDOrPointIDsWithComma(this.buildings, ent._id, ['cooling', 'deadband', 'base']),
                            roomRef: ent._id,
                            zoneName: ent.name,
                            val: '' }
                        );
                    }
                });
            });

            if (this.heatingDeadBandRoomRefList.length || this.coolingDeadBandRoomRefList.length) {
                let pointsList = [];
                this.heatingDeadBandRoomRefList = this.heatingDeadBandRoomRefList.filter(x => x.pointId);
                this.coolingDeadBandRoomRefList = this.coolingDeadBandRoomRefList.filter(x => x.pointId);

                let hbList = this.heatingDeadBandRoomRefList.map(x => x.pointId);
                if (hbList.length > 0) {
                    hbList = hbList.reduce(this.commaSeparatedPointIds).split(',');
                    pointsList = [...pointsList, ...hbList];
                }
                let cbList = this.coolingDeadBandRoomRefList.map(x => x.pointId);
                if (cbList.length > 0) {
                    cbList = cbList.reduce(this.commaSeparatedPointIds).split(',');
                    pointsList = [...pointsList, ...cbList];
                }
                if (!pointsList.length) { return; }
                this.siteService.getCurrenthisReadMany(pointsList).subscribe(({ rows }) => {
                    rows.forEach(res => {
                        const pointIdFromRes = this.helperService.stripHaystackTypeMapping(res.id);
                        // const pointIdFromRes = this.helperService.stripHaystackTypeMapping(res.id.split(' ')[0]);
                        if (res.cooling) {
                            this.coolingDeadBandRoomRefList.filter(x => {
                                if (x.pointId && (x.pointId.includes(pointIdFromRes)) && (x.pointId.includes(','))) {
                                    x.val += ((res.data.length >= 1) ?
                                        this.helperService.stripHaystackTypeMapping(res.data[0].val).split(' ')[0] : '') + ',';
                                } else if (x.pointId && x.pointId.includes(pointIdFromRes)) {
                                    x.val = (res.data.length >= 1) ?
                                        this.helperService.stripHaystackTypeMapping(res.data[0].val).split(' ')[0] : '';
                                }
                            });
                        } else if (res.heating) {
                            this.heatingDeadBandRoomRefList.filter((x) => {
                                if (x.pointId && (x.pointId.includes(pointIdFromRes)) && (x.pointId.includes(','))) {
                                    x.val += (((res.data.length >= 1) ?
                                        this.helperService.stripHaystackTypeMapping(res.data[0].val).split(' ')[0] : '') + ',');
                                } else if (x.pointId && x.pointId.includes(pointIdFromRes)) {
                                    x.val = (res.data.length >= 1) ?
                                        this.helperService.stripHaystackTypeMapping(res.data[0].val).split(' ')[0] : '';
                                }
                            });
                        }
                    });

                    const heatingDeadbandValues = [...this.heatingDeadBandRoomRefList.map(x => {
                        if (x.pointId) {
                            if (x.val && x.val.includes(',')) {
                                x.val = this.findMaxValuefromCommaSeparated(x.val);
                                return x.val.toString();
                            } else { return x.val; }
                        }
                    })].filter(notUndefined => notUndefined !== undefined);
                    const coolingDeadbandValues = [...this.coolingDeadBandRoomRefList.map(x => {
                        if (x.pointId) {
                            if (x.val && x.val.includes(',')) {
                                x.val = this.findMaxValuefromCommaSeparated(x.val);
                                return x.val.toString();
                            } else { return x.val; }
                        }
                    })].filter(notUndefined => notUndefined !== undefined);

                    this.setSpreadRange(
                        this.getMostOccuringHighestArrayValue(heatingDeadbandValues),
                        this.getMostOccuringHighestArrayValue(coolingDeadbandValues)
                    );
                    observer.next(' Deadband Fetched ');
                }, err => {
                    console.log(err);
                    observer.error();
                });
            } else {
                observer.next(' No Deadband available ');
            }
        });
    }


    getZoneColor(currentRoomRef, roomName, profiles): Observable<any> {
        return new Observable(observer => {
            let objTemp: any = {
                currentRoomRef
            };
            objTemp.heatingdeadband = Number(this.heatingDeadBandRoomRefList.filter(x => {
                if (currentRoomRef.includes(x.roomRef)) {
                    return x;
                }
            })[0].val) ?? '--';

            objTemp.coolingdeadband = Number(this.coolingDeadBandRoomRefList.filter(x => {
                if (currentRoomRef.includes(x.roomRef)) {
                    return x;
                }
            })[0].val) ?? '--';

            if (!this.prefetchZonePoints[roomName]) {
                this.prefetchZonePoints[roomName] = {
                    roomRef: currentRoomRef,
                    points: [
                        { pointId: this.pointIDOrPointIDsWithCommaAndProfiles(this.buildings, profiles, currentRoomRef, ['current', 'temp']),
                        pointName: 'currentTemp', val: '' },
                        { pointId: this.pointIDOrPointIDsWithCommaAndProfiles(this.buildings, profiles, currentRoomRef, ['temp', 'air', 'desired', 'heating']),
                        pointName: 'desiredTempHeating', val: '' },
                        { pointId: this.pointIDOrPointIDsWithCommaAndProfiles(this.buildings, profiles, currentRoomRef, ['temp', 'air', 'desired', 'cooling']),
                        pointName: 'desiredTempCooling', val: '' },
                        { pointId: this.pointIDOrPointIDsWithCommaAndProfiles(this.buildings, profiles, currentRoomRef, ['zone', 'occupancy', 'mode']),
                        pointName: 'zoneOccupancy', val: '' },
                        { pointId: this.pointIDOrPointIDsWithCommaAndProfiles(this.buildings, profiles, currentRoomRef, ['zone', 'his', 'status', 'enum']),
                        pointName: 'equipStatus', val: '' },
                        { pointId: this.pointIDOrPointIDsWithCommaAndProfiles(this.buildings, profiles, currentRoomRef, ['heartbeat']),
                        pointName: 'lastUpdated', val: '' }
                    ]
                };
            }

            let pointsList = [];
            pointsList = this.prefetchZonePoints[roomName].points.map(x => {
                if (x.pointId.includes(',')) {
                    const pointListWithProfiles = x.pointId.split(',');
                    pointListWithProfiles.forEach((point, index) => {
                        pointListWithProfiles[index] = point.split('|')[0];
                    });
                    pointListWithProfiles.join();
                    return pointListWithProfiles;
                } else {
                    return x.pointId.split('|')[0];
                }
            }).reduce(this.commaSeparatedPointIds).split(',');

            this.siteService.getCurrenthisReadMany(pointsList).subscribe(({ rows }) => {
                if (rows && rows.length > 0) {
                    pointsList = [];

                    // Data Filling in Array
                    this.prefetchZonePoints[roomName].points.forEach((singlePoint) => {
                        const findPointValueWithProfileDetails = (pointIDList) => {
                            const pointIds = pointIDList.split(',');
                            let output = '';
                            pointIds.forEach((point) => {
                                const filteredPointResponse = rows.filter((x) => {
                                    const resultPointId = this.helperService.stripHaystackTypeMapping(x.id.split(' ')[0]);
                                    const currentPoint = point.split('|')[0];
                                    if (currentPoint.includes(resultPointId)) { return x; }
                                })[0];

                                output += (filteredPointResponse && filteredPointResponse.data.length > 0 ?
                                    // tslint:disable-next-line: max-line-length
                                    this.helperService.stripHaystackTypeMapping(filteredPointResponse.data[0].val).split(' ')[0] : '') + '|' + point + ',';
                            });
                            return output;
                        };

                        // Multimodule
                        if (singlePoint.pointId.includes(',')) {
                            singlePoint.val = findPointValueWithProfileDetails(singlePoint.pointId);

                        } else {
                            const filteredPointResponse = rows.filter((x) => {
                                const resultPointId = this.helperService.stripHaystackTypeMapping(x.id.split(' ')[0]);
                                if (singlePoint.pointId.includes(resultPointId)) { return x; }
                            })[0];

                            singlePoint.val = filteredPointResponse.data.length > 0 ?
                                this.helperService.stripHaystackTypeMapping(filteredPointResponse.data[0].val).split(' ')[0] : undefined;

                        }
                    });

                    const lastUpdated = this.prefetchZonePoints[roomName].points.find(
                        x => x.pointName.includes('lastUpdated'))?.val;

                    // Assignment on Zone Object
                    if (this.prefetchZonePoints[roomName].points[0].pointId.includes(',')) {
                        const equipInput = this.prefetchZonePoints[roomName].points.find(
                            x => x.pointName.includes('equipStatus'))?.val;
                        objTemp['equipStatus'] = this.findEquipStatusforMultiModule(equipInput);

                        const zoneOccupancyInput = this.prefetchZonePoints[roomName].points.find(
                            x => x.pointName.includes('zoneOccupancy'))?.val;
                        objTemp['zoneOccupancy'] = this.findZoneOccupancyforMultiModule(zoneOccupancyInput);

                        const desiredTempHeatingInput = this.prefetchZonePoints[roomName].points.find(
                            x => x.pointName.includes('desiredTempHeating'))?.val;
                        objTemp['desiredTempHeating'] = this.findHeatingDesiredTempforMultiModule(desiredTempHeatingInput);

                        const desiredTempCoolingInput = this.prefetchZonePoints[roomName].points.find(
                            x => x.pointName.includes('desiredTempCooling'))?.val;
                        objTemp['desiredTempCooling'] = this.findCoolingDesiredTempforMultiModule(desiredTempCoolingInput);

                        const currentTempInput = this.prefetchZonePoints[roomName].points.find(
                            x => x.pointName.includes('currentTemp'))?.val;
                        objTemp['currentTemp'] = this.findCurrentTempforMultiModule(currentTempInput, equipInput);

                        objTemp['online'] = this.checkZoneOnline(lastUpdated);

                    } else {
                        objTemp['currentTemp'] = this.propertyValues(roomName, 'currentTemp');
                        objTemp['desiredTempHeating'] = this.propertyValues(roomName, 'desiredTempHeating');
                        objTemp['desiredTempCooling'] = this.propertyValues(roomName, 'desiredTempCooling');
                        objTemp['zoneOccupancy'] = this.propertyValues(roomName, 'zoneOccupancy');
                        objTemp['equipStatus'] = this.propertyValues(roomName, 'equipStatus');
                        objTemp['online'] = this.checkZoneOnline(lastUpdated);
                    }

                    if (typeof (objTemp.currentTemp) == 'number'
                        && typeof (objTemp.desiredTempHeating) == 'number'
                        && typeof (objTemp.desiredTempCooling) == 'number'
                        && typeof (objTemp.heatingdeadband) == 'number'
                        && typeof (objTemp.coolingdeadband) == 'number'
                        && typeof (objTemp.zoneOccupancy) == 'number'
                        && typeof (objTemp.equipStatus) == 'number') {
                        if (objTemp.equipStatus == 3) {
                            objTemp.tempColorToInsert = 'rgba(190,45,30,0.4)';
                            objTemp.strokeColor = 'rgba(190,45,30,0.65)';
                            // objTemp.hashedBackground = 'repeating-linear-gradient(-45deg, rgba(190,45,30,0.4) ,rgba(190,45,30,0.4) 4px,rgba(190,45,30,0.65) 4px,rgba(190,45,30,0.65) 8px)';
                        } else {
                            // case defaultfilter
                            console.log('Calling Default Filter');
                            objTemp = this.zoneDefaultFilter.defaultFilter(objTemp);
                        }
                    } else if (typeof (objTemp.currentTemp) == 'number'
                        && typeof (objTemp.desiredTempHeating) == 'number'
                        && typeof (objTemp.desiredTempCooling) == 'number'
                        && typeof (objTemp.heatingdeadband) == 'number'
                        && typeof (objTemp.coolingdeadband) == 'number'
                        && typeof (objTemp.zoneOccupancy) == 'number' && this.isProfileVRV(profiles)) {
                        console.log('rows.length : ', objTemp);
                    }
                    observer.next(objTemp);
                } else {
                    objTemp.currentTemp = '--';
                    objTemp.desiredTempHeating = '--';
                    objTemp.desiredTempCooling = '--';
                    objTemp.zoneOccupancy = '--';
                    // console.log(objTemp);
                    observer.next(objTemp);
                }
            },  _ => {
                    objTemp.currentTemp = '--';
                    objTemp.desiredTempHeating = '--';
                    objTemp.desiredTempCooling = '--';
                    objTemp.zoneOccupancy = '--';
                    // console.log('err :', objTemp);
                    observer.next(objTemp);
            });
        });
    }

    checkZoneOnline(lastUpdated) {
        if (!lastUpdated) { return false; }
        let isOnline = true;
        const values = lastUpdated.split(',');
        if (lastUpdated.indexOf(',') > -1) {
            values.pop();
        }
        if (values.length == 0) { return false; }
        for (let i = 0; i <= values.length - 1; i++) {
            let lastUpdatedTime = values[i].split('|')[0];
            if (!lastUpdatedTime) {
                isOnline = false;
                break;
            }
            lastUpdatedTime =  moment.utc(lastUpdatedTime).local();
            const timeDiffMinutes = Math.abs(lastUpdatedTime.diff(moment(), 'minutes'));
            if (timeDiffMinutes > 15) {
                isOnline = false;
                break;
            }
        }
        return isOnline;
    }


    generateShapeColors(floorId, incomingFloorData, originalRooms, shapes) {
        shapes = shapes.map(shape => {
            // We have a shape.roomId - which is the zone Id.
            let objTemp: any = {};

            const zoneId = this.helperService.stripHaystackTypeMapping(shape.roomId);
            const zoneElement = incomingFloorData.entities.find(entity => zoneId.includes(entity._id)) ?? {};
            const zoneName = (originalRooms.find(zone => zone && (zone.id === shape.roomId)) || {}).dis;

            // console.log('zoneId : ', zoneId, zoneElement, zoneName);
            objTemp.zoneId = zoneId;

            if (zoneElement) {
                if (zoneElement.entities && Array.isArray(zoneElement.entities) && zoneElement.entities.length > 0) {
                    const ccuDetails = this.getCCUPariedWithZone(zoneId);
                    if (ccuDetails) {
                        objTemp['ccuId'] = ccuDetails[0] ? ccuDetails[0] : '';
                        objTemp['ccuName'] = ccuDetails[1] ? ccuDetails[1] : '';
                    } else {
                        objTemp['ccuId'] = '';
                        objTemp['ccuName'] = '';
                    }

                    objTemp['ccuColor'] = this.getCCUColor(objTemp['ccuId']);

                    if (objTemp.ccuId == '') {
                        objTemp.tempColorToInsert = '#888';
                        objTemp.zonePaired = false;
                    }

                    const profiles = this.deviceHelper.getZoneProfile([zoneElement]);
                    // console.log(' profiles : ', profiles);
                    if (profiles.length) {
                        const currentRoomRef = this.helperService.stripHaystackTypeMapping(zoneId.split(' ')[0]);
                        if (new RegExp(/^(pid|emr|modbus|sense)$/).test(profiles[0].profileType)) {
                            objTemp.zoneNameLabelColor = '#000';
                            objTemp.tempColorToInsert = 'rgba(255,255,255,1)';
                            objTemp.strokeColor = 'rgba(147,147,147,0.6)';
                            // objTemp.hashedBackground = 'repeating-linear-gradient(-45deg, rgba(147,147,147,0.6) ,rgba(147,147,147,0.6) 4px,rgba(255,255,255,1) 4px,rgba(255,255,255,1) 8px)';

                            objTemp.currentRoomRef = currentRoomRef;
                            objTemp.floorId = floorId;
                            this.getZoneColor(currentRoomRef, zoneName, profiles).pipe(
                                // tap(res => console.log(res)),
                                catchError(_ => of({
                                    heatingdeadband: '--',
                                    coolingdeadband: '--',
                                    currentRoomRef,
                                    currentTemp: '--',
                                    desiredTempHeating: '--',
                                    desiredTempCooling: '--',
                                    zoneOccupancy: '--',
                                    online: false
                                })),
                                map(res => res)
                            ).subscribe(zoneColorInfo => {
                                zoneColorInfo.floorId = floorId;
                                this.setZoneColorsCalculated({...zoneColorInfo, ...objTemp});
                            });

                        } else {
                            this.getZoneColor(currentRoomRef, zoneName, profiles).pipe(
                                // tap(res => console.log(res)),
                                catchError(_ => of({
                                    heatingdeadband: '--',
                                    coolingdeadband: '--',
                                    currentRoomRef,
                                    currentTemp: '--',
                                    desiredTempHeating: '--',
                                    desiredTempCooling: '--',
                                    zoneOccupancy: '--',
                                    online: false
                                })),
                                map(res => res)
                            ).subscribe(zoneColorInfo => {
                                zoneColorInfo.floorId = floorId;
                                this.setZoneColorsCalculated({...zoneColorInfo, ...objTemp});
                            });
                        }
                    } else {
                        // What is this zone is not mapped to any profile?
                    }
                } else {  // This means that a zone was deleted, since it was last mapped via floorplanner.
                    objTemp = {};
                    objTemp.tempColorToInsert = '#888';
                    console.log('No Entities : ', objTemp);

                    const zoneColorInfo = {
                        heatingdeadband: '--',
                        coolingdeadband: '--',
                        currentRoomRef: zoneId,
                        floorId,
                        currentTemp: '--',
                        desiredTempHeating: '--',
                        desiredTempCooling: '--',
                        zoneOccupancy: '--'
                    };

                    this.setZoneColorsCalculated({...zoneColorInfo, ...objTemp});
                }
            }
                return shape;
        });
    }


    findEquipStatusforMultiModule = (input) => {
        if (input) {
            let output = input.split(',');
            output.pop();
            const zoneNonDeadProfilesEquipStatus = output.filter((x) => {
                const profiletype = x.split('|')[2];
                const val = Number(x.split('|')[0]);
                if ((new RegExp(/^(vav|dab|cpu|pipe2|pipe4|hpu|sse|ti|dualDuct|series|parallel)$/).test(profiletype)) && (val != 3)) {
                    return x;
                }
            });
            zoneNonDeadProfilesEquipStatus.map((x, index) => {
                zoneNonDeadProfilesEquipStatus[index] = Number(x.split('|')[0]);
            });

            if (zoneNonDeadProfilesEquipStatus.length == 0) {
                output = 3;
                return output;
            } else {
                output = this.mostOccuringArrayValues(zoneNonDeadProfilesEquipStatus);
                if (output.length == 1) {
                    return output[0];
                } else {
                    output = output.reduce((a, b) => Math.max(a, b));
                    return output;
                }
            }
        } else {
            return '--';
        }
    }

    findZoneOccupancyforMultiModule = (input) => {
        if (input) {
            let output = input.split(',');
            output.pop();
            const selectedProfilesZoneOccupancy = output.filter((x) => {
                const profiletype = x.split('|')[2];
                if ((new RegExp(/^(vav|dab|cpu|pipe2|pipe4|hpu|sse|ti|dualDuct|series|parallel)$/).test(profiletype))) {
                    return x;
                }
            });

            selectedProfilesZoneOccupancy.map((x, index) => {
                selectedProfilesZoneOccupancy[index] = Number(x.split('|')[0]);
            });
            output = this.mostOccuringArrayValues(selectedProfilesZoneOccupancy);
            if (output.length == 1) {
                return output[0];
            } else if (output.length == 0) {
                return 0;
            } else {
                output = output.reduce((a, b) => Math.max(a, b));
                return output;
            }
        } else {
            return '--';
        }
    }

    findHeatingDesiredTempforMultiModule = (input) => {
        let output = input.split(',');
        output.pop();
        const selectedProfilesHeatingDesired = output.filter((x) => {
            const profiletype = x.split('|')[2];
            if ((new RegExp(/^(vav|dab|cpu|pipe2|pipe4|hpu|sse|ti|dualDuct|series|parallel)$/).test(profiletype))) {
                return x;
            }
        });

        selectedProfilesHeatingDesired.map((x, index) => {
            selectedProfilesHeatingDesired[index] =
                !isNaN(Number(x.split('|')[0])) && isFinite(Number(x.split('|')[0])) ? Number(x.split('|')[0]) : undefined;
        });

        const checkforUndefined = selectedProfilesHeatingDesired.filter((x) => x === undefined);

        if (checkforUndefined.length > 0) {
            return '--';
        } else {
            output = this.mostOccuringArrayValues(selectedProfilesHeatingDesired);
            if (output.length == 1) {
                return output[0];
            } else if (output.length == 0) {
                return 0;
            } else {
                output = output.reduce((a, b) => Math.max(a, b));
                return output;
            }
        }
    }

    findCoolingDesiredTempforMultiModule = (input) => {
        let output = input.split(',');
        output.pop();
        const selectedProfilesCoolingDesired = output.filter((x) => {
            const profiletype = x.split('|')[2];
            if ((new RegExp(/^(vav|dab|cpu|pipe2|pipe4|hpu|sse|ti|dualDuct|series|parallel)$/).test(profiletype))) {
                return x;
            }
        });

        selectedProfilesCoolingDesired.map((x, index) => {
            selectedProfilesCoolingDesired[index] =
                !isNaN(Number(x.split('|')[0])) && isFinite(Number(x.split('|')[0])) ? Number(x.split('|')[0]) : undefined;
        });

        const checkforUndefined = selectedProfilesCoolingDesired.filter((x) => x === undefined);

        if (checkforUndefined.length > 0) {
            return '--';
        } else {
            output = this.mostOccuringArrayValues(selectedProfilesCoolingDesired);
            if (output.length == 1) {
                return output[0];
            } else if (output.length == 0) {
                return 0;
            } else {
                output = output.reduce((a, b) => Math.max(a, b));
                return output;
            }
        }
    }

    findCurrentTempforMultiModule = (input, equipStatusInput) => {
        let output;
        const inputValues = input.split(',');
        inputValues.pop();
        const compareConditions = equipStatusInput.split(',');
        compareConditions.pop();
        let selectedProfilesCurrentTemp = inputValues.filter((x) => {
            const profiletype = x.split('|')[2];
            const profileId = x.split('|')[3];
            if (new RegExp(/^(vav|dab|cpu|pipe2|pipe4|hpu|sse|ti|dualDuct|series|parallel)$/).test(profiletype)) {
                const correspondingEquipStatus = compareConditions.filter((y) => {
                    const equipStatusProfileId = y.split('|')[3];
                    if (profileId == equipStatusProfileId) {
                        return y;
                    }
                })[0];
                const equipStatus = Number(correspondingEquipStatus.split('|')[0]);
                if (equipStatus != 3) {
                    return x;
                }
            }
        });

        selectedProfilesCurrentTemp.map((x, index) => {
            selectedProfilesCurrentTemp[index] =
                !isNaN(parseFloat(x.split('|')[0])) && isFinite(parseFloat(x.split('|')[0])) ? parseFloat(x.split('|')[0]) : undefined;
        });

        const checkforUndefined = selectedProfilesCurrentTemp.filter((x) => x === undefined);
        if (checkforUndefined.length > 0) {
            return '--';
        } else {
            selectedProfilesCurrentTemp = selectedProfilesCurrentTemp.filter((x) => x != 0);
            output = selectedProfilesCurrentTemp.length == 0 ? '0' : this.average(selectedProfilesCurrentTemp).toFixed(1);
            return parseFloat(output);
        }
    }

    isProfileVRV(profiles) {
        let index = -1;
        if (profiles && profiles.length) {
             index = profiles.findIndex(p => p.profileType == 'vrv');
        }
        return index > -1;
    }
}
