/* tslint:disable */
import { Injectable } from '@angular/core';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { PucCMBoardPortsMappings } from '../models/heatmap-graph-widgets/puc-cmboard-ports-mappings.model';
import { HelperService } from './hs-helper.service';
import { SiteService } from './site.service';

@Injectable({ providedIn: 'root' })
export class RuntimeGraphService {
  portMappings: Array<PucCMBoardPortsMappings> = new Array<PucCMBoardPortsMappings>();

  cmBoardPortsMappingsSubject: Subject<any> = new Subject<any>();
  cmBoardPortsMappingsCollection: Map<string, Map<string, PucCMBoardPortsMappings>> =
    new Map<string, Map<string, PucCMBoardPortsMappings>>();
  iscmBoardPortsMappingsCollectionFetched: Map<string, boolean> = new Map<string, boolean>();
  iscmBoardPortsMappingsCollectionRequested: Map<string, boolean> = new Map<string, boolean>();

  iscmBoardPortsMappingsForDaikinCollectionFetched: Map<string, boolean> = new Map<string, boolean>();
  cmBoardPortsMappingsForDaikinSubject: Subject<any> = new Subject<any>();
  cmBoardPortsMappingsForDaikinCollection: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();

  isFullyModulatingProfileTagsFetched: Map<string, boolean> = new Map<string, boolean>();
  fullyModulatingProfileTagsCollection: Map<string, Map<string, PucCMBoardPortsMappings>> =
    new Map<string, Map<string, PucCMBoardPortsMappings>>();
  fullyModulatingProfileTagsSubject: Subject<any> = new Subject<any>();
  isFullyModulatingProfileTagsCollectionRequested: Map<string, boolean> = new Map<string, boolean>();
  isDaikinCollectionRequested: Map<string, boolean> = new Map<string, boolean>();

  runTimeProfile: Map<string, any> = new Map<string, any>();

  isRuntimeRendered = false;
  moduleWithRuntime: string = null;

  public cancelPendingRequestsSubject: Subject<any> = new Subject();

  constructor(private siteService: SiteService,
    private helperService: HelperService) { }

  getCMPortsMapping(equipRef: string) {
    const cmBoardPortsMappingsCollectionLocal: Map<string, PucCMBoardPortsMappings> = new Map<string, PucCMBoardPortsMappings>();

    if (this.iscmBoardPortsMappingsCollectionFetched.get(equipRef)) {
      //If data already fetched , just send the requested , no need to fetch again
      this.cmBoardPortsMappingsSubject.next(this.cmBoardPortsMappingsCollection.get(equipRef));
    }
    else {
      if (!this.iscmBoardPortsMappingsCollectionRequested.get(equipRef)) {
        this.iscmBoardPortsMappingsCollectionRequested.set(equipRef, true);
        //Cooling Stage 1
        const coolingStage1_Query = "system and cmd and cooling and stage1"
        const coolingStage1_Sub = this.siteService.getQuerybyEquipRef(equipRef, coolingStage1_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Cooling Stage 2
        const coolingStage2_Query = "system and cmd and cooling and stage2"
        const coolingStage2_Sub = this.siteService.getQuerybyEquipRef(equipRef, coolingStage2_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Cooling Stage 3
        const coolingStage3_Query = "system and cmd and cooling and stage3"
        const coolingStage3_Sub = this.siteService.getQuerybyEquipRef(equipRef, coolingStage3_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Cooling Stage 4
        const coolingStage4_Query = "system and cmd and cooling and stage4"
        const coolingStage4_Sub = this.siteService.getQuerybyEquipRef(equipRef, coolingStage4_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Cooling Stage 5
        const coolingStage5_Query = "system and cmd and cooling and stage5"
        const coolingStage5_Sub = this.siteService.getQuerybyEquipRef(equipRef, coolingStage5_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Heating Stage 1
        const heatingStage1_Query = "system and cmd and heating and stage1"
        const heatingStage1_Sub = this.siteService.getQuerybyEquipRef(equipRef, heatingStage1_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Heating Stage 2
        const heatingStage2_Query = "system and cmd and heating and stage2"
        const heatingStage2_Sub = this.siteService.getQuerybyEquipRef(equipRef, heatingStage2_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Heating Stage 3
        const heatingStage3_Query = "system and cmd and heating and stage3"
        const heatingStage3_Sub = this.siteService.getQuerybyEquipRef(equipRef, heatingStage3_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Heating Stage 4
        const heatingStage4_Query = "system and cmd and heating and stage4"
        const heatingStage4_Sub = this.siteService.getQuerybyEquipRef(equipRef, heatingStage4_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Heating Stage 5
        const heatingStage5_Query = "system and cmd and heating and stage5"
        const heatingStage5_Sub = this.siteService.getQuerybyEquipRef(equipRef, heatingStage5_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Fan Stage 1
        const fanStage1_Query = "system and cmd and fan and stage1"
        const fanStage1_Sub = this.siteService.getQuerybyEquipRef(equipRef, fanStage1_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Fan Stage 2
        const fanStage2_Query = "system and cmd and fan and stage2"
        const fanStage2_Sub = this.siteService.getQuerybyEquipRef(equipRef, fanStage2_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Fan Stage 3
        const fanStage3_Query = "system and cmd and fan and stage3"
        const fanStage3_Sub = this.siteService.getQuerybyEquipRef(equipRef, fanStage3_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Fan Stage 4
        const fanStage4_Query = "system and cmd and fan and stage4"
        const fanStage4_Sub = this.siteService.getQuerybyEquipRef(equipRef, fanStage4_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Fan Stage 5
        const fanStage5_Query = "system and cmd and fan and stage5"
        const fanStage5_Sub = this.siteService.getQuerybyEquipRef(equipRef, fanStage5_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Humidifier
        const humidifier_Query = "system and cmd and humidifier"
        const humidifier_Sub = this.siteService.getQuerybyEquipRef(equipRef, humidifier_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //DeHumidifier
        const dehumidifier_Query = "system and cmd and dehumidifier"
        const dehumidifier_Sub = this.siteService.getQuerybyEquipRef(equipRef, dehumidifier_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Fan Signal
        const modulatingFanSpeed_Query = "system and cmd and fan and modulating"
        const modulatingFanSpeed_Sub = this.siteService.getQuerybyEquipRef(equipRef, modulatingFanSpeed_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Cooling Signal
        const modulatingCooling_Query = "system and cmd and cooling and modulating"
        const modulatingCooling_Sub = this.siteService.getQuerybyEquipRef(equipRef, modulatingCooling_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Heating Signal
        const modulatingHeating_Query = "system and cmd and heating and modulating"
        const modulatingHeating_Sub = this.siteService.getQuerybyEquipRef(equipRef, modulatingHeating_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //Composite Signal
        const compositeSignal_Query = "system and cmd and composite and modulating"
        const compositeSignal_Sub = this.siteService.getQuerybyEquipRef(equipRef, compositeSignal_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        forkJoin([
          coolingStage1_Sub, coolingStage2_Sub, coolingStage3_Sub, coolingStage4_Sub, coolingStage5_Sub,
          heatingStage1_Sub, heatingStage2_Sub, heatingStage3_Sub, heatingStage4_Sub, heatingStage5_Sub,
          fanStage1_Sub, fanStage2_Sub, fanStage3_Sub, fanStage4_Sub, fanStage5_Sub,
          humidifier_Sub, dehumidifier_Sub,
          modulatingFanSpeed_Sub,
          modulatingCooling_Sub,
          modulatingHeating_Sub,
          compositeSignal_Sub
        ]).subscribe(logicalMappings => {
          //cooling stages
          const coolingStage1 = logicalMappings[0];
          const coolingStage1Mappings = new PucCMBoardPortsMappings("", false, "coolingStage1");
          if (coolingStage1 && coolingStage1.rows.length) {
            coolingStage1Mappings.isEnabled = true;
            this.helperService.parseRef(coolingStage1.rows[0].id) != "" ? coolingStage1Mappings.ref = this.helperService.parseRef(coolingStage1.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("coolingStage1", coolingStage1Mappings);

          const coolingStage2 = logicalMappings[1];
          const coolingStage2Mappings = new PucCMBoardPortsMappings("", false, "coolingStage2");
          if (coolingStage2 && coolingStage2.rows.length) {
            coolingStage2Mappings.isEnabled = true;
            this.helperService.parseRef(coolingStage2.rows[0].id) != "" ? coolingStage2Mappings.ref = this.helperService.parseRef(coolingStage2.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("coolingStage2", coolingStage2Mappings);

          const coolingStage3 = logicalMappings[2];
          const coolingStage3Mappings = new PucCMBoardPortsMappings("", false, "coolingStage3");
          if (coolingStage3 && coolingStage3.rows.length) {
            coolingStage3Mappings.isEnabled = true;
            this.helperService.parseRef(coolingStage3.rows[0].id) != "" ? coolingStage3Mappings.ref = this.helperService.parseRef(coolingStage3.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("coolingStage3", coolingStage3Mappings);

          const coolingStage4 = logicalMappings[3];
          const coolingStage4Mappings = new PucCMBoardPortsMappings("", false, "coolingStage4");
          if (coolingStage4 && coolingStage4.rows.length) {
            coolingStage4Mappings.isEnabled = true;
            this.helperService.parseRef(coolingStage4.rows[0].id) != "" ? coolingStage4Mappings.ref = this.helperService.parseRef(coolingStage4.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("coolingStage4", coolingStage4Mappings);

          const coolingStage5 = logicalMappings[4];
          const coolingStage5Mappings = new PucCMBoardPortsMappings("", false, "coolingStage5");
          if (coolingStage5 && coolingStage5.rows.length) {
            coolingStage5Mappings.isEnabled = true;
            this.helperService.parseRef(coolingStage5.rows[0].id) != "" ? coolingStage5Mappings.ref = this.helperService.parseRef(coolingStage5.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("coolingStage5", coolingStage5Mappings);

          //heating stages
          const heatingStage1 = logicalMappings[5];
          const heatingStage1Mappings = new PucCMBoardPortsMappings("", false, "heatingStage1");
          if (heatingStage1 && heatingStage1.rows.length) {
            heatingStage1Mappings.isEnabled = true;
            this.helperService.parseRef(heatingStage1.rows[0].id) != "" ? heatingStage1Mappings.ref = this.helperService.parseRef(heatingStage1.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("heatingStage1", heatingStage1Mappings);

          const heatingStage2 = logicalMappings[6];
          const heatingStage2Mappings = new PucCMBoardPortsMappings("", false, "heatingStage2");
          if (heatingStage2 && heatingStage2.rows.length) {
            heatingStage2Mappings.isEnabled = true;
            this.helperService.parseRef(heatingStage2.rows[0].id) != "" ? heatingStage2Mappings.ref = this.helperService.parseRef(heatingStage2.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("heatingStage2", heatingStage2Mappings);

          const heatingStage3 = logicalMappings[7];
          const heatingStage3Mappings = new PucCMBoardPortsMappings("", false, "heatingStage3");
          if (heatingStage3 && heatingStage3.rows.length) {
            heatingStage3Mappings.isEnabled = true;
            this.helperService.parseRef(heatingStage3.rows[0].id) != "" ? heatingStage3Mappings.ref = this.helperService.parseRef(heatingStage3.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("heatingStage3", heatingStage3Mappings);

          const heatingStage4 = logicalMappings[8];
          const heatingStage4Mappings = new PucCMBoardPortsMappings("", false, "heatingStage4");
          if (heatingStage4 && heatingStage4.rows.length) {
            heatingStage4Mappings.isEnabled = true;
            this.helperService.parseRef(heatingStage4.rows[0].id) != "" ? heatingStage4Mappings.ref = this.helperService.parseRef(heatingStage4.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("heatingStage4", heatingStage4Mappings);

          const heatingStage5 = logicalMappings[9];
          const heatingStage5Mappings = new PucCMBoardPortsMappings("", false, "heatingStage5");
          if (heatingStage5 && heatingStage5.rows.length) {
            heatingStage5Mappings.isEnabled = true;
            this.helperService.parseRef(heatingStage5.rows[0].id) != "" ? heatingStage5Mappings.ref = this.helperService.parseRef(heatingStage5.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("heatingStage5", heatingStage5Mappings);

          //fan stages
          const fanStage1 = logicalMappings[10];
          const fanStage1Mappings = new PucCMBoardPortsMappings("", false, "fanStage1");
          if (fanStage1 && fanStage1.rows.length) {
            fanStage1Mappings.isEnabled = true;
            this.helperService.parseRef(fanStage1.rows[0].id) != "" ? fanStage1Mappings.ref = this.helperService.parseRef(fanStage1.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("fanStage1", fanStage1Mappings);

          const fanStage2 = logicalMappings[11];
          const fanStage2Mappings = new PucCMBoardPortsMappings("", false, "fanStage2");
          if (fanStage2 && fanStage2.rows.length) {
            fanStage2Mappings.isEnabled = true;
            this.helperService.parseRef(fanStage2.rows[0].id) != "" ? fanStage2Mappings.ref = this.helperService.parseRef(fanStage2.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("fanStage2", fanStage2Mappings);

          const fanStage3 = logicalMappings[12];
          const fanStage3Mappings = new PucCMBoardPortsMappings("", false, "fanStage3");
          if (fanStage3 && fanStage3.rows.length) {
            fanStage3Mappings.isEnabled = true;
            this.helperService.parseRef(fanStage3.rows[0].id) != "" ? fanStage3Mappings.ref = this.helperService.parseRef(fanStage3.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("fanStage3", fanStage3Mappings);

          const fanStage4 = logicalMappings[13];
          const fanStage4Mappings = new PucCMBoardPortsMappings("", false, "fanStage4");
          if (fanStage4 && fanStage4.rows.length) {
            fanStage4Mappings.isEnabled = true;
            this.helperService.parseRef(fanStage4.rows[0].id) != "" ? fanStage4Mappings.ref = this.helperService.parseRef(fanStage4.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("fanStage4", fanStage4Mappings);

          const fanStage5 = logicalMappings[14];
          const fanStage5Mappings = new PucCMBoardPortsMappings("", false, "fanStage5");
          if (fanStage5 && fanStage5.rows.length) {
            fanStage5Mappings.isEnabled = true;
            this.helperService.parseRef(fanStage5.rows[0].id) != "" ? fanStage5Mappings.ref = this.helperService.parseRef(fanStage5.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("fanStage5", fanStage5Mappings);

          //Humidifier
          const humidifier = logicalMappings[15];
          const humidifierMappings = new PucCMBoardPortsMappings("", false, "humidifier");
          if (humidifier && humidifier.rows.length) {
            humidifierMappings.isEnabled = true;
            this.helperService.parseRef(humidifier.rows[0].id) != "" ? humidifierMappings.ref = this.helperService.parseRef(humidifier.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("humidifier", humidifierMappings);

          //DeHumidifier
          const deHumidifier = logicalMappings[16];
          const dehumidifierMappings = new PucCMBoardPortsMappings("", false, "dehumidifier");
          if (deHumidifier && deHumidifier.rows.length) {
            dehumidifierMappings.isEnabled = true;
            this.helperService.parseRef(deHumidifier.rows[0].id) != "" ? dehumidifierMappings.ref = this.helperService.parseRef(deHumidifier.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("dehumidifier", dehumidifierMappings);

          //Fan Signal
          const modulatingFanSpeed = logicalMappings[17];
          const modulatingFanSpeedMappings = new PucCMBoardPortsMappings("", false, "modulatingFanSpeed");
          if (modulatingFanSpeed && modulatingFanSpeed.rows.length) {
            modulatingFanSpeedMappings.isEnabled = true;
            this.helperService.parseRef(modulatingFanSpeed.rows[0].id) != "" ? modulatingFanSpeedMappings.ref = this.helperService.parseRef(modulatingFanSpeed.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("modulatingFanSpeed", modulatingFanSpeedMappings);

          //Cooling Signal
          const modulatingCooling = logicalMappings[18];
          const modulatingCoolingMappings = new PucCMBoardPortsMappings("", false, "modulatingCooling");
          if (modulatingCooling && modulatingCooling.rows.length) {
            modulatingCoolingMappings.isEnabled = true;
            this.helperService.parseRef(modulatingCooling.rows[0].id) != "" ? modulatingCoolingMappings.ref = this.helperService.parseRef(modulatingCooling.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("modulatingCooling", modulatingCoolingMappings);

          //Heating Signal
          const modulatingHeating = logicalMappings[19];
          const modulatingHeatingMappings = new PucCMBoardPortsMappings("", false, "modulatingHeating");
          if (modulatingHeating && modulatingHeating.rows.length) {
            modulatingHeatingMappings.isEnabled = true;
            this.helperService.parseRef(modulatingHeating.rows[0].id) != "" ? modulatingHeatingMappings.ref = this.helperService.parseRef(modulatingHeating.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("modulatingHeating", modulatingHeatingMappings);

          //Composite Signal
          const compositeSignal = logicalMappings[20];
          const compositeSignalMappings = new PucCMBoardPortsMappings("", false, "compositeSignal");
          if (compositeSignal && compositeSignal.rows.length) {
            compositeSignalMappings.isEnabled = true;
            this.helperService.parseRef(compositeSignal.rows[0].id) != "" ? compositeSignalMappings.ref = this.helperService.parseRef(compositeSignal.rows[0].id) : '';
          }
          cmBoardPortsMappingsCollectionLocal.set("compositeSignal", compositeSignalMappings);

          this.cmBoardPortsMappingsCollection.set(equipRef, cmBoardPortsMappingsCollectionLocal);
          this.iscmBoardPortsMappingsCollectionFetched.set(equipRef, true);
          this.cmBoardPortsMappingsSubject.next(this.cmBoardPortsMappingsCollection.get(equipRef));
        });
      }
    }
  }

  getCMPortsMappingForDaikin(ahuRef: string) {
    let queryParams = '';
    let ref = '';
    const cmBoardPortsMappingsForDaikinCollectionLocal: Map<string, string> = new Map<string, string>();

    if (this.iscmBoardPortsMappingsForDaikinCollectionFetched.get(ahuRef)) {
      // If data already fetched , just send the requested , no need to fetch again
      this.cmBoardPortsMappingsForDaikinSubject.next(this.cmBoardPortsMappingsForDaikinCollection.get(ahuRef));
    } else {
      if (!this.isDaikinCollectionRequested.get(ahuRef)) {
        this.isDaikinCollectionRequested.set(ahuRef, true);
        // coolingDischargeAirTemperature
        queryParams = 'system and discharge and temp and cooling and air and temp';
        const coolingDischargeAirTemperature_sub = this.siteService.getQuerybyEquipRef(ahuRef, queryParams)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject))
         
        // heatingDischargeAirTemperature
        queryParams = 'system and discharge and temp and heating and air and temp';
        const heatingDischargeAirTemperature_sub = this.siteService.getQuerybyEquipRef(ahuRef, queryParams)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject))
          

        // ConditionMode
        queryParams = 'system and mode and operating';
        const operatingMode_sub = this.siteService.getQuerybyEquipRef(ahuRef, queryParams)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject))
          

        // fan Speed
        queryParams = 'system and fan and cmd';
        const fanSpeed_sub = this.siteService.getQuerybyEquipRef(ahuRef, queryParams)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject))

      // fan Loop Output 
        queryParams = 'system and fan and loop and output';
        const fanLoopOutput_sub = this.siteService.getQuerybyEquipRef(ahuRef, queryParams)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject))

      //Static Pressure
        queryParams = 'system and staticPressure and cmd';
       const staticPressure_sub = this.siteService.getQuerybyEquipRef(ahuRef, queryParams)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject))
         
          forkJoin([
            coolingDischargeAirTemperature_sub, heatingDischargeAirTemperature_sub, operatingMode_sub, fanSpeed_sub ,fanLoopOutput_sub,staticPressure_sub
          ]).subscribe(logicalMappings => {
              if (logicalMappings[0] && logicalMappings[0].rows.length) {
                this.helperService.parseRef(logicalMappings[0].rows[0].id) !== '' ? ref = this.helperService.parseRef(logicalMappings[0].rows[0].id) : '';
                cmBoardPortsMappingsForDaikinCollectionLocal.set('CoolingDischargeAirTemperature', ref);
              }
               if (logicalMappings[1] && logicalMappings[1].rows.length) {
                this.helperService.parseRef(logicalMappings[1].rows[0].id) !== '' ? ref = this.helperService.parseRef(logicalMappings[1].rows[0].id) : '';
                cmBoardPortsMappingsForDaikinCollectionLocal.set('HeatingDischargeAirTemperature', ref);
              }
              if (logicalMappings[2] && logicalMappings[2].rows.length) {
                this.helperService.parseRef(logicalMappings[2].rows[0].id) !== '' ? ref = this.helperService.parseRef(logicalMappings[2].rows[0].id) : '';
                cmBoardPortsMappingsForDaikinCollectionLocal.set('conditioningMode', ref);
              }
                if (logicalMappings[3] && logicalMappings[3].rows.length) {
                this.helperService.parseRef(logicalMappings[3].rows[0].id) !== '' ? ref = this.helperService.parseRef(logicalMappings[3].rows[0].id) : '';
                cmBoardPortsMappingsForDaikinCollectionLocal.set('FanSpeed', ref);
              }
              if (logicalMappings[4] && logicalMappings[4].rows.length) {
                this.helperService.parseRef(logicalMappings[4].rows[0].id) !== '' ? ref = this.helperService.parseRef(logicalMappings[4].rows[0].id) : '';
                cmBoardPortsMappingsForDaikinCollectionLocal.set('FanLoopOutput', ref);
              }     
              if (logicalMappings[5] && logicalMappings[5].rows.length) {
                this.helperService.parseRef(logicalMappings[5].rows[0].id) !== '' ? ref = this.helperService.parseRef(logicalMappings[5].rows[0].id) : '';
                cmBoardPortsMappingsForDaikinCollectionLocal.set('StaticPressure', ref);
              }
            
              this.cmBoardPortsMappingsForDaikinCollection.set(ahuRef, cmBoardPortsMappingsForDaikinCollectionLocal);
              this.cmBoardPortsMappingsForDaikinSubject.next(this.cmBoardPortsMappingsForDaikinCollection.get(ahuRef));
              this.iscmBoardPortsMappingsForDaikinCollectionFetched.set(ahuRef, true);
              this.isDaikinCollectionRequested.set(ahuRef, true);
          });
      }
    }
  }

  async getFullyModulatingProfileTags(ahuRef: string, gateWayRef: string) {
    const fullyModulatingProfileTagsCollectionLocal: Map<string, PucCMBoardPortsMappings> = new Map<string, PucCMBoardPortsMappings>();

    if (this.isFullyModulatingProfileTagsFetched.get(ahuRef)) {
      // If data already fetched , just send the requested , no need to fetch again
      this.fullyModulatingProfileTagsSubject.next(this.fullyModulatingProfileTagsCollection.get(ahuRef));
    } else {
      if (!this.isFullyModulatingProfileTagsCollectionRequested.get(ahuRef)) {
        this.isFullyModulatingProfileTagsCollectionRequested.set(ahuRef, true);
        let btuEquipId = '';
        const res = await this.siteService.getEquipByGateRef('btu and equip',gateWayRef).toPromise();
        if(res && res['rows'] && res['rows'].length > 0) {
          btuEquipId = this.helperService.parseRef(res.rows[0].id);
        }
        // cooling
        const cooling_Query = 'system and cooling and cmd';
        const cooling_Sub = this.siteService.getQuerybyEquipRef(ahuRef, cooling_Query)
          .pipe(catchError(err => of(undefined)),
          takeUntil(this.cancelPendingRequestsSubject));
          
        // fanSpeed
        const fanSpeed_Query = 'system and fan and cmd';
        const fanSpeed_Sub = this.siteService.getQuerybyEquipRef(ahuRef, fanSpeed_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        // heating
        const heating_Query = 'system and heating and cmd';
        const heating_Sub = this.siteService.getQuerybyEquipRef(ahuRef, heating_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        // systemOutsideAirTemp
        const systemOutsideAirTemp_Query = 'system and temp and outside';
        const systemOutsideAirTemp_Sub = this.siteService.getQuerybyEquipRef(ahuRef, systemOutsideAirTemp_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        // fanEnable
        const fanEnable_Query = 'system and occupancy and cmd';
        const fanEnable_Sub = this.siteService.getQuerybyEquipRef(ahuRef, fanEnable_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        // systemDeHumidifier
        const systemDeHumidifier_Query = 'system and dehumidifier and cmd';
        const systemDeHumidifier_Sub = this.siteService.getQuerybyEquipRef(ahuRef, systemDeHumidifier_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        // systemHumidifier
        const systemHumidifier_Query = 'system and humidifier and cmd';
        const systemHumidifier_Sub = this.siteService.getQuerybyEquipRef(ahuRef, systemHumidifier_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));


        // chilledwater
        const chilledwatervalveposition_Query = 'system and loop and output and valve';
        const chilledwatervalveposition_Sub = this.siteService.getQuerybyEquipRef(ahuRef,chilledwatervalveposition_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        // Inlet
        const inletchilledwatertemperature_Query = 'inlet and t1 and temp';
        const inletchilledwatertemperature_Sub = this.siteService.getQuerybyEquipRef(btuEquipId,inletchilledwatertemperature_Query)
          .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //outlet
        const exitchilledwatertemperature_Query = 'outlet and t2 and temp';
        const exitchilledwatertemperature_Sub = this.siteService.getQuerybyEquipRef(btuEquipId,exitchilledwatertemperature_Query)
        .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));

        //chilledwatertargetexittemperature
        const chilledwatertargetexittemperature_Query = 'chilled and water and exit and temp and target';
        const chilledwatertargetexittemperature_Sub = this.siteService.getQuerybyEquipRef(ahuRef,chilledwatertargetexittemperature_Query)
        .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));



         //adaptivecomfortthreshold
         const adaptivecomfortthreshold_Query = 'adaptive and threshold and comfort';
         const adaptivecomfortthreshold_Sub = this.siteService.getQuerybyEquipRef(ahuRef,adaptivecomfortthreshold_Query)
         .pipe(catchError(err => of(undefined)),takeUntil(this.cancelPendingRequestsSubject));


        forkJoin([
          cooling_Sub, fanSpeed_Sub, heating_Sub, systemOutsideAirTemp_Sub, fanEnable_Sub,
          systemDeHumidifier_Sub, systemHumidifier_Sub, chilledwatervalveposition_Sub,inletchilledwatertemperature_Sub,
          exitchilledwatertemperature_Sub,chilledwatertargetexittemperature_Sub,adaptivecomfortthreshold_Sub
        ]).subscribe(logicalMappings => {
          /* istanbul ignore if  */
          if (logicalMappings) {
            // cooling
            const cooling = logicalMappings[0];
            const coolingMappings = new PucCMBoardPortsMappings('', false, 'cooling');
            if (cooling && cooling.rows.length) {
              coolingMappings.isEnabled = true;
              this.helperService.parseRef(cooling.rows[0].id) !== '' ? coolingMappings.ref = this.helperService.parseRef(cooling.rows[0].id) : '';
            }
            fullyModulatingProfileTagsCollectionLocal.set('cooling', coolingMappings);

            // fanSpeed
            const fanSpeed = logicalMappings[1];
            const fanSpeedMappings = new PucCMBoardPortsMappings('', false, 'fanSpeed');
            if (fanSpeed && fanSpeed.rows.length) {
              fanSpeedMappings.isEnabled = true;
              this.helperService.parseRef(fanSpeed.rows[0].id) !== '' ? fanSpeedMappings.ref = this.helperService.parseRef(fanSpeed.rows[0].id) : '';
            }
            fullyModulatingProfileTagsCollectionLocal.set('fanSpeed', fanSpeedMappings);

            // heating
            const heating = logicalMappings[2];
            const heatingMappings = new PucCMBoardPortsMappings('', false, 'heating');
            if (heating && heating.rows.length) {
              heatingMappings.isEnabled = true;
              this.helperService.parseRef(heating.rows[0].id) !== '' ? heatingMappings.ref = this.helperService.parseRef(heating.rows[0].id) : '';
            }
            fullyModulatingProfileTagsCollectionLocal.set('heating', heatingMappings);

            // systemOutsideAirTemp
            const systemOutsideAirTemp = logicalMappings[3];
            const systemOutsideAirTempMappings = new PucCMBoardPortsMappings('', false, 'systemOutsideAirTemp');
            if (systemOutsideAirTemp && systemOutsideAirTemp.rows.length) {
              systemOutsideAirTempMappings.isEnabled = true;
              this.helperService.parseRef(systemOutsideAirTemp.rows[0].id) !== '' ? systemOutsideAirTempMappings.ref = this.helperService.parseRef(systemOutsideAirTemp.rows[0].id) : '';
            }
            fullyModulatingProfileTagsCollectionLocal.set('systemOutsideAirTemp', systemOutsideAirTempMappings);

            // fanEnable
            const fanEnable = logicalMappings[4];
            const fanEnableMappings = new PucCMBoardPortsMappings('', false, 'fanEnable');
            if (fanEnable && fanEnable.rows.length) {
              fanEnableMappings.isEnabled = true;
              this.helperService.parseRef(fanEnable.rows[0].id) !== '' ? fanEnableMappings.ref = this.helperService.parseRef(fanEnable.rows[0].id) : '';
            }
            fullyModulatingProfileTagsCollectionLocal.set('fanEnable', fanEnableMappings);

            // systemDeHumidifier
            const systemDeHumidifier = logicalMappings[5];
            const systemDeHumidifierMappings = new PucCMBoardPortsMappings('', false, 'systemDeHumidifier');
            if (systemDeHumidifier && systemDeHumidifier.rows.length) {
              systemDeHumidifierMappings.isEnabled = true;
              this.helperService.parseRef(systemDeHumidifier.rows[0].id) !== '' ? systemDeHumidifierMappings.ref = this.helperService.parseRef(systemDeHumidifier.rows[0].id) : '';
            }
            fullyModulatingProfileTagsCollectionLocal.set('systemDeHumidifier', systemDeHumidifierMappings);

            // systemHumidifier
            const systemHumidifier = logicalMappings[6];
            const systemHumidifierMappings = new PucCMBoardPortsMappings('', false, 'systemHumidifier');
            if (systemDeHumidifier && systemHumidifier.rows.length) {
              systemHumidifierMappings.isEnabled = true;
              this.helperService.parseRef(systemHumidifier.rows[0].id) !== '' ? systemHumidifierMappings.ref = this.helperService.parseRef(systemHumidifier.rows[0].id) : '';
            }
            fullyModulatingProfileTagsCollectionLocal.set('systemHumidifier', systemHumidifierMappings);

            // systemHumidifier
            const chilledwatervalveposition = logicalMappings[7];
            const chilledwatervalvepositionMappings = new PucCMBoardPortsMappings('', false, 'chilledwatervalveposition');
            if (chilledwatervalveposition && chilledwatervalveposition.rows.length) {
              chilledwatervalvepositionMappings.isEnabled = true;
              this.helperService.parseRef(chilledwatervalveposition.rows[0].id) !== '' ? chilledwatervalvepositionMappings.ref = this.helperService.parseRef(chilledwatervalveposition.rows[0].id) : '';
            }
            fullyModulatingProfileTagsCollectionLocal.set('chilledwatervalveposition', chilledwatervalvepositionMappings);     
            
            //inlet
            const inletchilledwatertemperature = logicalMappings[8];
            const inletchilledwatertemperatureMappings = new PucCMBoardPortsMappings('', false, 'inletchilledwatertemperature');
            if (inletchilledwatertemperature && inletchilledwatertemperature.rows.length) {
                  inletchilledwatertemperatureMappings.isEnabled = true;
                  this.helperService.parseRef(inletchilledwatertemperature.rows[0].id) !== '' ? inletchilledwatertemperatureMappings.ref = this.helperService.parseRef(inletchilledwatertemperature.rows[0].id) : '';
            }
            fullyModulatingProfileTagsCollectionLocal.set('inletchilledwatertemperature', inletchilledwatertemperatureMappings);           
       
                        
            //outlet
            const exitchilledwatertemperature = logicalMappings[9];
            const exitchilledwatertemperatureMappings = new PucCMBoardPortsMappings('', false, 'exitchilledwatertemperature');
            if (exitchilledwatertemperature && exitchilledwatertemperature.rows.length) {
                exitchilledwatertemperatureMappings.isEnabled = true;
                  this.helperService.parseRef(exitchilledwatertemperature.rows[0].id) !== '' ? exitchilledwatertemperatureMappings.ref = this.helperService.parseRef(exitchilledwatertemperature.rows[0].id) : '';
            }
            fullyModulatingProfileTagsCollectionLocal.set('exitchilledwatertemperature', exitchilledwatertemperatureMappings);      

            //chilledwatertargetexittemperature_Sub
            const chilledwatertargetexittemperature = logicalMappings[10];
            const chilledwatertargetexittemperatureMappings = new PucCMBoardPortsMappings('', false, 'chilledwatertargetexittemperature');
            if (chilledwatertargetexittemperature && chilledwatertargetexittemperature.rows.length) {
              chilledwatertargetexittemperatureMappings.isEnabled = true;
                  this.helperService.parseRef(chilledwatertargetexittemperature.rows[0].id) !== '' ? chilledwatertargetexittemperatureMappings.ref = this.helperService.parseRef(chilledwatertargetexittemperature.rows[0].id) : '';
            }
            fullyModulatingProfileTagsCollectionLocal.set('chilledwatertargetexittemperature', chilledwatertargetexittemperatureMappings); 
           // adaptivecomfortthreshold_Sub   
           const  adaptivecomfortthreshold  = logicalMappings[11];
           const adaptivecomfortthresholdMappings = new PucCMBoardPortsMappings('', false, 'adaptivecomfortthreshold');
           if (adaptivecomfortthreshold && adaptivecomfortthreshold.rows.length) {
                adaptivecomfortthresholdMappings.isEnabled = true;
                this.helperService.parseRef(adaptivecomfortthreshold.rows[0].id) !== '' ? adaptivecomfortthresholdMappings.ref = this.helperService.parseRef(adaptivecomfortthreshold.rows[0].id) : '';
           }
           fullyModulatingProfileTagsCollectionLocal.set('adaptivecomfortthreshold', adaptivecomfortthresholdMappings)
            this.fullyModulatingProfileTagsCollection.set(ahuRef, fullyModulatingProfileTagsCollectionLocal);
            this.fullyModulatingProfileTagsSubject.next(this.fullyModulatingProfileTagsCollection.get(ahuRef));
            this.isFullyModulatingProfileTagsFetched.set(ahuRef, true);
          }
        });
      }
    }
  }
}
