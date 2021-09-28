import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PucOaoModesGraphWidget } from '../models/heatmap-system-widgtes/puc-oao-modes-graph-widget';
import { PucSystemAvgTempGraphWidget } from '../models/heatmap-system-widgtes/puc-system-avg-temp-graph-widget';
import { PucSystemBatteryGraphWidget } from '../models/heatmap-system-widgtes/puc-system-battery-graph-widget';
import { PucSystemCmDataGraphWidget } from '../models/heatmap-system-widgtes/puc-system-cm-data-graph-widget';
import { PucSystemComfortIndexGraphWidget } from '../models/heatmap-system-widgtes/puc-system-comfort-index-graph-widget';
import { PucSystemDefaultProfileGraphWidget } from '../models/heatmap-system-widgtes/puc-system-default-profile-graph-widget';
import { PucSystemHumidityGraphWidget } from '../models/heatmap-system-widgtes/puc-system-humidity-graph-widget';
import { PucSystemModesGraphWidget } from '../models/heatmap-system-widgtes/puc-system-modes-graph-widget';
import { PucSystemOaoAirflowTempGraphWidget } from '../models/heatmap-system-widgtes/puc-system-oao-airflow-temp-graph-widget';
import { PucSystemOaoGraphWidget } from '../models/heatmap-system-widgtes/puc-system-oao-graph-widget';
import { PucSystemOutsideTempGraphWidget } from '../models/heatmap-system-widgtes/puc-system-outside-temp-graph-widget';
import { PucSystemVavDabAnalogRtuGraphWidget } from '../models/heatmap-system-widgtes/puc-system-vav-dab-analog-rtu-graph-widget';
import { PucSystemVavDabDaikinIEGraphWidget } from '../models/heatmap-system-widgtes/puc-system-vav-dab-daikin-iegraph-widget';
import { PucSystemVavDabHybridRtuGraphWidget } from '../models/heatmap-system-widgtes/puc-system-vav-dab-hybrid-rtu-graph-widget';
import { PucSystemVavDabStagedRtuGraphWidget } from '../models/heatmap-system-widgtes/puc-system-vav-dab-staged-rtu-graph-widget';
// tslint:disable-next-line
import { PucSystemVavDabStagedRtuVfdFanGraphWidget } from '../models/heatmap-system-widgtes/puc-system-vav-dab-staged-rtu-vfd-fan-graph-widget';
import { PucSystemWifiGraphWidget } from '../models/heatmap-system-widgtes/puc-system-wifi-graph-widget';
import { PucAirflowWaterTemp2pfcuGraphWidget } from '../models/heatmap-zone-widgets/puc-airflow-water-temp-2pfcu-graph-widget';
import { PucAirflowWaterTempCpuAndHpuGraphWidget } from '../models/heatmap-zone-widgets/puc-airflow-water-temp-cpu-and-hpu-graph-widget';
import { PucAirflowWaterTempDabAndVavGraphWidget } from '../models/heatmap-zone-widgets/puc-airflow-water-temp-dab-and-vav-graph-widget';
import { PucAirflowWaterTempSseGraphWidget } from '../models/heatmap-zone-widgets/puc-airflow-water-temp-sse-graph-widget';
import { PucCo2AndCo2TargetGraphWidget } from '../models/heatmap-zone-widgets/puc-co2-and-co2-target-graph-widget';
import { PucConditioningStatus2pfcuGraphWidget } from '../models/heatmap-zone-widgets/puc-conditioning-status-2pfcu-graph-widget';
import { PucConditioningStatus4pfcuGraphWidget } from '../models/heatmap-zone-widgets/puc-conditioning-status-4pfcu-graph-widget';
import { PucConditioningStatusCpuGraphWidget } from '../models/heatmap-zone-widgets/puc-conditioning-status-cpu-graph-widget';
import { PucConditioningStatusHpuGraphWidget } from '../models/heatmap-zone-widgets/puc-conditioning-status-hpu-graph-widget';
import { PucConditioningStatusSseGraphWidget } from '../models/heatmap-zone-widgets/puc-conditioning-status-sse-graph-widget';
import { PucCurrentVsDesiredTempGraphWidget } from '../models/heatmap-zone-widgets/puc-current-vs-desired-temp-graph-widget';
import { PucDamperPositionGraphWidget } from '../models/heatmap-zone-widgets/puc-damper-position-graph-widget';
import { PucEnergyDataConsumptionGraphWidget } from '../models/heatmap-zone-widgets/puc-energy-data-consumption-graph-widget';
import { PucHumidityAndHumidityTargetGraphWidget } from '../models/heatmap-zone-widgets/puc-humidity-and-humidity-target-graph-widget';
import { PucHyperSenseGraphWidget } from '../models/heatmap-zone-widgets/puc-hyper-sense-graph-widget';
import { PucIduSensorDataGraphWidget } from '../models/heatmap-zone-widgets/puc-idu-sensor-data-graph-widget';
import { PucPiLoopGraphWidget } from '../models/heatmap-zone-widgets/puc-pi-loop-graph-widget';
import { PucSensorDataGraphWidget } from '../models/heatmap-zone-widgets/puc-sensor-data-graph-widget';
import { PucSensorDataSsGraphWidget } from '../models/heatmap-zone-widgets/puc-sensor-data-ss-graph-widget';
import { PucSystemRuntimeGraphWidget } from '../models/heatmap-zone-widgets/puc-system-runtime-graph-widget';
import { PucVOCAndVOCTargetGraphWidget } from '../models/heatmap-zone-widgets/puc-vocand-voctarget-graph-widget';
import { PucVrvHyperStatGraphWidget } from '../models/heatmap-zone-widgets/puc-vrv-hyperstat-graph-widget';
import { PucVrvHyperStatModesGraphWidget } from '../models/heatmap-zone-widgets/puc-vrv-hyperstat-modes-graph-widget';
import { PucZoneModesGraphWidget2P4PFcu } from '../models/heatmap-zone-widgets/puc-zone-modes-graph-widget-2P-4Pfcu';
import { PucZoneModesGraphWidgetCpuHpu } from '../models/heatmap-zone-widgets/puc-zone-modes-graph-widget-cpu-hpu';
import { PucZoneOccupancyStatusGraphWidget } from '../models/heatmap-zone-widgets/puc-zone-occupancy-status-graph-widget';
import { PucZonePriorityGraphWidget } from '../models/heatmap-zone-widgets/puc-zone-priority-graph-widget';
import { PucZoneScheduleGraphWiget } from '../models/heatmap-zone-widgets/puc-zone-schedule-graph-widget';
import { HelperService } from './hs-helper.service';
import { RuntimeGraphService } from './runtime-graph.service';
import { SiteService } from './site.service';


@Injectable({
  providedIn: 'root'
})
export class DeviceHelperService {
  settingsObj: any = {
    th2sensor: undefined,
    analogOut1: undefined,
    analogOut2: undefined,
    currentTemp: undefined,
    dischargeAirTemp: undefined,
    coolingSupplyAir: undefined,
    coolingDamper: undefined,
    heatingDamper: undefined,
    heatingSupplyAir: undefined,
    desiredTempHeating: undefined,
    desiredTempCooling: undefined,
    equipScheduleStatus: undefined,
    scheduleType: undefined,
    equipStatusMessage: undefined,
    damperPos: undefined,
    reheatPos: undefined,
    enteringAirTemp: undefined,
    zonePriority: undefined,
    ConditionMode: undefined,
    fanMode: undefined,
    buildingSchedule: undefined,
    defaultZoneSchedule: undefined,
  };

  profileTypes: any = ['vav', 'dab', 'cpu', 'hpu', 'pipe2', 'pipe4', 'emr', 'pid', 'sse', 'ti', 'dualDuct', 'series', 'parallel', 'modbus','sense', 'vrv'];


  profileTags: any = {
    gen: {
      desiredTempHeating: ['temp', 'air', 'desired', 'heating'],
      desiredTempCooling: ['temp', 'air', 'desired', 'cooling'],
      currentTemp: ['current', 'temp'],
      scheduleType: ['zone', 'scheduleType'],
      equipScheduleStatus: ['zone', 'scheduleStatus'],
      buildingSchedule: ['building', 'schedule', 'days'],
      defaultZoneSchedule: ['zone', 'schedule', 'days'],
    },
    vav: {
      damperPos: ['zone', 'damper', 'base'],
      reheatPos: ['zone', 'reheat', 'base'],
      enteringAirTemp: ['zone', 'entering', 'air', 'temp', 'sensor'],
      dischargeAirTemp: ['zone', 'discharge', 'air', 'temp', 'sensor'],
      lastUpdated:['heartbeat'],
      equipStatusMessage: ['zone', 'message', 'status'],
    },
    dab: {
      damperPos: ['zone', 'damper', 'base'],
      dischargeAirTemp: ['zone', 'discharge', 'air', 'temp', 'sensor'],
      lastUpdated:['heartbeat'],
      equipStatusMessage: ['zone', 'message', 'status'],
    },
    cpu: {
      dischargeAirTemp: ['zone', 'discharge', 'air', 'temp'],
      conditioningMode: ['zone', 'temp', 'mode', 'operation'],
      fanMode: ['zone', 'fan', 'mode', 'operation'],
      lastUpdated:['heartbeat'],
      equipStatusMessage: ['zone', 'message', 'status'],

    },
    hpu: {
      dischargeAirTemp: ['zone', 'discharge', 'air', 'temp'],
      conditioningMode: ['zone', 'temp', 'mode', 'operation'],
      fanMode: ['zone', 'fan', 'mode', 'operation'],
      lastUpdated:['heartbeat'],
      equipStatusMessage: ['zone', 'message', 'status'],

    },
    pipe2: {
      dischargeAirTemp: ['zone', 'discharge', 'air', 'temp'],
      conditioningMode: ['zone', 'temp', 'mode', 'operation'],
      fanMode: ['zone', 'fan', 'mode', 'operation'],
      lastUpdated:['heartbeat'],
      equipStatusMessage: ['zone', 'message', 'status']

    },
    pipe4: {
      dischargeAirTemp: ['zone', 'discharge', 'air', 'temp'],
      conditioningMode: ['zone', 'temp', 'mode', 'operation'],
      fanMode: ['zone', 'fan', 'mode', 'operation'],
      lastUpdated:['heartbeat'],
      equipStatusMessage: ['zone', 'message', 'status']
    },
    emr: {
      currentRate: ['emr', 'rate'],
      energyReading: ['emr', 'sensor'],
      lastUpdated:['heartbeat'],
      equipStatusMessage: ['zone', 'message', 'status']
    },
    pid: {
      targetValue: ['zone', 'pid', 'target', 'config', 'value'],
      inputValue: ['process', 'logical', 'variable'],
      offsetValue: ['setpoint', 'sensor', 'offset'],
      equipStatusMessage: ['zone', 'message', 'status'],
      piSensorValue: ['analog1', 'config', 'input', 'sensor'],
      piDynamicSetpointValue: ['analog2', 'config', 'enabled'],
      piAnalog2SensorValue: ['analog2', 'config', 'sensor'],
      lastUpdated:['heartbeat']
    },
    sse: {
      dischargeAirTemp: ['zone', 'discharge', 'air', 'temp', 'sensor'],
      lastUpdated:['heartbeat'],
      equipStatusMessage: ['zone', 'message', 'status'],
    },
    ti: {
      lastUpdated:['heartbeat'],
      equipStatusMessage: ['zone', 'message', 'status'],
    },
    dualDuct: {
      heatingDamper: ['heating', 'damper', 'zone', 'point', 'dualDuct', 'logical'],
      coolingDamper: ['cooling', 'damper', 'zone', 'point', 'dualDuct', 'logical'],
      dischargeAirTemp: ['zone', 'discharge', 'air', 'temp'],
      heatingSupplyAir: ['heating', 'supply', 'zone', 'point', 'dualDuct', 'logical'],
      coolingSupplyAir: ['cooling', 'supply', 'zone', 'point', 'dualDuct', 'logical'],
      lastUpdated:['heartbeat'],
      equipStatusMessage: ['zone', 'message', 'status']
    },
    series: {
      damperPos: ['zone', 'damper', 'base'],
      reheatPos: ['zone', 'reheat', 'base'],
      enteringAirTemp: ['zone', 'entering', 'air', 'temp', 'sensor'],
      dischargeAirTemp: ['zone', 'discharge', 'air', 'temp', 'sensor'],
      lastUpdated:['heartbeat'],
      equipStatusMessage: ['zone', 'message', 'status'],
    },
    parallel: {
      damperPos: ['zone', 'damper', 'base'],
      reheatPos: ['zone', 'reheat', 'base'],
      enteringAirTemp: ['zone', 'entering', 'air', 'temp', 'sensor'],
      dischargeAirTemp: ['zone', 'discharge', 'air', 'temp', 'sensor'],
      lastUpdated:['heartbeat'],
      equipStatusMessage: ['zone', 'message', 'status'],
    },
    sense : {
      equipStatusMessage: ['zone', 'message', 'status'],
      analog1:['analog1','sense','logical'],
      analog2:['analog2','sense','logical'],
      th1:['th1','sense','logical'],
      th2:['th2','sense','logical'],
    },
    vrv: {
      humidity: ['vrv', 'zone', 'humidity', 'logical'],
      airflowDirection: ['vrv', 'airflowDirection', 'userIntent'],
      fanSpeed: ['vrv', 'fanSpeed', 'userIntent'],
      operationMode: ['vrv', 'operation', 'mode', 'userIntent'],
      lastUpdated:['heartbeat'],
      airflowDirectionAutoCapability: ['vrv', 'airflowDirection', 'auto'],
      masterControllerMode: ['vrv', 'masterController'],
      masterOperationMode: ['vrv', 'master', 'operation'],
      airflowDirectionSupportCapability: ['vrv', 'airflowDirection', 'support'],
      fanSpeedAutoCapability: ['vrv', 'fanSpeed', 'auto'],
      fanSpeedControlLevelCapability: ['vrv', 'fanSpeed', 'controlLevel']
    }
  };

  public systemProfiles: Map<string, string> = new Map<string, string>();
  public systemProfileSubject: Subject<any> = new Subject();
  public systemRuntimeSubject: Subject<any> = new Subject();
  public relayMapping: Map<string, string> = new Map<string, string>();

  public cancelPendingRequestsSubject: Subject<any> = new Subject();

  comfortIndexWidgetProfile: string;

  constructor(
    private helperService: HelperService,
    private siteService: SiteService,
    private runtimeGraphService: RuntimeGraphService
  ) {
    this.populateSystemProfilesData();
  }

  getZoneProfile(roomObj: any) {
    return roomObj.map(profile => {
      // tslint:disable-next-line
      const profileData = profile.entities.map(profile => {
        const profileType = this.profileTypes.find(elem => (profile.markers.indexOf(elem) > -1));
        const portNum = profile.name.substr(profile.name.lastIndexOf('-') + 1, profile.name.length - 1);
        let modBusEquip = '';
        if (profileType) {
          if (profileType === 'vav') {
            const profileName = profile.markers.find(e => e === 'series' || e === 'parallel');
            if (profileName) {
              return {
                profileType: profileName,
                profile,
                portNum,
                tags: this.profileTags[profileType]
              };
            }
          } else if (profileType === 'modbus') {
            let modbusProfile = profile.name.split('-');
             modBusEquip = modbusProfile[modbusProfile.length -2].toLowerCase();
          }

          return {
            profileType,
            modBusEquip,
            profile,
            portNum,
            tags: this.profileTags[profileType]
          };
        }
      }).filter(notUndefined => notUndefined !== undefined);
      return profileData;
    })[0];
  }

  // getSettingsByProfile(profileObj: any) {
  //   const tags = profileObj.map(profile => {
  //     this.getSettings(profile, this.profileTags[profile.profileType]);
  //   });

  //   return {
  //     genTags: this.profileTags['gen'],
  //     tags,
  //     profile: profileObj,
  //   };
  // }

  // getSettings(profileObj: any, tagsObj: any) {
  //   Object.keys(tagsObj).map(tagKey => this.helperService.getPointIdbyTags(profileObj.profile, tagsObj[tagKey]));
  // }

  getDeviceWidgets(
    profileType: string,
    siteref: string,
    ccuRef: string,
    airflowEnable: boolean,
    hpcType: string = null,
    hpuRelay5Config: string = null,
    cpuRelay6Config: string = null,
    moduleIdentifier: string = null,
    paramsData = null,
    isMasterControllerEnabled = false,
    isFac = false
  ) {
    let widgets: Array<any> = new Array<any>();

    switch (profileType) {
      case 'vav':
        widgets = [];

        // For runtime graph
        /* istanbul ignore else  */
        if (!this.runtimeGraphService.isRuntimeRendered) {
          this.runtimeGraphService.isRuntimeRendered = true;
          this.runtimeGraphService.moduleWithRuntime = moduleIdentifier;
          this.getCCUSystemProfile(siteref, ccuRef);
          // runtimesystemprofile
          widgets.push((new PucSystemRuntimeGraphWidget()).getGraphWidget());
        }

        // current vs desired
        widgets.push((new PucCurrentVsDesiredTempGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone occupancy status
        widgets.push((new PucZoneOccupancyStatusGraphWidget(moduleIdentifier)).getGraphWidget());
        // zone schedule
        widgets.push((new PucZoneScheduleGraphWiget(moduleIdentifier)).getGraphWidget());
        // humidity and humidity target
        widgets.push((new PucHumidityAndHumidityTargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // CO2 and CO2 Target
        widgets.push((new PucCo2AndCo2TargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // VOC and VOC Target
        widgets.push((new PucVOCAndVOCTargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone priority
        widgets.push((new PucZonePriorityGraphWidget(moduleIdentifier)).getGraphWidget());
        // Damper Position
        widgets.push((new PucDamperPositionGraphWidget(moduleIdentifier)).getGraphWidget(false, isFac));
        // Airflow/Water Flow Temperature
        widgets.push((new PucAirflowWaterTempDabAndVavGraphWidget(moduleIdentifier)).getGraphWidget());
        // Sensor Data
        widgets.push((new PucSensorDataGraphWidget(moduleIdentifier)).getGraphWidget(isFac));
        break;

      case 'series':
        widgets = [];

        // For runtime graph
        if (!this.runtimeGraphService.isRuntimeRendered) {
          this.runtimeGraphService.isRuntimeRendered = true;
          this.runtimeGraphService.moduleWithRuntime = moduleIdentifier;
          this.getCCUSystemProfile(siteref, ccuRef);
          // runtimesystemprofile
          widgets.push((new PucSystemRuntimeGraphWidget()).getGraphWidget());
        }

        // current vs desired
        widgets.push((new PucCurrentVsDesiredTempGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone occupancy status
        widgets.push((new PucZoneOccupancyStatusGraphWidget(moduleIdentifier)).getGraphWidget());
        // zone schedule
        widgets.push((new PucZoneScheduleGraphWiget(moduleIdentifier)).getGraphWidget());
        // humidity and humidity target
        widgets.push((new PucHumidityAndHumidityTargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // CO2 and CO2 Target
        widgets.push((new PucCo2AndCo2TargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // VOC and VOC Target
        widgets.push((new PucVOCAndVOCTargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone priority
        widgets.push((new PucZonePriorityGraphWidget(moduleIdentifier)).getGraphWidget());
        // Damper Position
        widgets.push((new PucDamperPositionGraphWidget(moduleIdentifier)).getGraphWidget(false, isFac));
        // Airflow/Water Flow Temperature
        widgets.push((new PucAirflowWaterTempDabAndVavGraphWidget(moduleIdentifier)).getGraphWidget());
        // Sensor Data
        widgets.push((new PucSensorDataGraphWidget(moduleIdentifier)).getGraphWidget(isFac));

        break;

      case 'parallel':
        widgets = [];

        // For runtime graph
        if (!this.runtimeGraphService.isRuntimeRendered) {
          this.runtimeGraphService.isRuntimeRendered = true;
          this.runtimeGraphService.moduleWithRuntime = moduleIdentifier;
          this.getCCUSystemProfile(siteref, ccuRef);
          // runtimesystemprofile
          widgets.push((new PucSystemRuntimeGraphWidget()).getGraphWidget());
        }

        // current vs desired
        widgets.push((new PucCurrentVsDesiredTempGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone occupancy status
        widgets.push((new PucZoneOccupancyStatusGraphWidget(moduleIdentifier)).getGraphWidget());
        // zone schedule
        widgets.push((new PucZoneScheduleGraphWiget(moduleIdentifier)).getGraphWidget());
        // humidity and humidity target
        widgets.push((new PucHumidityAndHumidityTargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // CO2 and CO2 Target
        widgets.push((new PucCo2AndCo2TargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // VOC and VOC Target
        widgets.push((new PucVOCAndVOCTargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone priority
        widgets.push((new PucZonePriorityGraphWidget(moduleIdentifier)).getGraphWidget());
        // Damper Position
        widgets.push((new PucDamperPositionGraphWidget(moduleIdentifier)).getGraphWidget(false, isFac));
        // Airflow/Water Flow Temperature
        widgets.push((new PucAirflowWaterTempDabAndVavGraphWidget(moduleIdentifier)).getGraphWidget());
        // Sensor Data
        widgets.push((new PucSensorDataGraphWidget(moduleIdentifier)).getGraphWidget(isFac));

        break;

      case 'dab':
        widgets = [];

        // For runtime graph
        /* istanbul ignore else  */
        if (!this.runtimeGraphService.isRuntimeRendered) {
          this.runtimeGraphService.isRuntimeRendered = true;
          this.runtimeGraphService.moduleWithRuntime = moduleIdentifier;
          this.getCCUSystemProfile(siteref, ccuRef);
          // runtimesystemprofile
          widgets.push((new PucSystemRuntimeGraphWidget()).getGraphWidget());
        }

        // current vs desired
        widgets.push((new PucCurrentVsDesiredTempGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone occupancy status
        widgets.push((new PucZoneOccupancyStatusGraphWidget(moduleIdentifier)).getGraphWidget());
        // zone schedule
        widgets.push((new PucZoneScheduleGraphWiget(moduleIdentifier)).getGraphWidget());
        // humidity and humidity target
        widgets.push((new PucHumidityAndHumidityTargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // CO2 and CO2 Target
        widgets.push((new PucCo2AndCo2TargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // VOC and VOC Target
        widgets.push((new PucVOCAndVOCTargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone priority
        widgets.push((new PucZonePriorityGraphWidget(moduleIdentifier)).getGraphWidget());
        // Damper Position
        widgets.push((new PucDamperPositionGraphWidget(moduleIdentifier)).getGraphWidget(false, isFac));
        // Airflow/Water Flow Temperature
        widgets.push((new PucAirflowWaterTempDabAndVavGraphWidget(moduleIdentifier)).getGraphWidget());
        // Sensor Data
        widgets.push((new PucSensorDataGraphWidget(moduleIdentifier)).getGraphWidget(isFac));
        break;

      case 'cpu':
        widgets = [];

        // current vs desired
        widgets.push((new PucCurrentVsDesiredTempGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone occupancy status
        widgets.push((new PucZoneOccupancyStatusGraphWidget(moduleIdentifier)).getGraphWidget());
        // zone schedule
        widgets.push((new PucZoneScheduleGraphWiget(moduleIdentifier)).getGraphWidget());
        // Conditioning Status
        widgets.push((new PucConditioningStatusCpuGraphWidget(moduleIdentifier)).getGraphWidget(cpuRelay6Config, isFac));
        // Airflow/Water Flow Temperature
        widgets.push((new PucAirflowWaterTempCpuAndHpuGraphWidget(moduleIdentifier)).getGraphWidget());
        // Modes
        widgets.push((new PucZoneModesGraphWidgetCpuHpu(moduleIdentifier)).getGraphWidget());
        // Sensor
        widgets.push((new PucSensorDataSsGraphWidget(moduleIdentifier)).getGraphWidget(isFac));
        break;

      case 'hpu':
        widgets = [];

        // current vs desired
        widgets.push((new PucCurrentVsDesiredTempGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone occupancy status
        widgets.push((new PucZoneOccupancyStatusGraphWidget(moduleIdentifier)).getGraphWidget());
        // zone schedule
        widgets.push((new PucZoneScheduleGraphWiget(moduleIdentifier)).getGraphWidget());
        // Conditioning Status
        widgets.push((new PucConditioningStatusHpuGraphWidget(moduleIdentifier)).getGraphWidget(hpcType, hpuRelay5Config, isFac));
        if (airflowEnable) {
          // Airflow/Water Flow Temperature
          widgets.push((new PucAirflowWaterTempCpuAndHpuGraphWidget(moduleIdentifier)).getGraphWidget());
        }
        // Modes
        widgets.push((new PucZoneModesGraphWidgetCpuHpu(moduleIdentifier)).getGraphWidget());
        // Sensor
        widgets.push((new PucSensorDataSsGraphWidget(moduleIdentifier)).getGraphWidget(isFac));
        break;

      case 'pipe2':
        widgets = [];
        // current vs desired
        widgets.push((new PucCurrentVsDesiredTempGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone occupancy status
        widgets.push((new PucZoneOccupancyStatusGraphWidget(moduleIdentifier)).getGraphWidget());
        // zone schedule
        widgets.push((new PucZoneScheduleGraphWiget(moduleIdentifier)).getGraphWidget());
        // conditioning status
        widgets.push((new PucConditioningStatus2pfcuGraphWidget(moduleIdentifier)).getGraphWidget(isFac));
        // Airflow/Water Flow Temperature
        widgets.push((new PucAirflowWaterTemp2pfcuGraphWidget(moduleIdentifier)).getGraphWidget());
        // Modes
        widgets.push((new PucZoneModesGraphWidget2P4PFcu(moduleIdentifier)).getGraphWidget());
        // Sensor
        widgets.push((new PucSensorDataSsGraphWidget(moduleIdentifier)).getGraphWidget(isFac));
        break;

      case 'pipe4':
        widgets = [];
        // current vs desired
        widgets.push((new PucCurrentVsDesiredTempGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone occupancy status
        widgets.push((new PucZoneOccupancyStatusGraphWidget(moduleIdentifier)).getGraphWidget());
        // zone schedule
        widgets.push((new PucZoneScheduleGraphWiget(moduleIdentifier)).getGraphWidget());
        // conditioning status
        widgets.push((new PucConditioningStatus4pfcuGraphWidget(moduleIdentifier)).getGraphWidget(isFac));
        // Airflow/Water Flow Temperature
        widgets.push((new PucAirflowWaterTempCpuAndHpuGraphWidget(moduleIdentifier)).getGraphWidget());
        // Modes
        widgets.push((new PucZoneModesGraphWidget2P4PFcu(moduleIdentifier)).getGraphWidget());
        // Sensor
        widgets.push((new PucSensorDataSsGraphWidget(moduleIdentifier)).getGraphWidget(isFac));
        break;

      case 'emr':
        widgets = [];
        // Energy Data Consumption
        widgets.push((new PucEnergyDataConsumptionGraphWidget(moduleIdentifier)).getGraphWidget());
        break;

      case 'sse':
        widgets = [];

        // current vs desired
        widgets.push((new PucCurrentVsDesiredTempGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone occupancy status
        widgets.push((new PucZoneOccupancyStatusGraphWidget(moduleIdentifier)).getGraphWidget());
        // zone schedule
        widgets.push((new PucZoneScheduleGraphWiget(moduleIdentifier)).getGraphWidget());
        // humidity and humidity target
        widgets.push((new PucHumidityAndHumidityTargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // conditioning status
        widgets.push((new PucConditioningStatusSseGraphWidget(moduleIdentifier)).getGraphWidget());
        // Airflow/Water Flow Temperature
        widgets.push((new PucAirflowWaterTempSseGraphWidget(moduleIdentifier)).getGraphWidget());
        // Sensor
        widgets.push((new PucSensorDataSsGraphWidget(moduleIdentifier)).getGraphWidget(isFac));
        break;

      case 'ti':
        widgets = [];

        // For runtime graph
        /* istanbul ignore else  */
        if (!this.runtimeGraphService.isRuntimeRendered) {
          this.runtimeGraphService.isRuntimeRendered = true;
          this.runtimeGraphService.moduleWithRuntime = moduleIdentifier;
          this.getCCUSystemProfile(siteref, ccuRef);
          // runtimesystemprofile
          widgets.push((new PucSystemRuntimeGraphWidget()).getGraphWidget());
        }

        // current vs desired
        widgets.push((new PucCurrentVsDesiredTempGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone occupancy status
        widgets.push((new PucZoneOccupancyStatusGraphWidget(moduleIdentifier)).getGraphWidget());
        // zone schedule
        widgets.push((new PucZoneScheduleGraphWiget(moduleIdentifier)).getGraphWidget());
        // humidity and humidity target
        widgets.push((new PucHumidityAndHumidityTargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        break;

      case 'pid':
        widgets = [];
        // PIloop
        widgets.push((new PucPiLoopGraphWidget(moduleIdentifier)).getGraphWidget(paramsData));
        break;
      
      case 'vrv':
        widgets = [];
        // current vs desired
        widgets.push((new PucCurrentVsDesiredTempGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
         // IDU Sensor Data
         widgets.push((new PucIduSensorDataGraphWidget(moduleIdentifier)).getGraphWidget());
         //Vrv Hyperstat
         widgets.push((new PucVrvHyperStatGraphWidget(moduleIdentifier)).getGraphWidget());
         //Vrv Hyperstat Modes
         widgets.push((new PucVrvHyperStatModesGraphWidget(moduleIdentifier)).getGraphWidget(isMasterControllerEnabled));
        break;

      case 'dualDuct':
        widgets = [];
        // For runtime graph
        /* istanbul ignore else  */
        if (!this.runtimeGraphService.isRuntimeRendered) {
          this.runtimeGraphService.isRuntimeRendered = true;
          this.runtimeGraphService.moduleWithRuntime = moduleIdentifier;
          this.getCCUSystemProfile(siteref, ccuRef);
          // runtimesystemprofile
          widgets.push((new PucSystemRuntimeGraphWidget()).getGraphWidget());
        }

        // current vs desired
        widgets.push((new PucCurrentVsDesiredTempGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // zone occupancy status
        widgets.push((new PucZoneOccupancyStatusGraphWidget(moduleIdentifier)).getGraphWidget());
        // zone schedule
        widgets.push((new PucZoneScheduleGraphWiget(moduleIdentifier)).getGraphWidget());
        // humidity and humidity target
        widgets.push((new PucHumidityAndHumidityTargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // CO2 and CO2 Target
        widgets.push((new PucCo2AndCo2TargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // VOC and VOC Target
        widgets.push((new PucVOCAndVOCTargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // Damper Position
        widgets.push((new PucDamperPositionGraphWidget(moduleIdentifier)).getGraphWidget(true, isFac));
        // Airflow/Water Flow Temperature
        widgets.push((new PucAirflowWaterTempDabAndVavGraphWidget(moduleIdentifier)).getGraphWidget(true));
        // Sensor Data
        widgets.push((new PucSensorDataGraphWidget(moduleIdentifier)).getGraphWidget(isFac));
        break;
      /* istanbul ignore next  */

      case 'modbus':
        widgets = [];
        break;

      case 'sense':
        widgets = [];
        widgets.push((new PucHyperSenseGraphWidget(moduleIdentifier)).getGraphWidget(paramsData));
        // humidity 
        widgets.push((new PucHumidityAndHumidityTargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // current 
        widgets.push((new PucCurrentVsDesiredTempGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // CO2 
        widgets.push((new PucCo2AndCo2TargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        // VOC 
        widgets.push((new PucVOCAndVOCTargetGraphWidget(moduleIdentifier)).getGraphWidget(profileType));
        //sensor
        widgets.push((new PucSensorDataGraphWidget(moduleIdentifier)).getGraphWidget(isFac));
        break; 

      default:
        throw new Error('Unsupported Profile Type: ' + profileType);
    }
    /* istanbul ignore else  */
    if (widgets.length) {
      return widgets;
    } else {
      return widgets;
      // throw new Error('Error: Unable to fetch widgets');
    }
  }

  getSystemWidgets(siteref: string, ccuObj: any, isFac = false,humidifierEnabled:any) {
    const widgets = [];

    this.getCCUSystemProfile(siteref, ccuObj.ccuAhu);

    // runtimesystemprofile
    widgets.push((new PucSystemRuntimeGraphWidget()).getGraphWidget());

    // humidity
    widgets.push((new PucSystemHumidityGraphWidget()).getGraphWidget(humidifierEnabled));
    
    if (ccuObj.ccuOAOCheck) {
      // oao
      widgets.push((new PucSystemOaoGraphWidget()).getGraphWidget(isFac));

      // airFlowTemp
      widgets.push((new PucSystemOaoAirflowTempGraphWidget()).getGraphWidget());
    }
    // avgTemp
    widgets.push((new PucSystemAvgTempGraphWidget()).getGraphWidget());

    // outsideTemp
    widgets.push((new PucSystemOutsideTempGraphWidget()).getGraphWidget());

    // cmData
    widgets.push((new PucSystemCmDataGraphWidget()).getGraphWidget(isFac));

    // modes
    // tslint:disable-next-line
    (ccuObj.ccuOAOCheck) ? widgets.push((new PucOaoModesGraphWidget()).getGraphWidget(isFac)) : widgets.push((new PucSystemModesGraphWidget()).getGraphWidget());

    // battery
    widgets.push((new PucSystemBatteryGraphWidget()).getGraphWidget(isFac));

    // wifi
    widgets.push((new PucSystemWifiGraphWidget()).getGraphWidget());

    // comfortIndex
    widgets.push((new PucSystemComfortIndexGraphWidget()).getGraphWidget());
    /* istanbul ignore else  */
    if (widgets.length) {
      return widgets;
    } else {
      throw new Error('Error: Unable to fetch system widgets');
    }
  }

  populateSystemProfilesData() {
    this.systemProfiles.set('SYSTEM_DEFAULT', 'Default System Profile');
    this.systemProfiles.set('SYSTEM_VAV_ANALOG_RTU', 'Runtime VAV Fully Modulating AHU');
    this.systemProfiles.set('SYSTEM_VAV_STAGED_RTU', 'Runtime VAV Staged RTU');
    this.systemProfiles.set('SYSTEM_VAV_HYBRID_RTU', 'Runtime VAV Advanced Hybrid AHU');
    this.systemProfiles.set('SYSTEM_VAV_STAGED_VFD_RTU', 'Runtime VAV Staged RTU with VFD Fan');
    this.systemProfiles.set('SYSTEM_VAV_IE_RTU', 'Runtime VAV Daikin IE');
    this.systemProfiles.set('SYSTEM_DAB_IE_RTU', 'Runtime DAB Daikin IE');
    this.systemProfiles.set('SYSTEM_VAV_BACNET_RTU', 'TBD: Title'); // TO be done in future
    this.systemProfiles.set('SYSTEM_DAB_ANALOG_RTU', 'Runtime DAB Fully Modulating AHU');
    this.systemProfiles.set('SYSTEM_DAB_STAGED_RTU', 'Runtime DAB Staged RTU');
    this.systemProfiles.set('SYSTEM_DAB_HYBRID_RTU', 'Runtime DAB Advanced Hybrid AHU');
    this.systemProfiles.set('SYSTEM_DAB_STAGED_VFD_RTU', 'Runtime DAB Staged RTU with VFD Fan');
  }

  getCCUSystemProfile(siteRef: string, ccuRef: string) {
    const queryParams = 'system and equip';
    let systemProfileName: string;
    /* istanbul ignore next  */
    const subs = this.siteService.getDetailsBySiteRef(queryParams, siteRef)
      .pipe(takeUntil(this.cancelPendingRequestsSubject))
      .subscribe(systemProfiles => {
        if (systemProfiles && systemProfiles.rows.length > 0) {
          [].concat(systemProfiles.rows).forEach(systemProfile => {
            const parsedCCURef = this.helperService.parseRef(systemProfile.id);
            if (parsedCCURef && parsedCCURef === ccuRef) {
              systemProfileName = systemProfile.profile;
              if (!systemProfileName.includes('DEFAULT')) {
                this.comfortIndexWidgetProfile = systemProfileName.includes('DAB') ? 'DAB' : 'VAV';
              }
            }
            if (systemProfileName) {
              this.systemProfileSubject.next(systemProfileName);
            }
          });
          subs.unsubscribe();
        }
      });
  }

  getSystemProfileRuntimeWidgetData(systemProfile: string, siteRef: string, ahuRef: string, isFac,gateWayRef) {
    let widgetData: any;

    switch (systemProfile) {
      case 'SYSTEM_DEFAULT':
        widgetData = null;
        widgetData = (new PucSystemDefaultProfileGraphWidget()).getGraphWidget(this.systemProfiles.get(systemProfile));
        /* istanbul ignore else  */
        if (widgetData) {
          this.systemRuntimeSubject.next(widgetData);
        }
        break;

      case 'SYSTEM_VAV_ANALOG_RTU': case 'SYSTEM_DAB_ANALOG_RTU':
        this.runtimeGraphService.getFullyModulatingProfileTags(ahuRef,gateWayRef);
        /* istanbul ignore next  */
        const fullMod_sub = this.runtimeGraphService.fullyModulatingProfileTagsSubject.subscribe(fullyMod => {
          widgetData = null;
          widgetData = (new PucSystemVavDabAnalogRtuGraphWidget()).getGraphWidget(this.systemProfiles.get(systemProfile), isFac);
          /* istanbul ignore else  */
          if (widgetData) {
            this.systemRuntimeSubject.next(widgetData);
            if (fullMod_sub && !fullMod_sub.closed) {
              fullMod_sub.unsubscribe();
            }
          }
        });
        break;

      case 'SYSTEM_VAV_STAGED_RTU': case 'SYSTEM_DAB_STAGED_RTU':
        this.runtimeGraphService.getCMPortsMapping(ahuRef);
        /* istanbul ignore next  */
        const subs_vav = this.runtimeGraphService.cmBoardPortsMappingsSubject.subscribe(portMappings => {
          widgetData = null;
          const params = [];

          portMappings.forEach((value, key) => {
            if (value.isEnabled) {
              params.push(value.param);
            }
          });

          widgetData = (new PucSystemVavDabStagedRtuGraphWidget()).getGraphWidget(this.systemProfiles.get(systemProfile), params, isFac);
          /* istanbul ignore else  */
          if (widgetData) {
            this.systemRuntimeSubject.next(widgetData);
            if (subs_vav && !subs_vav.closed) {
              subs_vav.unsubscribe();
            }
          }
        });
        break;

      case 'SYSTEM_VAV_STAGED_VFD_RTU': case 'SYSTEM_DAB_STAGED_VFD_RTU':
        this.runtimeGraphService.getCMPortsMapping(ahuRef);
        /* istanbul ignore next  */
        const subs_vav_vfd = this.runtimeGraphService.cmBoardPortsMappingsSubject.subscribe(portMappings => {
          widgetData = null;
          const params = [];
          console.log('GOt mappings for vfd fan as: ', portMappings);
          portMappings.forEach((value, key) => {
            if (value.isEnabled) {
              params.push(value.param);
            }
          });

          widgetData = (new PucSystemVavDabStagedRtuVfdFanGraphWidget())
            .getGraphWidget(this.systemProfiles.get(systemProfile), params, isFac);
          /* istanbul ignore else  */
          if (widgetData) {
            this.systemRuntimeSubject.next(widgetData);
            if (subs_vav_vfd && !subs_vav_vfd.closed) {
              subs_vav_vfd.unsubscribe();
            }
          }
        });
        break;

      case 'SYSTEM_VAV_HYBRID_RTU': case 'SYSTEM_DAB_HYBRID_RTU':
        this.runtimeGraphService.getCMPortsMapping(ahuRef);
        /* istanbul ignore next  */
        const subs_hyb = this.runtimeGraphService.cmBoardPortsMappingsSubject
          .pipe(takeUntil(this.cancelPendingRequestsSubject))
          .subscribe(portMappings => {
            widgetData = {};

            const params = [];
            portMappings.forEach((value, key) => {
              if (value.isEnabled) {
                params.push(value.param);
              }
            });

            widgetData = (new PucSystemVavDabHybridRtuGraphWidget()).getGraphWidget(this.systemProfiles.get(systemProfile), params, isFac);
            /* istanbul ignore else  */
            if (widgetData) {
              this.systemRuntimeSubject.next(widgetData);
              if (subs_hyb && !subs_hyb.closed) {
                subs_hyb.unsubscribe();
              }
            }
          });
        break;

      case 'SYSTEM_VAV_IE_RTU': case 'SYSTEM_DAB_IE_RTU':
        this.runtimeGraphService.getCMPortsMappingForDaikin(ahuRef);
        /* istanbul ignore next  */
        const sub = this.runtimeGraphService.cmBoardPortsMappingsForDaikinSubject
          .pipe(takeUntil(this.cancelPendingRequestsSubject))
          .subscribe(portMappings => {
            widgetData = {};
            widgetData = (new PucSystemVavDabDaikinIEGraphWidget()).getGraphWidget(this.systemProfiles.get(systemProfile));
            /* istanbul ignore else  */
            if (widgetData) {
              this.systemRuntimeSubject.next(widgetData);
              if (sub && !sub.closed) {
                sub.unsubscribe();
              }
            }
          });
        break;
      /* istanbul ignore next  */
      case 'SYSTEM_VAV_BACNET_RTU':
        widgetData = {};
        if (widgetData) {
          this.systemRuntimeSubject.next(widgetData);
        }
        // TBD
        break;
      /* istanbul ignore next  */
      case 'SYSTEM_DAB_BACNET_RTU':
        widgetData = {};
        if (widgetData) {
          this.systemRuntimeSubject.next(widgetData);
        }
        // TBD
        break;
      /* istanbul ignore next  */
      default:
        throw new Error('Unsupported System Profile : ' + systemProfile);
    }
  }

  checkBTUsPaired(res: any) {
    const btuData = res.rows.filter(tag =>
    (tag.btu != undefined))
    return btuData
  }

  checkEMRsPaired(res: any) {
    const emrData = res.rows.filter(tag =>
      (tag.emr != undefined))
      return emrData
    }
}
