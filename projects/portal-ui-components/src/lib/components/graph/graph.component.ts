/* tslint:disable */

import * as d3 from 'd3-selection';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Shape from 'd3-shape';
import * as moment from 'moment';

import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';

import { GraphService } from '../../services/graph.service';
import { HeatMapToolTipService } from '../../services/heatmap-tooltip.service';
import { PucGraphTypes } from '../../models/heatmap-graph-widgets/puc-graph-types.model';
import { Subject } from 'rxjs';

@Component({
    selector: 'puc-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss']
})
export class GraphComponent {
    @Input() graphData: any;
    @Input() linearData?: any;
    @Input() graphId: string;
    @Input() graphType: string;
    @Input() graphWidth: number;
    @Input() leftPos: number;
    @Input() moduleIdentifier: string;
    @Input() moduleRef: string;

    @Output() xAxisCords = new EventEmitter<any>();

    private unsubscribe: Subject<void> = new Subject();
    private margin = {
        top: 15,
        right: 20,
        bottom: 10,
        left: 20
    };
    private width: number;
    private height: number;
    private xAxisData: any;
    private g: any;
    private x: any;
    private y: any;
    private yRight: any;
    private z: any;
    private hoveredRegion: any;
    private svg: any;
    private toolTip: any;
    private line: any;
    private lineRightYAxis: any;
    private GRAPHDATA: any;
    private bandLimits: any;

    private coolingBand: any;
    private coolingBandColor: string;
    private heatingBand: any;
    private heatingBandColor: string;

    private runtimeAreaGraphs = [];

    private singularStack: any;
    private singularStackColor: string;

    xMouse: any;
    yMouse: any;
    xyMouse: any;
    leftExtreme: any;
    graphBoundary: any;
    cData: any = {};
    gData: any = {};
    stack: any;
    layersBarArea: any;
    stackedSeries: any;
    layersBar: any;

    constructor(
        private graphService: GraphService,
        private heatMapToolTipService: HeatMapToolTipService
    ) {
        const graphDataServiceSubjectSub = this.graphService.graphDataSubject.subscribe(graphData => {
            this.heatMapToolTipService.layerX = null;
            this.heatMapToolTipService.offsetX = null;
            this.heatMapToolTipService.isToolTipVisible = false;
            this.heatMapToolTipService.clearToolTip();
            this.getGraphServiceData(graphData);
        });
        this.graphService.graphDataServiceSubjectCollection.push(graphDataServiceSubjectSub)
        this.setBrowserOffset();
    }

    ngOnChanges(changes: SimpleChanges) {
        const graphParams: SimpleChange = changes.graphData;
        const graphId: SimpleChange = changes.graphId;
        const graphType: SimpleChange = changes.graphType;
        const graphWidth: SimpleChange = changes.graphWidth;
        const moduleIdentifier: SimpleChange = changes.moduleIdentifier;
        const moduleRef: SimpleChange = changes.moduleRef;
        if (!graphWidth.firstChange) {
            this.initChart();
            this.drawAxis();
            this.drawPath();
            this.defineHoverRegion();
            return;
        }
        this.graphData = (graphParams) ? graphParams.currentValue : [];
        this.graphId = (graphId) ? graphId.currentValue : [];
        this.graphType = (graphType) ? graphType.currentValue : [];
        this.graphWidth = (graphWidth) ? graphWidth.currentValue : null;
        this.moduleIdentifier = (moduleIdentifier) ? moduleIdentifier.currentValue : "";
        this.moduleRef = (moduleRef) ? moduleRef.currentValue : "";

        this.heatMapToolTipService.layerX = null;
        this.heatMapToolTipService.offsetX = null;
        this.heatMapToolTipService.isToolTipVisible = false;
        this.heatMapToolTipService.clearToolTip();
    }

    getGraphServiceData(data) {
        this.GRAPHDATA = data;
        // Set schedule type data for stack merged graph
        this.setScheduleTypeData();
        // Set occupancy type data for stack merged graph
        this.setOccupancyTypeData();
        // Set zone occupancy type data
        this.setZoneOccupancyTypeData();
        // Set FanModeCpuHpu
        this.setFanModeCpuHpuTypeData();
        // Set FanModeFCU
        this.setFanModeFCUTypeData();
        // Set OperationalMode
        this.setOperationalModeTypeData();
        // Set Zone OperationalMode
        this.setZoneOperationalModeTypeData();
        // Set Zone OperationalMode for HPU
        this.setZoneHPUOperationalModeTypeData();
        // Set System ConditionMode
        this.setConditionModeTypeData();
        // Set OccStatus Mode Data 
        this.setOccStatusModeTypeData();
        // Set Zone ConditionMode
        this.setZoneConditionModeTypeData();
        // Set Humidifier
        this.setHumidifierTypeData();
        // Set de-Humidifier
        this.setDeHumidifierTypeData();
        // Set Heatpump Changeover
        this.setHeatpumpChangeOverTypeData();
        // Set hpu relay5 config
        this.setHpuRelay5TypeData();
        // Set cpu relay6 config
        this.setCpuRelay6TypeData();
        // Set compressor stages
        this.setCompressorStages()
        // set watervalve
        this.setWaterValveTypeData();
        // set HeatingValve
        this.setHeatingValveTypeData();
        // set coolingValve
        this.setCoolingValveTypeData();
        // set coolStage1
        this.coolStage1TypeData();
        // set heatStage1
        this.heatStage1TypeData();
        // set ConditionioningMode for runtime
        this.setConditionioningModeTypeData();
        // set systemDeHumidifier data
        this.setsystemDeHumidifier();
        // set systemHumidifier data
        this.setsystemHumidifier();
        // set sseFan data
        this.setsseFan();
        // set batteryCharging data
        this.setBatteryChargingTypeData();
        // set powerconnected data
        this.setPowerConnectedTypeData();
        // set OccupancyDetection data
        this.setZoneOccupancyDetectionData();
        // set cmalive data
        this.setSystemCmAliveData();
        // set zone level occupancy sensor
        this.setOccupancySensorData();
        // set fan speed
        this.setFanSpeedData();
        // set airflow Direction
        this.setairflowDirectionData();
        // Filter Status
        this.setFilterStatusData();
        // set OAO system Mode graph
        this.setSystemOAOSystemData();
        // set OAO system CO2 sensing
        this.setSystemCo2Sensing();
        // coolHeatRight
        this.setCoolHeatRightData();
        // set OAO system Free Cooling
        this.setSystemFreeCooling();
        // Operation Mode
        this.setoperationModeData();
        // Master Operation Mode
        this.setmasterOperationModeData();

        this.setVavParallelFanData();
        this.setVavSeriesFanData();
        
        this.initGraphData(this.GRAPHDATA);
    }

    setVavSeriesFanData() {
        if (this.GRAPHDATA && this.GRAPHDATA['seriesFan' + this.moduleIdentifier]) {
            this.GRAPHDATA['seriesFanOff' + this.moduleIdentifier] = [];
            this.GRAPHDATA['seriesFanOn' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['seriesFan' + this.moduleIdentifier].length) {
                this.GRAPHDATA['seriesFan' + this.moduleIdentifier].map(data => {
                    // seriesFanOff
                    parseInt(data.val) == 0 ? this.GRAPHDATA['seriesFanOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['seriesFanOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // seriesFanOn
                    parseInt(data.val) == 1 ? this.GRAPHDATA['seriesFanOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['seriesFanOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('seriesFan' + this.moduleIdentifier, ['seriesFanOff' + this.moduleIdentifier, 'seriesFanOn' + this.moduleIdentifier]);
        }
    }

    setVavParallelFanData() {
        if (this.GRAPHDATA && this.GRAPHDATA['parallelFan' + this.moduleIdentifier]) {
            this.GRAPHDATA['parallelFanOff' + this.moduleIdentifier] = [];
            this.GRAPHDATA['parallelFanOn' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['parallelFan' + this.moduleIdentifier].length) {
                this.GRAPHDATA['parallelFan' + this.moduleIdentifier].map(data => {
                    // parallelFanOff
                    parseInt(data.val) == 0 ? this.GRAPHDATA['parallelFanOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['parallelFanOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // parallelFanOn
                    parseInt(data.val) == 1 ? this.GRAPHDATA['parallelFanOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['parallelFanOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('parallelFan' + this.moduleIdentifier, ['parallelFanOff' + this.moduleIdentifier, 'parallelFanOn' + this.moduleIdentifier]);
        }
    }

    setOccupancySensorData() {
        if (this.GRAPHDATA && this.GRAPHDATA['Occupancy' + this.moduleIdentifier]) {
            this.GRAPHDATA['OccupancyOff' + this.moduleIdentifier] = [];
            this.GRAPHDATA['OccupancyOn' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['Occupancy' + this.moduleIdentifier].length) {
                this.GRAPHDATA['Occupancy' + this.moduleIdentifier].map(data => {
                    // OccupancyOff
                    parseInt(data.val) == 0 ? this.GRAPHDATA['OccupancyOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['OccupancyOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // OccupancyOn
                    parseInt(data.val) == 1 ? this.GRAPHDATA['OccupancyOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['OccupancyOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('Occupancy' + this.moduleIdentifier, ['OccupancyOff' + this.moduleIdentifier, 'OccupancyOn' + this.moduleIdentifier]);
        }
    }

    setsseFan() {
        if (this.GRAPHDATA && this.GRAPHDATA['fan' + this.moduleIdentifier]) {
            this.GRAPHDATA['fanOff' + this.moduleIdentifier] = [];
            this.GRAPHDATA['fanOn' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['fan' + this.moduleIdentifier].length) {
                this.GRAPHDATA['fan' + this.moduleIdentifier].map(data => {
                    // fanOff
                    parseInt(data.val) == 0 ? this.GRAPHDATA['fanOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['fanOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // fanOn
                    parseInt(data.val) == 1 ? this.GRAPHDATA['fanOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['fanOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('fan' + this.moduleIdentifier, ['fanOff' + this.moduleIdentifier, 'fanOn' + this.moduleIdentifier]);
        }
    }
    setsystemHumidifier() {
        if (this.GRAPHDATA && this.GRAPHDATA['systemHumidifier']) {
            this.GRAPHDATA['systemHumidifierOff'] = [];
            this.GRAPHDATA['systemHumidifierOn'] = [];

            if (this.GRAPHDATA['systemHumidifier'].length) {
                this.GRAPHDATA['systemHumidifier'].map(data => {
                    // systemHumidifierOff
                    parseInt(data.val) == 0 ? this.GRAPHDATA['systemHumidifierOff'].push(data) : this.GRAPHDATA['systemHumidifierOff'].push({ ts: data.ts, val: null });
                    // systemHumidifierOn
                    parseInt(data.val) == 1 ? this.GRAPHDATA['systemHumidifierOn'].push(data) : this.GRAPHDATA['systemHumidifierOn'].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('systemHumidifier', ['systemHumidifierOff', 'systemHumidifierOn']);
        }
    }

    setsystemDeHumidifier() {
        if (this.GRAPHDATA && this.GRAPHDATA['systemDeHumidifier']) {
            this.GRAPHDATA['systemDeHumidifierOff'] = [];
            this.GRAPHDATA['systemDeHumidifierOn'] = [];

            if (this.GRAPHDATA['systemDeHumidifier'].length) {
                this.GRAPHDATA['systemDeHumidifier'].map(data => {
                    // systemDeHumidifierOff
                    parseInt(data.val) == 0 ? this.GRAPHDATA['systemDeHumidifierOff'].push(data) : this.GRAPHDATA['systemDeHumidifierOff'].push({ ts: data.ts, val: null });
                    // systemDeHumidifierOn
                    parseInt(data.val) == 1 ? this.GRAPHDATA['systemDeHumidifierOn'].push(data) : this.GRAPHDATA['systemDeHumidifierOn'].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('systemDeHumidifier', ['systemDeHumidifierOff', 'systemDeHumidifierOn']);
        }
    }

    coolStage1TypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['coolStage1' + this.moduleIdentifier]) {
            this.GRAPHDATA['coolStage1Disbaled' + this.moduleIdentifier] = [];
            this.GRAPHDATA['coolStage1Enabled' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['coolStage1' + this.moduleIdentifier].length) {
                this.GRAPHDATA['coolStage1' + this.moduleIdentifier].map(data => {
                    // coolStage1Disbaled
                    parseInt(data.val) == 0 ? this.GRAPHDATA['coolStage1Disbaled' + this.moduleIdentifier].push(data) : this.GRAPHDATA['coolStage1Disbaled' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // coolStage1Enabled
                    parseInt(data.val) == 1 ? this.GRAPHDATA['coolStage1Enabled' + this.moduleIdentifier].push(data) : this.GRAPHDATA['coolStage1Enabled' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('coolStage1' + this.moduleIdentifier, ['coolStage1Disbaled' + this.moduleIdentifier, 'coolStage1Enabled' + this.moduleIdentifier]);
        }
    }

    heatStage1TypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['heatStage1' + this.moduleIdentifier]) {
            this.GRAPHDATA['heatStage1Disbaled' + this.moduleIdentifier] = [];
            this.GRAPHDATA['heatStage1Enabled' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['heatStage1' + this.moduleIdentifier].length) {
                this.GRAPHDATA['heatStage1' + this.moduleIdentifier].map(data => {
                    // heatStage1Disbaled
                    parseInt(data.val) == 0 ? this.GRAPHDATA['heatStage1Disbaled' + this.moduleIdentifier].push(data) : this.GRAPHDATA['heatStage1Disbaled' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // heatStage1Enabled
                    parseInt(data.val) == 1 ? this.GRAPHDATA['heatStage1Enabled' + this.moduleIdentifier].push(data) : this.GRAPHDATA['heatStage1Enabled' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('heatStage1' + this.moduleIdentifier, ['heatStage1Disbaled' + this.moduleIdentifier, 'heatStage1Enabled' + this.moduleIdentifier]);
        }
    }

    setWaterValveTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['waterValve' + this.moduleIdentifier]) {
            this.GRAPHDATA['waterValveOn' + this.moduleIdentifier] = [];
            this.GRAPHDATA['waterValveOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['waterValve' + this.moduleIdentifier].length) {
                this.GRAPHDATA['waterValve' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['waterValveOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['waterValveOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['waterValveOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['waterValveOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('waterValve' + this.moduleIdentifier, ['waterValveOff' + this.moduleIdentifier, 'waterValveOn' + this.moduleIdentifier]);
        }
    }

    setHeatingValveTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['heatingValve' + this.moduleIdentifier]) {
            this.GRAPHDATA['heatingValveOn' + this.moduleIdentifier] = [];
            this.GRAPHDATA['heatingValveOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['heatingValve' + this.moduleIdentifier].length) {
                this.GRAPHDATA['heatingValve' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['heatingValveOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['heatingValveOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['heatingValveOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['heatingValveOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('heatingValve' + this.moduleIdentifier, ['heatingValveOff' + this.moduleIdentifier, 'heatingValveOn' + this.moduleIdentifier]);
        }
    }

    setCoolingValveTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['coolingValve' + this.moduleIdentifier]) {
            this.GRAPHDATA['coolingValveOn' + this.moduleIdentifier] = [];
            this.GRAPHDATA['coolingValveOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['coolingValve' + this.moduleIdentifier].length) {
                this.GRAPHDATA['coolingValve' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['coolingValveOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['coolingValveOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['coolingValveOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['coolingValveOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('coolingValve' + this.moduleIdentifier, ['coolingValveOff' + this.moduleIdentifier, 'coolingValveOn' + this.moduleIdentifier]);
        }
    }

    setCompressorStages() {
        if (this.GRAPHDATA && this.GRAPHDATA['hpuOperatingMode' + this.moduleIdentifier]) {
            if (this.heatMapToolTipService.dataParserCheckMap.has("hpuOperatingMode" + this.moduleIdentifier)) {
                // DO nothing
            }
            else {
                this.GRAPHDATA['compressorStage1Heat' + this.moduleIdentifier] = [];
                this.GRAPHDATA['compressorStage1Cool' + this.moduleIdentifier] = [];

                this.GRAPHDATA['compressorStage2Heat' + this.moduleIdentifier] = [];
                this.GRAPHDATA['compressorStage2Cool' + this.moduleIdentifier] = [];

                this.heatMapToolTipService.dataParserCheckMap.set('hpuOperatingMode' + this.moduleIdentifier, 0);
            }

            if (this.heatMapToolTipService.dataParserCheckMap.get("hpuOperatingMode" + this.moduleIdentifier) != this.GRAPHDATA['hpuOperatingMode' + this.moduleIdentifier].length) {
                this.heatMapToolTipService.dataParserCheckMap.set('hpuOperatingMode' + this.moduleIdentifier, this.GRAPHDATA['hpuOperatingMode' + this.moduleIdentifier].length);

                this.GRAPHDATA['compressorStage1Heat' + this.moduleIdentifier] = [];
                this.GRAPHDATA['compressorStage1Cool' + this.moduleIdentifier] = [];

                this.GRAPHDATA['compressorStage2Heat' + this.moduleIdentifier] = [];
                this.GRAPHDATA['compressorStage2Cool' + this.moduleIdentifier] = [];

                const coolingPeriods = [];
                const heatingPeriods = [];
                const offOrTempDead = [];

                this.GRAPHDATA['hpuOperatingMode' + this.moduleIdentifier].map(data => {
                    // Cooling
                    if (parseInt(data.val) == 1) {
                        coolingPeriods.push(60000 * Math.floor(new Date(data.ts).valueOf() / 60000));
                    }

                    // Heating
                    if (parseInt(data.val) == 2) {
                        heatingPeriods.push(60000 * Math.floor(new Date(data.ts).valueOf() / 60000));
                    }

                    // Off or tempdead
                    if ((parseInt(data.val) == 0) || (parseInt(data.val) == 3)) {
                        offOrTempDead.push(60000 * Math.floor(new Date(data.ts).valueOf() / 60000));
                    }
                });

                // Cooling periods
                if (coolingPeriods.length) {
                    // Compressor Stage 1
                    if (this.GRAPHDATA['compressorStage1' + this.moduleIdentifier] && this.GRAPHDATA['compressorStage1' + this.moduleIdentifier].length) {
                        coolingPeriods.forEach(coolTime => {
                            // Define cooling periods for Compressor Stage 1
                            this.GRAPHDATA['compressorStage1' + this.moduleIdentifier].map(compressorStage1 => {
                                if (60000 * Math.floor(new Date(compressorStage1.ts).valueOf() / 60000) == coolTime) {
                                    this.GRAPHDATA['compressorStage1Cool' + this.moduleIdentifier].push(compressorStage1);
                                }
                            })
                        })
                    }
                    // Compressor Stage 2
                    if (this.GRAPHDATA['compressorStage2' + this.moduleIdentifier] && this.GRAPHDATA['compressorStage2' + this.moduleIdentifier].length) {
                        coolingPeriods.forEach(coolTime => {
                            // Define cooling periods for Compressor Stage 1
                            this.GRAPHDATA['compressorStage2' + this.moduleIdentifier].map(compressorStage2 => {
                                if (60000 * Math.floor(new Date(compressorStage2.ts).valueOf() / 60000) == coolTime) {
                                    this.GRAPHDATA['compressorStage2Cool' + this.moduleIdentifier].push(compressorStage2);
                                }
                            })
                        })
                    }
                }

                // Heating Periods
                if (heatingPeriods.length) {
                    // Compressor Stage 1
                    if (this.GRAPHDATA['compressorStage1' + this.moduleIdentifier] && this.GRAPHDATA['compressorStage1' + this.moduleIdentifier].length) {
                        heatingPeriods.forEach(heatTime => {
                            // Define cooling periods for Compressor Stage 1
                            this.GRAPHDATA['compressorStage1' + this.moduleIdentifier].map(compressorStage1 => {
                                if (60000 * Math.floor(new Date(compressorStage1.ts).valueOf() / 60000) == heatTime) {
                                    this.GRAPHDATA['compressorStage1Heat' + this.moduleIdentifier].push(compressorStage1);
                                }
                            })
                        })
                    }
                    // Compressor Stage 2
                    if (this.GRAPHDATA['compressorStage2' + this.moduleIdentifier] && this.GRAPHDATA['compressorStage2' + this.moduleIdentifier].length) {
                        heatingPeriods.forEach(heatTime => {
                            // Define cooling periods for Compressor Stage 1
                            this.GRAPHDATA['compressorStage2' + this.moduleIdentifier].map(compressorStage2 => {
                                if (60000 * Math.floor(new Date(compressorStage2.ts).valueOf() / 60000) == heatTime) {
                                    this.GRAPHDATA['compressorStage2Heat' + this.moduleIdentifier].push(compressorStage2);
                                }
                            })
                        })
                    }
                }
            }
        }
    }

    setCpuRelay6TypeData() {
        // cpuHumidifier
        if (this.GRAPHDATA && this.GRAPHDATA['cpuHumidifier' + this.moduleIdentifier]) {
            this.GRAPHDATA['cpuHumidifierOn' + this.moduleIdentifier] = [];
            this.GRAPHDATA['cpuHumidifierOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['cpuHumidifier' + this.moduleIdentifier].length) {
                this.GRAPHDATA['cpuHumidifier' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['cpuHumidifierOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['cpuHumidifierOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['cpuHumidifierOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['cpuHumidifierOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('cpuHumidifier' + this.moduleIdentifier, ['cpuHumidifierOff' + this.moduleIdentifier, 'cpuHumidifierOn' + this.moduleIdentifier]);
        }

        // cpuDehumidifier
        if (this.GRAPHDATA && this.GRAPHDATA['cpuDehumidifier' + this.moduleIdentifier]) {
            this.GRAPHDATA['cpuDehumidifierOn' + this.moduleIdentifier] = [];
            this.GRAPHDATA['cpuDehumidifierOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['cpuDehumidifier' + this.moduleIdentifier].length) {
                this.GRAPHDATA['cpuDehumidifier' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['cpuDehumidifierOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['cpuDehumidifierOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['cpuDehumidifierOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['cpuDehumidifierOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important//Map enums
            this.setEnumProperties('cpuDehumidifier' + this.moduleIdentifier, ['cpuDehumidifierOff' + this.moduleIdentifier, 'cpuDehumidifierOn' + this.moduleIdentifier]);
        }
    }

    setHpuRelay5TypeData() {
        // hpuHumidifier
        if (this.GRAPHDATA && this.GRAPHDATA['hpuHumidifier' + this.moduleIdentifier]) {
            this.GRAPHDATA['hpuHumidifierOn' + this.moduleIdentifier] = [];
            this.GRAPHDATA['hpuHumidifierOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['hpuHumidifier' + this.moduleIdentifier].length) {
                this.GRAPHDATA['hpuHumidifier' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['hpuHumidifierOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['hpuHumidifierOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['hpuHumidifierOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['hpuHumidifierOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('hpuHumidifier' + this.moduleIdentifier, ['hpuHumidifierOff' + this.moduleIdentifier, 'hpuHumidifierOn' + this.moduleIdentifier]);
        }

        // hpuDehumidifier
        if (this.GRAPHDATA && this.GRAPHDATA['hpuDehumidifier' + this.moduleIdentifier]) {
            this.GRAPHDATA['hpuDehumidifierOn' + this.moduleIdentifier] = [];
            this.GRAPHDATA['hpuDehumidifierOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['hpuDehumidifier' + this.moduleIdentifier].length) {
                this.GRAPHDATA['hpuDehumidifier' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['hpuDehumidifierOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['hpuDehumidifierOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['hpuDehumidifierOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['hpuDehumidifierOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('hpuDehumidifier' + this.moduleIdentifier, ['hpuDehumidifierOff' + this.moduleIdentifier, 'hpuDehumidifierOn' + this.moduleIdentifier]);
        }
    }

    setHeatpumpChangeOverTypeData() {
        // HPC cooling
        if (this.GRAPHDATA && this.GRAPHDATA['heatpumpChangeoverCooling' + this.moduleIdentifier]) {
            this.GRAPHDATA['heatpumpChangeoverCoolingOn' + this.moduleIdentifier] = [];
            this.GRAPHDATA['heatpumpChangeoverCoolingOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['heatpumpChangeoverCooling' + this.moduleIdentifier].length) {
                this.GRAPHDATA['heatpumpChangeoverCooling' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['heatpumpChangeoverCoolingOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['heatpumpChangeoverCoolingOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['heatpumpChangeoverCoolingOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['heatpumpChangeoverCoolingOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('heatpumpChangeoverCooling' + this.moduleIdentifier, ['heatpumpChangeoverCoolingOff' + this.moduleIdentifier, 'heatpumpChangeoverCoolingOn' + this.moduleIdentifier]);
        }

        // HPC heating
        if (this.GRAPHDATA && this.GRAPHDATA['heatpumpChangeoverHeating' + this.moduleIdentifier]) {
            this.GRAPHDATA['heatpumpChangeoverHeatingOn' + this.moduleIdentifier] = [];
            this.GRAPHDATA['heatpumpChangeoverHeatingOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['heatpumpChangeoverHeating' + this.moduleIdentifier].length) {
                this.GRAPHDATA['heatpumpChangeoverHeating' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['heatpumpChangeoverHeatingOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['heatpumpChangeoverHeatingOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['heatpumpChangeoverHeatingOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['heatpumpChangeoverHeatingOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('heatpumpChangeoverHeating' + this.moduleIdentifier, ['heatpumpChangeoverHeatingOff' + this.moduleIdentifier, 'heatpumpChangeoverHeatingOn' + this.moduleIdentifier]);
        }
    }

    setHumidifierTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['humidifier']) {
            this.GRAPHDATA['humidifierOn'] = [];
            this.GRAPHDATA['humidifierOff'] = [];

            if (this.GRAPHDATA['humidifier'].length) {
                this.GRAPHDATA['humidifier'].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['humidifierOff'].push(data) : this.GRAPHDATA['humidifierOff'].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['humidifierOn'].push(data) : this.GRAPHDATA['humidifierOn'].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('humidifier', ['humidifierOff', 'humidifierOn']);
        }
    }

    setDeHumidifierTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['dehumidifier']) {
            this.GRAPHDATA['dehumidifierOn'] = [];
            this.GRAPHDATA['dehumidifierOff'] = [];

            if (this.GRAPHDATA['dehumidifier'].length) {
                this.GRAPHDATA['dehumidifier'].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['dehumidifierOff'].push(data) : this.GRAPHDATA['dehumidifierOff'].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['dehumidifierOn'].push(data) : this.GRAPHDATA['dehumidifierOn'].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('dehumidifier', ['dehumidifierOff', 'dehumidifierOn']);
        }
    }

    setFanModeCpuHpuTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['FanModeCpuHpu' + this.moduleIdentifier]) {
            this.GRAPHDATA['FanModeCpuHpuOff' + this.moduleIdentifier] = [];
            this.GRAPHDATA['FanModeCpuHpuAuto' + this.moduleIdentifier] = [];
            this.GRAPHDATA['FanModeCpuHpuLow' + this.moduleIdentifier] = [];
            this.GRAPHDATA['FanModeCpuHpuHigh' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['FanModeCpuHpu' + this.moduleIdentifier].length) {
                this.GRAPHDATA['FanModeCpuHpu' + this.moduleIdentifier].map(data => {
                    // off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['FanModeCpuHpuOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['FanModeCpuHpuOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // auto
                    parseInt(data.val) == 1 ? this.GRAPHDATA['FanModeCpuHpuAuto' + this.moduleIdentifier].push(data) : this.GRAPHDATA['FanModeCpuHpuAuto' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // fanLow (2,3,4)
                    (parseInt(data.val) == 2 || parseInt(data.val) == 3 || parseInt(data.val) == 4) ? this.GRAPHDATA['FanModeCpuHpuLow' + this.moduleIdentifier].push(data) : this.GRAPHDATA['FanModeCpuHpuLow' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // fanHigh (5,6,7)
                    (parseInt(data.val) == 5 || parseInt(data.val) == 6 || parseInt(data.val) == 7) ? this.GRAPHDATA['FanModeCpuHpuHigh' + this.moduleIdentifier].push(data) : this.GRAPHDATA['FanModeCpuHpuHigh' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('FanModeCpuHpu' + this.moduleIdentifier, ['FanModeCpuHpuOff' + this.moduleIdentifier, 'FanModeCpuHpuAuto' + this.moduleIdentifier, 'FanModeCpuHpuLow' + this.moduleIdentifier, 'FanModeCpuHpuHigh' + this.moduleIdentifier]);
        }
    }

    setFanModeFCUTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['FanModeFCU' + this.moduleIdentifier]) {
            this.GRAPHDATA['FanModeFCUOff' + this.moduleIdentifier] = [];
            this.GRAPHDATA['FanModeFCUAuto' + this.moduleIdentifier] = [];
            this.GRAPHDATA['FanModeFCULow' + this.moduleIdentifier] = [];
            this.GRAPHDATA['FanModeFCUMedium' + this.moduleIdentifier] = [];
            this.GRAPHDATA['FanModeFCUHigh' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['FanModeFCU' + this.moduleIdentifier].length) {
                this.GRAPHDATA['FanModeFCU' + this.moduleIdentifier].map(data => {
                    // off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['FanModeFCUOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['FanModeFCUOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // auto
                    parseInt(data.val) == 1 ? this.GRAPHDATA['FanModeFCUAuto' + this.moduleIdentifier].push(data) : this.GRAPHDATA['FanModeFCUAuto' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // fanLow (2,3,4)
                    (parseInt(data.val) == 2 || parseInt(data.val) == 3 || parseInt(data.val) == 4) ? this.GRAPHDATA['FanModeFCULow' + this.moduleIdentifier].push(data) : this.GRAPHDATA['FanModeFCULow' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // fanMedium (5,6,7)
                    (parseInt(data.val) == 5 || parseInt(data.val) == 6 || parseInt(data.val) == 7) ? this.GRAPHDATA['FanModeFCUMedium' + this.moduleIdentifier].push(data) : this.GRAPHDATA['FanModeFCUMedium' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // fanHigh (8,9,10)
                    (parseInt(data.val) == 8 || parseInt(data.val) == 9 || parseInt(data.val) == 10) ? this.GRAPHDATA['FanModeFCUHigh' + this.moduleIdentifier].push(data) : this.GRAPHDATA['FanModeFCUHigh' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('FanModeFCU' + this.moduleIdentifier, ['FanModeFCUOff' + this.moduleIdentifier, 'FanModeFCUAuto' + this.moduleIdentifier, 'FanModeFCULow' + this.moduleIdentifier, 'FanModeFCUMedium' + this.moduleIdentifier, 'FanModeFCUHigh' + this.moduleIdentifier]);
        }
    }

    setConditionModeTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['ConditionMode' + this.moduleIdentifier]) {
            this.GRAPHDATA['ConditionModeOff' + this.moduleIdentifier] = [];
            this.GRAPHDATA['ConditionModeauto' + this.moduleIdentifier] = [];
            this.GRAPHDATA['ConditionModeHeatOnly' + this.moduleIdentifier] = [];
            this.GRAPHDATA['ConditionModeCoolOnly' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['ConditionMode' + this.moduleIdentifier].length) {
                this.GRAPHDATA['ConditionMode' + this.moduleIdentifier].map(data => {
                    // off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['ConditionModeOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['ConditionModeOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // auto
                    parseInt(data.val) == 1 ? this.GRAPHDATA['ConditionModeauto' + this.moduleIdentifier].push(data) : this.GRAPHDATA['ConditionModeauto' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // cool only
                    parseInt(data.val) == 2 ? this.GRAPHDATA['ConditionModeCoolOnly' + this.moduleIdentifier].push(data) : this.GRAPHDATA['ConditionModeCoolOnly' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // heat only
                    parseInt(data.val) == 3 ? this.GRAPHDATA['ConditionModeHeatOnly' + this.moduleIdentifier].push(data) : this.GRAPHDATA['ConditionModeHeatOnly' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('ConditionMode' + this.moduleIdentifier, ['ConditionModeOff' + this.moduleIdentifier, 'ConditionModeauto' + this.moduleIdentifier, 'ConditionModeCoolOnly' + this.moduleIdentifier, 'ConditionModeHeatOnly' + this.moduleIdentifier]);
        }
    }

    setOccStatusModeTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['OccupancyStatus' + this.moduleIdentifier]) {
            this.GRAPHDATA['Occupied' + this.moduleIdentifier] = [];
            this.GRAPHDATA['Unoccupied' + this.moduleIdentifier] = [];
            this.GRAPHDATA['Tenant Override' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['OccupancyStatus' + this.moduleIdentifier].length) {
                this.GRAPHDATA['OccupancyStatus' + this.moduleIdentifier].map(data => {
                    parseInt(data.val) == 0 ? this.GRAPHDATA['Occupied' + this.moduleIdentifier].push(data) : this.GRAPHDATA['Occupied' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                  
                    parseInt(data.val) == 1 ? this.GRAPHDATA['Unoccupied' + this.moduleIdentifier].push(data) : this.GRAPHDATA['Unoccupied' + this.moduleIdentifier].push({ ts: data.ts, val: null });
          
                    parseInt(data.val) == 2 ? this.GRAPHDATA['Tenant Override' + this.moduleIdentifier].push(data) : this.GRAPHDATA['Tenant Override' + this.moduleIdentifier].push({ ts: data.ts, val: null });
            
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('OccupancyStatus' + this.moduleIdentifier, ['Occupied' + this.moduleIdentifier, 'Unoccupied' + this.moduleIdentifier, 'Tenant Override' + this.moduleIdentifier]);
        }
    }

    setZoneConditionModeTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['ZoneConditionMode' + this.moduleIdentifier]) {
            this.GRAPHDATA['ZoneConditionModeOff' + this.moduleIdentifier] = [];
            this.GRAPHDATA['ZoneConditionModeauto' + this.moduleIdentifier] = [];
            this.GRAPHDATA['ZoneConditionModeHeatOnly' + this.moduleIdentifier] = [];
            this.GRAPHDATA['ZoneConditionModeCoolOnly' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['ZoneConditionMode' + this.moduleIdentifier].length) {
                this.GRAPHDATA['ZoneConditionMode' + this.moduleIdentifier].map(data => {
                    // off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['ZoneConditionModeOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['ZoneConditionModeOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // auto
                    parseInt(data.val) == 1 ? this.GRAPHDATA['ZoneConditionModeauto' + this.moduleIdentifier].push(data) : this.GRAPHDATA['ZoneConditionModeauto' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // cool only
                    parseInt(data.val) == 2 ? this.GRAPHDATA['ZoneConditionModeHeatOnly' + this.moduleIdentifier].push(data) : this.GRAPHDATA['ZoneConditionModeHeatOnly' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // heat only
                    parseInt(data.val) == 3 ? this.GRAPHDATA['ZoneConditionModeCoolOnly' + this.moduleIdentifier].push(data) : this.GRAPHDATA['ZoneConditionModeCoolOnly' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('ZoneConditionMode' + this.moduleIdentifier, ['ZoneConditionModeOff' + this.moduleIdentifier, 'ZoneConditionModeauto' + this.moduleIdentifier, 'ZoneConditionModeHeatOnly' + this.moduleIdentifier, 'ZoneConditionModeCoolOnly' + this.moduleIdentifier]);
        }
    }

    setOperationalModeTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['OperationalMode']) {
            this.GRAPHDATA['OperationalModeCooling'] = [];
            this.GRAPHDATA['OperationalModeHeating'] = [];
            this.GRAPHDATA['OperationalModeOff'] = [];

            if (this.GRAPHDATA['OperationalMode'].length) {
                this.GRAPHDATA['OperationalMode'].map(data => {
                    // heating
                    parseInt(data.val) == 2 ? this.GRAPHDATA['OperationalModeHeating'].push(data) : this.GRAPHDATA['OperationalModeHeating'].push({ ts: data.ts, val: null });
                    // cooling
                    parseInt(data.val) == 1 ? this.GRAPHDATA['OperationalModeCooling'].push(data) : this.GRAPHDATA['OperationalModeCooling'].push({ ts: data.ts, val: null });
                    // off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['OperationalModeOff'].push(data) : this.GRAPHDATA['OperationalModeOff'].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('OperationalMode' + this.moduleIdentifier, ['OperationalModeOff' + this.moduleIdentifier, 'OperationalModeCooling' + this.moduleIdentifier, 'OperationalModeHeating' + this.moduleIdentifier]);
        }
    }

    setZoneOperationalModeTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['ZoneOperationalMode' + this.moduleIdentifier]) {
            this.GRAPHDATA['ZoneOperationalModeCooling' + this.moduleIdentifier] = [];
            this.GRAPHDATA['ZoneOperationalModeHeating' + this.moduleIdentifier] = [];
            this.GRAPHDATA['ZoneOperationalModeOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['ZoneOperationalMode' + this.moduleIdentifier].length) {
                this.GRAPHDATA['ZoneOperationalMode' + this.moduleIdentifier].map(data => {
                    // heating
                    parseInt(data.val) == 2 ? this.GRAPHDATA['ZoneOperationalModeHeating' + this.moduleIdentifier].push(data) : this.GRAPHDATA['ZoneOperationalModeHeating' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // cooling
                    parseInt(data.val) == 1 ? this.GRAPHDATA['ZoneOperationalModeCooling' + this.moduleIdentifier].push(data) : this.GRAPHDATA['ZoneOperationalModeCooling' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['ZoneOperationalModeOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['ZoneOperationalModeOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('ZoneOperationalMode' + this.moduleIdentifier, ['ZoneOperationalModeOff' + this.moduleIdentifier, 'ZoneOperationalModeCooling' + this.moduleIdentifier, 'ZoneOperationalModeHeating' + this.moduleIdentifier]);
        }
    }

    setZoneHPUOperationalModeTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['hpuOperatingMode' + this.moduleIdentifier]) {
            this.GRAPHDATA['ZoneOperationalModeCooling' + this.moduleIdentifier] = [];
            this.GRAPHDATA['ZoneOperationalModeHeating' + this.moduleIdentifier] = [];
            this.GRAPHDATA['ZoneOperationalModeOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['hpuOperatingMode' + this.moduleIdentifier].length) {
                this.GRAPHDATA['hpuOperatingMode' + this.moduleIdentifier].map(data => {
                    // heating
                    parseInt(data.val) == 2 ? this.GRAPHDATA['ZoneOperationalModeHeating' + this.moduleIdentifier].push(data) : this.GRAPHDATA['ZoneOperationalModeHeating' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // cooling
                    parseInt(data.val) == 1 ? this.GRAPHDATA['ZoneOperationalModeCooling' + this.moduleIdentifier].push(data) : this.GRAPHDATA['ZoneOperationalModeCooling' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['ZoneOperationalModeOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['ZoneOperationalModeOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('hpuOperatingMode' + this.moduleIdentifier, ['ZoneOperationalModeOff' + this.moduleIdentifier, 'ZoneOperationalModeCooling' + this.moduleIdentifier, 'ZoneOperationalModeHeating' + this.moduleIdentifier]);
        }
    }

    setConditionioningModeTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['conditioningMode' + this.moduleIdentifier]) {
            this.GRAPHDATA['conditioningModeHeating' + this.moduleIdentifier] = [];
            this.GRAPHDATA['conditioningModeCooling' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['conditioningMode' + this.moduleIdentifier].length) {
                this.GRAPHDATA['conditioningMode' + this.moduleIdentifier].map(data => {
                    // heating
                    parseInt(data.val) == 1 ? this.GRAPHDATA['conditioningModeHeating' + this.moduleIdentifier].push(data) : '';
                    // cooling
                    parseInt(data.val) == 2 ? this.GRAPHDATA['conditioningModeCooling' + this.moduleIdentifier].push(data) : '';
                });
            }

            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('conditioningMode' + this.moduleIdentifier, ['', 'conditioningModeHeating' + this.moduleIdentifier, 'conditioningModeCooling' + this.moduleIdentifier]);
        }
    }

    setScheduleTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['scheduleType' + this.moduleIdentifier]) {
            this.GRAPHDATA['Building' + this.moduleIdentifier] = [];
            this.GRAPHDATA['Zone' + this.moduleIdentifier] = [];
            this.GRAPHDATA['Named' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['scheduleType' + this.moduleIdentifier].length) {
                this.GRAPHDATA['scheduleType' + this.moduleIdentifier].map(data => {
                    // Building
                    parseInt(data.val) == 0 ? this.GRAPHDATA['Building' + this.moduleIdentifier].push(data) : this.GRAPHDATA['Building' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Zone
                    parseInt(data.val) == 1 ? this.GRAPHDATA['Zone' + this.moduleIdentifier].push(data) : this.GRAPHDATA['Zone' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Named
                    parseInt(data.val) == 2 ? this.GRAPHDATA['Named' + this.moduleIdentifier].push(data) : this.GRAPHDATA['Named' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('scheduleType' + this.moduleIdentifier, ['Building' + this.moduleIdentifier, 'Zone' + this.moduleIdentifier, 'Named' + this.moduleIdentifier]);
        }
    }

    setZoneOccupancyTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['zoneOccupancy' + this.moduleIdentifier]) {
            this.GRAPHDATA['zoneSetpoint' + this.moduleIdentifier] = [];
            this.GRAPHDATA['zoneSetback' + this.moduleIdentifier] = [];
            this.GRAPHDATA['zoneVacation' + this.moduleIdentifier] = [];
            this.GRAPHDATA['zonePreconditioning' + this.moduleIdentifier] = [];
            this.GRAPHDATA['zoneTemporaryHold' + this.moduleIdentifier] = [];
            this.GRAPHDATA['zoneAway' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['zoneOccupancy' + this.moduleIdentifier].length) {
                this.GRAPHDATA['zoneOccupancy' + this.moduleIdentifier].map(data => {
                    // zoneSetback
                    parseInt(data.val) == 0 ? this.GRAPHDATA['zoneSetback' + this.moduleIdentifier].push(data) : this.GRAPHDATA['zoneSetback' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // zoneSetpoint
                    parseInt(data.val) == 1 ? this.GRAPHDATA['zoneSetpoint' + this.moduleIdentifier].push(data) : this.GRAPHDATA['zoneSetpoint' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // zonePreconditioning
                    parseInt(data.val) == 2 ? this.GRAPHDATA['zonePreconditioning' + this.moduleIdentifier].push(data) : this.GRAPHDATA['zonePreconditioning' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // zoneTemporaryHold
                    parseInt(data.val) == 3 ? this.GRAPHDATA['zoneTemporaryHold' + this.moduleIdentifier].push(data) : this.GRAPHDATA['zoneTemporaryHold' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // zoneVacation
                    parseInt(data.val) == 4 ? this.GRAPHDATA['zoneVacation' + this.moduleIdentifier].push(data) : this.GRAPHDATA['zoneVacation' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // zoneAway
                    parseInt(data.val) == 5 ? this.GRAPHDATA['zoneAway' + this.moduleIdentifier].push(data) : this.GRAPHDATA['zoneAway' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('zoneOccupancy' + this.moduleIdentifier, ['zoneSetback' + this.moduleIdentifier, 'zoneSetpoint' + this.moduleIdentifier, 'zonePreconditioning' + this.moduleIdentifier, 'zoneTemporaryHold' + this.moduleIdentifier, 'zoneVacation' + this.moduleIdentifier, 'zoneAway' + this.moduleIdentifier]);
        }
    }

    setZoneOccupancyDetectionData() {
        if (this.GRAPHDATA && this.GRAPHDATA['occupancyDetection' + this.moduleIdentifier]) {
            this.GRAPHDATA['occupancyDetectionOn' + this.moduleIdentifier] = [];
            this.GRAPHDATA['occupancyDetectionOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['occupancyDetection' + this.moduleIdentifier].length) {
                this.GRAPHDATA['occupancyDetection' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['occupancyDetectionOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['occupancyDetectionOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['occupancyDetectionOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['occupancyDetectionOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('occupancyDetection' + this.moduleIdentifier, ['occupancyDetectionOff' + this.moduleIdentifier, 'occupancyDetectionOn' + this.moduleIdentifier]);
        }
    }

    setFanSpeedData() {
        if (this.GRAPHDATA && this.GRAPHDATA['fanSpeed' + this.moduleIdentifier]) {
            this.GRAPHDATA['fanSpeedLow' + this.moduleIdentifier] = [];
            this.GRAPHDATA['fanSpeedMedium' + this.moduleIdentifier] = [];
            this.GRAPHDATA['fanSpeedHigh' + this.moduleIdentifier] = [];
            this.GRAPHDATA['fanSpeedAuto' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['fanSpeed' + this.moduleIdentifier].length) {
                this.GRAPHDATA['fanSpeed' + this.moduleIdentifier].map(data => {
                    // Low
                    parseInt(data.val) == 0 ? this.GRAPHDATA['fanSpeedLow' + this.moduleIdentifier].push(data) : this.GRAPHDATA['fanSpeedLow' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Medium
                    parseInt(data.val) == 1 ? this.GRAPHDATA['fanSpeedMedium' + this.moduleIdentifier].push(data) : this.GRAPHDATA['fanSpeedMedium' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // High
                    parseInt(data.val) == 2 ? this.GRAPHDATA['fanSpeedHigh' + this.moduleIdentifier].push(data) : this.GRAPHDATA['fanSpeedHigh' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Auto
                    parseInt(data.val) == 3 ? this.GRAPHDATA['fanSpeedAuto' + this.moduleIdentifier].push(data) : this.GRAPHDATA['fanSpeedAuto' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('fanSpeed' + this.moduleIdentifier, ['fanSpeedLow' + this.moduleIdentifier, 'fanSpeedMedium' + this.moduleIdentifier, 'fanSpeedHigh' + this.moduleIdentifier, 'fanSpeedAuto' + this.moduleIdentifier]);
        }
    }

    setairflowDirectionData() {
        if (this.GRAPHDATA && this.GRAPHDATA['airflowDirection' + this.moduleIdentifier]) {
            this.GRAPHDATA['position0' + this.moduleIdentifier] = [];
            this.GRAPHDATA['position1' + this.moduleIdentifier] = [];
            this.GRAPHDATA['position2' + this.moduleIdentifier] = [];
            this.GRAPHDATA['position3' + this.moduleIdentifier] = [];
            this.GRAPHDATA['position4' + this.moduleIdentifier] = [];
            this.GRAPHDATA['swing' + this.moduleIdentifier] = [];
            this.GRAPHDATA['auto' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['airflowDirection' + this.moduleIdentifier].length) {
                this.GRAPHDATA['airflowDirection' + this.moduleIdentifier].map(data => {
                    // Position0
                    parseInt(data.val) == 0 ? this.GRAPHDATA['position0' + this.moduleIdentifier].push(data) : this.GRAPHDATA['position0' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Position1
                    parseInt(data.val) == 1 ? this.GRAPHDATA['position1' + this.moduleIdentifier].push(data) : this.GRAPHDATA['position1' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Position2
                    parseInt(data.val) == 2 ? this.GRAPHDATA['position2' + this.moduleIdentifier].push(data) : this.GRAPHDATA['position2' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Position3
                    parseInt(data.val) == 3 ? this.GRAPHDATA['position3' + this.moduleIdentifier].push(data) : this.GRAPHDATA['position3' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Positon4
                    parseInt(data.val) == 4 ? this.GRAPHDATA['position4' + this.moduleIdentifier].push(data) : this.GRAPHDATA['position4' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Swing
                    parseInt(data.val) == 5 ? this.GRAPHDATA['swing' + this.moduleIdentifier].push(data) : this.GRAPHDATA['swing' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Auto
                    parseInt(data.val) == 6 ? this.GRAPHDATA['auto' + this.moduleIdentifier].push(data) : this.GRAPHDATA['auto' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('airflowDirection' + this.moduleIdentifier, ['position0' + this.moduleIdentifier, 'position1' + this.moduleIdentifier, 'position2' + this.moduleIdentifier, 'position3' + this.moduleIdentifier, 'position4' + this.moduleIdentifier, 'swing' + this.moduleIdentifier, 'auto' + this.moduleIdentifier]);
        }
    }

    setFilterStatusData() {
        if (this.GRAPHDATA && this.GRAPHDATA['filterStatus' + this.moduleIdentifier]) {
            this.GRAPHDATA['filterStatusOff' + this.moduleIdentifier] = [];
            this.GRAPHDATA['filterStatusOn' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['filterStatus' + this.moduleIdentifier].length) {
                this.GRAPHDATA['filterStatus' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['filterStatusOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['filterStatusOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['filterStatusOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['filterStatusOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('filterStatus' + this.moduleIdentifier, ['filterStatusOff' + this.moduleIdentifier, 'filterStatusOn' + this.moduleIdentifier]);
        }
    }

    setCoolHeatRightData() {
        if (this.GRAPHDATA && this.GRAPHDATA['coolHeatRight' + this.moduleIdentifier]) {
            this.GRAPHDATA['coolHeatRightA' + this.moduleIdentifier] = [];
            this.GRAPHDATA['coolHeatRightC' + this.moduleIdentifier] = [];
            this.GRAPHDATA['coolHeatRightD' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['coolHeatRight' + this.moduleIdentifier].length) {
                this.GRAPHDATA['coolHeatRight' + this.moduleIdentifier].map(data => {
                    // A
                    parseInt(data.val) == 0 ? this.GRAPHDATA['coolHeatRightA' + this.moduleIdentifier].push(data) : this.GRAPHDATA['coolHeatRightA' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // C
                    parseInt(data.val) == 1 ? this.GRAPHDATA['coolHeatRightC' + this.moduleIdentifier].push(data) : this.GRAPHDATA['coolHeatRightC' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // D
                     parseInt(data.val) == 2 ? this.GRAPHDATA['coolHeatRightD' + this.moduleIdentifier].push(data) : this.GRAPHDATA['coolHeatRightD' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('coolHeatRight' + this.moduleIdentifier, ['coolHeatRightA' + this.moduleIdentifier, 'coolHeatRightC' + this.moduleIdentifier, 'coolHeatRightD' + this.moduleIdentifier]);
        }
    }

    setoperationModeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['operationMode' + this.moduleIdentifier]) {
            this.GRAPHDATA['operationModeOff' + this.moduleIdentifier] = [];
            this.GRAPHDATA['operationModeFan' + this.moduleIdentifier] = [];
            this.GRAPHDATA['operationModeHeat' + this.moduleIdentifier] = [];
            this.GRAPHDATA['operationModeCool' + this.moduleIdentifier] = [];
            this.GRAPHDATA['operationModeAuto' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['operationMode' + this.moduleIdentifier].length) {
                this.GRAPHDATA['operationMode' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['operationModeOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['operationModeOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Fan
                    parseInt(data.val) == 1 ? this.GRAPHDATA['operationModeFan' + this.moduleIdentifier].push(data) : this.GRAPHDATA['operationModeFan' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Heat
                    parseInt(data.val) == 2 ? this.GRAPHDATA['operationModeHeat' + this.moduleIdentifier].push(data) : this.GRAPHDATA['operationModeHeat' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Cool
                    parseInt(data.val) == 3 ? this.GRAPHDATA['operationModeCool' + this.moduleIdentifier].push(data) : this.GRAPHDATA['operationModeCool' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Auto
                    parseInt(data.val) == 4 ? this.GRAPHDATA['operationModeAuto' + this.moduleIdentifier].push(data) : this.GRAPHDATA['operationModeAuto' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('operationMode' + this.moduleIdentifier, ['operationModeOff' + this.moduleIdentifier, 'operationModeFan' + this.moduleIdentifier, 'operationModeHeat' + this.moduleIdentifier, 'operationModeCool' + this.moduleIdentifier, 'operationModeAuto' + this.moduleIdentifier]);
        }
    }

    setmasterOperationModeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['masterOperationMode' + this.moduleIdentifier]) {
            this.GRAPHDATA['masterOperationModeOff' + this.moduleIdentifier] = [];
            this.GRAPHDATA['masterOperationModeFan' + this.moduleIdentifier] = [];
            this.GRAPHDATA['masterOperationModeHeat' + this.moduleIdentifier] = [];
            this.GRAPHDATA['masterOperationModeCool' + this.moduleIdentifier] = [];
            this.GRAPHDATA['masterOperationModeAuto' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['masterOperationMode' + this.moduleIdentifier].length) {
                this.GRAPHDATA['masterOperationMode' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['masterOperationModeOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['masterOperationModeOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Fan
                    parseInt(data.val) == 1 ? this.GRAPHDATA['masterOperationModeFan' + this.moduleIdentifier].push(data) : this.GRAPHDATA['masterOperationModeFan' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Heat
                    parseInt(data.val) == 2 ? this.GRAPHDATA['masterOperationModeHeat' + this.moduleIdentifier].push(data) : this.GRAPHDATA['masterOperationModeHeat' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Cool
                    parseInt(data.val) == 3 ? this.GRAPHDATA['masterOperationModeCool' + this.moduleIdentifier].push(data) : this.GRAPHDATA['masterOperationModeCool' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Auto
                    parseInt(data.val) == 4 ? this.GRAPHDATA['masterOperationModeAuto' + this.moduleIdentifier].push(data) : this.GRAPHDATA['masterOperationModeAuto' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('masterOperationMode' + this.moduleIdentifier, ['masterOperationModeOff' + this.moduleIdentifier, 'masterOperationModeFan' + this.moduleIdentifier, 'masterOperationModeHeat' + this.moduleIdentifier, 'masterOperationModeCool' + this.moduleIdentifier, 'operationModeAuto' + this.moduleIdentifier]);
        }
    }


    setSystemCmAliveData() {
        if (this.GRAPHDATA && this.GRAPHDATA['CMAlive' + this.moduleIdentifier]) {
            this.GRAPHDATA['CMAliveOn' + this.moduleIdentifier] = [];
            this.GRAPHDATA['CMAliveOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['CMAlive' + this.moduleIdentifier].length) {
                this.GRAPHDATA['CMAlive' + this.moduleIdentifier].map(data => {
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['CMAliveOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['CMAliveOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['CMAliveOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['CMAliveOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
        }
    }

    setSystemCo2Sensing() {
        if (this.GRAPHDATA && this.GRAPHDATA['usePerRoomCo2Sensing' + this.moduleIdentifier]) {
            this.GRAPHDATA['usePerRoomCo2SensingOn' + this.moduleIdentifier] = [];
            this.GRAPHDATA['usePerRoomCo2SensingOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['usePerRoomCo2Sensing' + this.moduleIdentifier].length) {
                this.GRAPHDATA['usePerRoomCo2Sensing' + this.moduleIdentifier].map(data => {
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['usePerRoomCo2SensingOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['usePerRoomCo2SensingOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['usePerRoomCo2SensingOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['usePerRoomCo2SensingOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
        }
    }

    setSystemFreeCooling() {
        const freeCoolingkeys = ['freeCoolingEconomize','freeCoolingDCV','freeCoolingMat']
        freeCoolingkeys.forEach(key => {
            if (this.GRAPHDATA && this.GRAPHDATA[key + this.moduleIdentifier]) {
                this.GRAPHDATA[key+'On' + this.moduleIdentifier] = [];
                this.GRAPHDATA[key+'Off' + this.moduleIdentifier] = [];
    
                if (this.GRAPHDATA[key + this.moduleIdentifier].length) {
                    this.GRAPHDATA[key + this.moduleIdentifier].map(data => {
                        // On
                        parseInt(data.val) == 1 ? this.GRAPHDATA[key+'On' + this.moduleIdentifier].push(data) : this.GRAPHDATA[key+'On' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                        // Off
                        parseInt(data.val) == 0 ? this.GRAPHDATA[key+'Off' + this.moduleIdentifier].push(data) : this.GRAPHDATA[key+'Off' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    });
                }
            }
        });
        
        
    }

    setSystemOAOSystemData() {
        if (this.GRAPHDATA && this.GRAPHDATA['EpidemicMode' + this.moduleIdentifier]) {
            this.GRAPHDATA['Off' + this.moduleIdentifier] = [];
            this.GRAPHDATA['PrePurge' + this.moduleIdentifier] = [];
            this.GRAPHDATA['PostPurge' + this.moduleIdentifier] = [];
            this.GRAPHDATA['EnhancedVentilation' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['EpidemicMode' + this.moduleIdentifier].length) {
                this.GRAPHDATA['EpidemicMode' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['Off' + this.moduleIdentifier].push(data) : this.GRAPHDATA['Off' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // PrePurge
                    parseInt(data.val) == 1 ? this.GRAPHDATA['PrePurge' + this.moduleIdentifier].push(data) : this.GRAPHDATA['PrePurge' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // PostPurge
                    parseInt(data.val) == 2 ? this.GRAPHDATA['PostPurge' + this.moduleIdentifier].push(data) : this.GRAPHDATA['PostPurge' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // EnhancedVentilation
                    parseInt(data.val) == 3 ? this.GRAPHDATA['EnhancedVentilation' + this.moduleIdentifier].push(data) : this.GRAPHDATA['EnhancedVentilation' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
        }
    }

    setOccupancyTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['occupancy' + this.moduleIdentifier]) {
            this.GRAPHDATA['setpoint' + this.moduleIdentifier] = [];
            this.GRAPHDATA['setback' + this.moduleIdentifier] = [];
            this.GRAPHDATA['vacation' + this.moduleIdentifier] = [];
            this.GRAPHDATA['preconditioning' + this.moduleIdentifier] = [];
            this.GRAPHDATA['temporaryHold' + this.moduleIdentifier] = [];
            this.GRAPHDATA['away' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['occupancy' + this.moduleIdentifier].length) {
                this.GRAPHDATA['occupancy' + this.moduleIdentifier].map(data => {
                    // setback
                    parseInt(data.val) == 0 ? this.GRAPHDATA['setback' + this.moduleIdentifier].push(data) : this.GRAPHDATA['setback' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // setpoint
                    parseInt(data.val) == 1 ? this.GRAPHDATA['setpoint' + this.moduleIdentifier].push(data) : this.GRAPHDATA['setpoint' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // preconditioning
                    parseInt(data.val) == 2 ? this.GRAPHDATA['preconditioning' + this.moduleIdentifier].push(data) : this.GRAPHDATA['preconditioning' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // temporaryHold
                    parseInt(data.val) == 3 ? this.GRAPHDATA['temporaryHold' + this.moduleIdentifier].push(data) : this.GRAPHDATA['temporaryHold' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // vacation
                    parseInt(data.val) == 4 ? this.GRAPHDATA['vacation' + this.moduleIdentifier].push(data) : this.GRAPHDATA['vacation' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // away
                    parseInt(data.val) == 5 ? this.GRAPHDATA['away' + this.moduleIdentifier].push(data) : this.GRAPHDATA['away' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
            // Map enums by following index & order of enum keys are important
            this.setEnumProperties('occupancy' + this.moduleIdentifier,
                ['setback' + this.moduleIdentifier, 'setpoint' + this.moduleIdentifier, 'preconditioning' + this.moduleIdentifier,
                'temporaryHold' + this.moduleIdentifier, 'vacation' + this.moduleIdentifier, 'away' + this.moduleIdentifier
                ]);
        }
    }

    setBatteryChargingTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['BatteryCharging' + this.moduleIdentifier]) {
            this.GRAPHDATA['batteryOn' + this.moduleIdentifier] = [];
            this.GRAPHDATA['batteryOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['BatteryCharging' + this.moduleIdentifier].length) {
                this.GRAPHDATA['BatteryCharging' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['batteryOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['batteryOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['batteryOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['batteryOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
        }
    }

    setPowerConnectedTypeData() {
        if (this.GRAPHDATA && this.GRAPHDATA['PowerConnected' + this.moduleIdentifier]) {
            this.GRAPHDATA['powerConnectedOn' + this.moduleIdentifier] = [];
            this.GRAPHDATA['powerConnectedOff' + this.moduleIdentifier] = [];

            if (this.GRAPHDATA['PowerConnected' + this.moduleIdentifier].length) {
                this.GRAPHDATA['PowerConnected' + this.moduleIdentifier].map(data => {
                    // Off
                    parseInt(data.val) == 0 ? this.GRAPHDATA['powerConnectedOff' + this.moduleIdentifier].push(data) : this.GRAPHDATA['powerConnectedOff' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                    // On
                    parseInt(data.val) == 1 ? this.GRAPHDATA['powerConnectedOn' + this.moduleIdentifier].push(data) : this.GRAPHDATA['powerConnectedOn' + this.moduleIdentifier].push({ ts: data.ts, val: null });
                });
            }
        }
    }

    initGraphData(data) {
        if (data !== null && typeof data !== 'undefined' && typeof this.graphData !== 'undefined') {
            // Object.assign(this.chartData, { [this.graphData.type]: [] });
            if (typeof this.graphData.params !== 'undefined') {
                for (let i = 0; i < this.graphData.params.length; i++) {
                    if(this.graphData.params[i].toolTip.valuesCopyKey && this.GRAPHDATA[this.graphData.params[i].toolTip.valuesCopyKey] ) {
                        this.GRAPHDATA[this.graphData.params[i].name] = this.GRAPHDATA[this.graphData.params[i].toolTip.valuesCopyKey]
                    }
                    // Get graph name
                    const graph = this.graphData.params[i].name;

                    // Initialize graph data object for this particular graph
                    this.gData = Object.assign(this.gData, { [graph]: {} });

                    // Initialize chart data object for this particular graph
                    this.cData = Object.assign(this.cData, { [this.graphData.type]: [] });

                    // Fetch graph data from main data object for this particular type
                    this.gData[graph].values = (typeof data[graph] !== 'undefined') ? (typeof data[graph] !== 'undefined') ? data[graph] : [] : [];

                    // Set graph id
                    this.gData[graph].id = graph;

                    // Set tooltip availability
                    this.gData[graph].tooltip = this.graphData.params[i].toolTip;

                    // Set color for this particular series
                    this.gData[graph].color = this.graphData.params[i].color;

                    // Set the param type
                    this.gData[graph].type = this.graphData.params[i].type;

                    // Set stack order type
                    this.gData[graph].stackOrder = (this.graphData.params[i].stackOrder != undefined) ? this.graphData.params[i].stackOrder : 0;

                    // (Optional) Set display name for this particular series
                    this.gData[graph].name = this.graphData.names ? this.graphData.names[i] : undefined;

                    // (Optional) Set point type (writableOnly)
                    this.gData[graph].writableOnly = (this.graphData.params[i].writableOnly != undefined) ? this.graphData.params[i].writableOnly : false;

                    // Populate chart data object with the graph object created
                    this.cData[this.graphData.type].push(this.gData);
                }
                if (data && data[this.graphData.params[0]]) {
                    // Used as x-axis values , since it remanins same for all charts , hence defining it for 1 params is enough
                    this.xAxisData = data[this.graphData.params[0]].map(x => new Date(x.ts));
                }
            } else {
                // graphData not available
            }
            if (typeof this.cData[this.graphData.type] !== 'undefined') {
                // populate values
                this.GRAPHDATA = Object.keys(this.cData[this.graphData.type][0]).map(key => (this.cData[this.graphData.type][0][key]));
                this.bandLimits = this.getBandChartLimits();
            }
            else {
                this.GRAPHDATA = [];
            }

            this.initChart();
            this.drawAxis();
            this.drawPath();
            this.defineHoverRegion();
        }
        else {
            if (this.graphId) {
                d3.select('svg#' + this.graphId).selectAll('image').remove();
                d3.select('svg#' + this.graphId).selectAll('text').remove();
                d3.select('svg#' + this.graphId).append('text').attr('class', 'noDataAvailable')
                    .attr("x", 20).attr("y", 50).text("No Data available for selected date range.").style('font-size', '10px');
            }
        }
    }

    defineHoverRegion() {
        const hoverRegion = this.svg.selectAll('rect');

        hoverRegion.on("mouseover", (d) => {
            if (d3.event) {
                // Update tool tip xcords
                this.heatMapToolTipService.layerX = d3.event.layerX;
                this.heatMapToolTipService.offsetX = d3.event.offsetX;
            }
            this.heatMapToolTipService.isToolTipVisible = true;
            this.heatMapToolTipService.relevantIdFilter = this.moduleRef;
            this.heatMapToolTipService.moduleIdentifier = this.moduleIdentifier;
            this.heatMapToolTipService.clearIrrelevantEntries();
            // Update the hovered graph id
            this.heatMapToolTipService.hoveredGraphId = this.graphId;
            // Reorder graphs
            this.heatMapToolTipService.reOrderGraphWidgets();
            // set units
            this.heatMapToolTipService.curveUnitsCollection = this.graphService.graphPointsUnitsCollection;
        });

        hoverRegion.on("mouseout", (d) => {
            // Reset tool tip xcords
            this.heatMapToolTipService.layerX = null;
            this.heatMapToolTipService.offsetX = null;
            this.heatMapToolTipService.isToolTipVisible = false;
            this.heatMapToolTipService.clearToolTip();
        });

        hoverRegion.on("mousemove", (d) => {
            if (d3.event) {
                // Update tool tip xcords
                this.heatMapToolTipService.layerX = d3.event.layerX;
                this.heatMapToolTipService.offsetX = d3.event.offsetX;
                this.heatMapToolTipService.clearToolTip();
                this.heatMapToolTipService.xAxis = this.x;
            }
            this.heatMapToolTipService.generateToolTip();
        });
    }

    jsonStringify(data: any) {
        return JSON.stringify(data);
    }

    checkGraphData(data) {
        let dataPresent;
        try {
            if (!data || !Array.isArray(data)) return false;
            dataPresent = data.filter(graph => graph.values.length > 0);
            return (dataPresent.length > 0) ? true : false;
        } catch (e) {
            throw new Error("Incorrect data format.");
        }

    }

    private initChart() {
        this.svg = d3.select('svg#' + this.graphId);
        // this.svg.selectAll('text').remove();
        if (!this.svg.empty()) { // fix for LSINTPORTA-657
            // Add to rendered graphs collections
            if (this.heatMapToolTipService.graphIdCollection.indexOf(this.graphId) == -1) {
                this.heatMapToolTipService.graphIdCollection.push(this.graphId);
            }

            // Update the graph data to service
            this.heatMapToolTipService.updategraphData(this.graphId, this.GRAPHDATA);

            // Update Graph widget hegihts
            this.heatMapToolTipService.updategraphHeights(this.graphId, this.graphData.widgetHeight)

            if (this.checkGraphData(this.GRAPHDATA)) {
                // clean up svg before rendering anything to prevent data overwrite
                this.svg.selectAll('image').remove();
                this.svg.selectAll('text').remove();
                d3.selectAll('.' + this.graphId + ' span.tooltip').remove();
                this.svg.selectAll('g').remove();

                // instantiate the tooltip
                this.toolTip = d3.select('.' + this.graphId).append('span')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);

                // Update the graph svg data to service
                this.heatMapToolTipService.updategraphSvgRefs(this.graphId, d3.select('.' + this.graphId));

                this.graphBoundary = document.getElementById('graph-wrapper').getBoundingClientRect();

                // Sometimes the graph collapses to 0,0 ... this is to prevent that issue
                if (this.graphBoundary.width == 0) {

                    this.width = this.graphWidth != null ? this.graphWidth : window.innerWidth * 0.65;
                }
                else {
                    this.width = (Math.ceil(this.graphBoundary.width) - this.margin.right) >= 0 ? Math.ceil(this.graphBoundary.width) - this.margin.right : Math.ceil(this.graphBoundary.width);
                }

                // update the graph widths data to service
                this.heatMapToolTipService.updategraphWidhts(this.graphId, this.width);
                this.svg.attr('width', this.width + this.margin.right);
                let height = ((this.svg && this.svg.attr('height')) ? this.svg.attr('height').replace('px', '') : 0);
                this.margin.bottom = 10;
                this.margin.bottom += this.setMargin();
                this.height = height - this.margin.top - this.margin.bottom;
                
                this.g = this.svg.append('g')
                    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
                    .attr("width", this.width);
                this.x = d3Scale.scaleTime();
                this.y = d3Scale.scaleLinear().range([this.height, 0]);
                this.yRight = d3Scale.scaleLinear().range([this.height, 0]);
                this.z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10);

                this.hoveredRegion = this.g.append("g")
                    .attr("class", "tool-tip-region");

                this.hoveredRegion.append("svg:rect")
                    .attr("class", "tooltip-hover-region")
                    .attr("width", this.width)
                    .attr("fill", "none")
                    .attr("height", this.height)
                    .attr("pointer-events", "all");

                // Deep copy end date
                let endDate = moment(this.heatMapToolTipService.selectedDateRange.endDate).endOf('day').toString();
                endDate = endDate.substring(0, endDate.lastIndexOf(' '));
                let startDate = this.heatMapToolTipService.selectedDateRange.startDate.toString();
                startDate = startDate.substring(0, startDate.lastIndexOf(' '));
                this.x.domain([new Date(startDate), new Date(endDate)]).range([0, this.width]);
                this.z.domain(this.GRAPHDATA.map((c) => c.id));
            } else {
                this.svg.selectAll('image').remove();
                this.svg.selectAll('g').remove();
                this.svg.selectAll('text').remove();
                this.svg.append('text').attr('class', 'noDataAvailable')
                    .attr("x", 20).attr("y", 50).text("No Data available for selected date range.").style('font-size', '10px')
            }
        }
    }

    // Set y domain
    setYDomain(graphType) {
        switch (graphType.type) {
            case PucGraphTypes.LINE: case PucGraphTypes.DASHED_LINE:
                this.y.domain([
                    d3Array.min(this.GRAPHDATA, (c: any) => d3Array.min(c.values, (d: any) => Number(d.val))),
                    d3Array.max(this.GRAPHDATA, (c: any) => d3Array.max(c.values, (d: any) => Number(d.val)))
                ]);

                this.line = d3Shape.line()
                    .defined((d: any) => { return d.val != null })
                    .curve(d3Shape.curveBasis)
                    .x((d: any) => this.x(new Date(d.ts)))
                    .y((d: any) => this.y(Number(d.val)));
                break;

            case PucGraphTypes.HORIZONTALLY_STACKED_MERGED: case PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR: case PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA:
                this.yRight.domain([0, 0]);

                this.lineRightYAxis = d3Shape.line()
                    .defined((d: any) => { return d.val != null })
                    .curve(d3Shape.curveBasis)
                    .x((d: any) => this.x(new Date(d.ts)))
                    .y((d: any) => this.yRight(Number(d.val)));
                break;

            case PucGraphTypes.VERTICAL_BAR:
                // to be revisited
                this.y.domain([0, d3Array.max(this.GRAPHDATA, (c: any) => d3Array.max(c.values, (d: any) => Number(d.val)))])

                this.line = d3Shape.line()
                    .curve(d3Shape.curveBasis)
                    .x((d: any) => this.x(new Date(d.ts)))
                    .y((d: any) => this.y(Number(d.val)));
                break;

            case PucGraphTypes.AREA:
                const areaTypeY = d3Scale.scaleLinear().range([this.height, 0]);
                areaTypeY.domain([0, 1]);

                const areaTypeColor = graphType.color;
                const areaType = d3Shape.area()
                    .defined((d: any) => { return d.val != null })
                    .curve(d3Shape.curveBasis)
                    .x((d: any) => this.x(new Date(d.ts)))
                    .y1((d: any) => areaTypeY(d.val))
                    .y0((d: any) => areaTypeY(0));

                if (this.runtimeAreaGraphs.find(runtime => runtime.id === graphType.id)) {
                    // Already exists
                }
                else {
                    this.runtimeAreaGraphs.push({ color: areaTypeColor, curve: areaType, id: graphType.id });
                }
                break;

            case PucGraphTypes.BAND:
                switch (graphType.id) {
                    case "coolingUserLimitMin" + this.moduleIdentifier: case "coolingUserLimitMax" + this.moduleIdentifier:
                        if (this.bandLimits.coolingLimits.min && this.bandLimits.coolingLimits.max) {
                            const coolingLimit = d3Scale.scaleLinear().range([this.height, 0]);
                            coolingLimit.domain([
                                d3Array.min(this.GRAPHDATA, (c: any) => d3Array.min(c.values, (d: any) => Number(d.val))),
                                d3Array.max(this.GRAPHDATA, (c: any) => d3Array.max(c.values, (d: any) => Number(d.val)))
                            ]);

                            this.coolingBandColor = graphType.color;
                            this.coolingBand = d3Shape.area()
                                .defined((d: any) => { return d.val != null })
                                .curve(d3Shape.curveBasis)
                                .x((d: any) => this.x(new Date(d.ts)))
                                .y0((d: any) => coolingLimit(this.bandLimits.coolingLimits.max))
                                .y1((d: any) => coolingLimit(this.bandLimits.coolingLimits.min));

                        }
                        break;
                    case "heatingUserLimitMin" + this.moduleIdentifier: case "heatingUserLimitMax" + this.moduleIdentifier:
                        if (this.bandLimits.heatingLimits.min && this.bandLimits.heatingLimits.max) {
                            const heatingLimit = d3Scale.scaleLinear().range([this.height, 0]);
                            heatingLimit.domain([
                                d3Array.min(this.GRAPHDATA, (c: any) => d3Array.min(c.values, (d: any) => Number(d.val))),
                                d3Array.max(this.GRAPHDATA, (c: any) => d3Array.max(c.values, (d: any) => Number(d.val)))
                            ]);

                            this.heatingBandColor = graphType.color;
                            this.heatingBand = d3Shape.area()
                                .defined((d: any) => { return d.val != null })
                                .curve(d3Shape.curveBasis)
                                .x((d: any) => this.x(new Date(d.ts)))
                                .y0((d: any) => heatingLimit(this.bandLimits.heatingLimits.max))
                                .y1((d: any) => heatingLimit(this.bandLimits.heatingLimits.min));
                        }
                        break;

                    default:
                        throw new Error("Error: Unsupported band type-" + graphType.id)
                }
                break;

            case PucGraphTypes.AREA_LINE:
                this.y.domain([
                    d3Array.min(this.GRAPHDATA, (c: any) => d3Array.min(c.values, (d: any) => Number(d.val))),
                    d3Array.max(this.GRAPHDATA, (c: any) => d3Array.max(c.values, (d: any) => Number(d.val)))
                ]);

                this.line = d3Shape.line()
                    .defined((d: any) => { return d.val != null })
                    .curve(d3Shape.curveBasis)
                    .x((d: any) => this.x(new Date(d.ts)))
                    .y((d: any) => this.y(Number(d.val)));
                break;

            case PucGraphTypes.LINE_ALTER_AXIS:
                this.yRight.domain([0, 1]);

                this.lineRightYAxis = d3Shape.line()
                    .defined((d: any) => { return d.val != null })
                    .curve(d3Shape.curveBasis)
                    .x((d: any) => this.x(new Date(d.ts)))
                    .y((d: any) => this.yRight(Number(d.val)));
                break;

            case PucGraphTypes.LINE_ALTER_AXIS_DYNAMIC_LIMITS:

                this.yRight.domain([
                    d3Array.min(this.GRAPHDATA, (c: any) => d3Array.min(c.values, (d: any) => Number(d.val))),
                    d3Array.max(this.GRAPHDATA, (c: any) => d3Array.max(c.values, (d: any) => Number(d.val)))
                ]);

                this.lineRightYAxis = d3Shape.line()
                    .defined((d: any) => { return d.val != null })
                    .curve(d3Shape.curveBasis)
                    .x((d: any) => this.x(new Date(d.ts)))
                    .y((d: any) => this.yRight(Number(d.val)));
                break;

            default:
                throw new Error("Error: Unsupported graph type-" + graphType.type)
        }
    }

    // get band chart limits
    getBandChartLimits() {
        let coolMin = 0;
        let coolMax = 0;

        let heatMin = 0;
        let heatMax = 0;

        this.GRAPHDATA.forEach(graph => {
            if (graph.values[0]) {
                switch (graph.id) {
                    case "coolingUserLimitMin" + this.moduleIdentifier:
                        coolMin = Number(graph.values.filter(item => item.val != null)[0].val)
                        break;
                    case "coolingUserLimitMax" + this.moduleIdentifier:
                        coolMax = Number(graph.values.filter(item => item.val != null)[0].val)
                        break;
                    case "heatingUserLimitMax" + this.moduleIdentifier:
                        heatMax = Number(graph.values.filter(item => item.val != null)[0].val);
                        break;
                    case "heatingUserLimitMin" + this.moduleIdentifier:
                        heatMin = Number(graph.values.filter(item => item.val != null)[0].val);
                        break;
                }
            }
        });
        return { coolingLimits: { min: coolMin, max: coolMax }, heatingLimits: { min: heatMin, max: heatMax } };
    }

    // Set grid lines
    setGridLines(graphType) {
        switch (graphType) {
            case PucGraphTypes.LINE: case PucGraphTypes.AREA: case PucGraphTypes.DASHED_LINE: case PucGraphTypes.AREA_LINE:
                let adjustForRightAxis = false;

                this.GRAPHDATA.map(item => {
                    if (item.type == PucGraphTypes.LINE_ALTER_AXIS || item.type == PucGraphTypes.LINE_ALTER_AXIS_DYNAMIC_LIMITS) {
                        adjustForRightAxis = true;
                    }
                });

                const gridlines = d3Axis.axisLeft(this.y)
                    .ticks(3)
                    .tickSize(adjustForRightAxis ? -this.width + 13 : -this.width);

                const count = this.g.selectAll('.grid')._groups[0].length
                if (count == 0) {
                    this.g.append('g')
                        .attr('class', 'grid')
                        .call(gridlines)
                        .call(g => g.select('.domain').remove());
                }

                // In case of large y tick val , add padding for better view
                this.g.selectAll('g.grid g.tick text')
                    .attr("x", (d) => {
                        switch (d.toString().length) {
                            case 4:
                                return 5;
                            case 5:
                                return 7;
                            case 6:
                                return 14;
                        }
                    });

                break;

            case PucGraphTypes.HORIZONTALLY_STACKED_MERGED: case PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR: case PucGraphTypes.VERTICAL_BAR: case PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA:
                break;

            case PucGraphTypes.BAND: case PucGraphTypes.LINE_ALTER_AXIS: case PucGraphTypes.LINE_ALTER_AXIS_DYNAMIC_LIMITS:
                // Do nothing , as its in comobination with other type
                break;

            default:
                throw new Error("Error: Unsupported graph type in setGridLines-" + graphType)
        }
    }

    private drawAxis() {
        if (this.g) {
            this.g.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(0,' + this.height + ')')
                .attr('fill', '#fff')
                .attr('stroke', '#fff')
                .style('opacity', '0')
                .call(d3Axis.axisBottom(this.x).ticks(9).tickSize(0)).call(g => {
                    this.xAxisCords.emit(g._groups[0][0].childNodes);
                });
            // Left Y-Axis
            this.g.append('g')
                .attr('class', 'axis axis--y')
                .call(d3Axis.axisLeft(this.y).ticks(3).tickSize(0)).call(g => g.select('.domain').remove())
                .attr('fill', '#ffffff')
                .attr('stroke', '#ffffff');
            // Right Y-Axis
            let rightY: any;
            if (this.GRAPHDATA.filter(field => field.type == PucGraphTypes.LINE_ALTER_AXIS_DYNAMIC_LIMITS).length > 0) {
                rightY = d3Scale.scaleLinear().range([this.height, 0]);
                let min = 0;
                let max = 1;
                // fetch the min max
                this.GRAPHDATA.filter(field => field.type == PucGraphTypes.LINE_ALTER_AXIS_DYNAMIC_LIMITS).forEach(entity => {
                    const minVal = d3Array.min(entity.values.map(item => item.val));
                    const maxVal = d3Array.max(entity.values.map(item => item.val));
                    minVal < min ? min = minVal : '';
                    maxVal > max ? max = maxVal : '';
                });
                rightY.domain([min, max]);
            }
            else {
                rightY = this.yRight;
            }

            this.g.append('g')
                .attr('class', 'axis axis--y--right')
                .call(d3Axis.axisRight(rightY).ticks(3).tickSize(0)).call(g => g.select('.domain').remove())
                .attr('opacity', this.getRightAxisOpacity())
                .attr('transform', "translate(" + (this.width - this.margin.right) + ",0)");
        }
        else {
            // g is not defined
        }
    }

    getRightAxisOpacity() {
        let hasRightAxisType = false;
        this.GRAPHDATA.map(item => {
            if (item.type == PucGraphTypes.LINE_ALTER_AXIS || item.type == PucGraphTypes.LINE_ALTER_AXIS_DYNAMIC_LIMITS) {
                hasRightAxisType = true;
            }
        })

        return hasRightAxisType ? '1' : '0'
    }

    translateStack(graphType) {
        let translate = ""
        switch (graphType.type) {
            case PucGraphTypes.HORIZONTALLY_STACKED_MERGED:
                translate = 'translate(0,' + graphType.stackOrder * (-10) + ')'
                break;
            case PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR:
                if (graphType.stackOrder && graphType.stackOrder >= 0) {
                    translate = 'translate(0,' + graphType.stackOrder * (9) + ')'
                }
                else {
                    translate = 'translate(0,7)'
                }
                break;
            case PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA:
                if (graphType.stackOrder && graphType.stackOrder >= 0) {
                    translate = 'translate(0,' + graphType.stackOrder * (8) + ')'
                }
                else {
                    translate = 'translate(0,3)'
                }
                break;
        }
        return translate;
    }

    private setMargin() {
        let bandGraphsCountInWidget = this.GRAPHDATA.filter((c)=> c.type == PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR || c.type == PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA || c.type == PucGraphTypes.HORIZONTALLY_STACKED_MERGED);
        if(bandGraphsCountInWidget.length == this.GRAPHDATA.length) bandGraphsCountInWidget = [];
        return bandGraphsCountInWidget.length * 5;
    }

    private drawPath() {
        if (this.g) {
            const type = this.g.selectAll('.type')
                .data(this.GRAPHDATA)
                .enter().append('g')
                .attr('class', 'type')
                .attr('transform', (d) => this.translateStack(d));

            // For Left Axis
            type.append('path')
                .attr('class', (d) => d.id)
                .attr('toSetYDomain', (d) => this.setYDomain(d))
                .attr('toSetGridLines', (d) => this.setGridLines(d.type))
                .attr('d', (d) => (((d.type != PucGraphTypes.AREA) && (d.type != PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR) && (d.type != PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA) && (d.type != PucGraphTypes.HORIZONTALLY_STACKED_MERGED) && (d.type != PucGraphTypes.LINE_ALTER_AXIS) && (d.type != PucGraphTypes.LINE_ALTER_AXIS_DYNAMIC_LIMITS)) ? this.line(d.values) : ''))
                .style('fill', (d) => this.getFill(d.type, d.color))
                .style('stroke', (d) => this.getStroke(d.type, d.color))
                .style('stroke-width', (d) => this.getStrokeWidth(d.type))
                .style('stroke-dasharray', (d) => (d.type === PucGraphTypes.DASHED_LINE ? '5' : ''))
                .style('opacity', (d) => this.getOpacity(d.type));

            const hoverRegion = type.append("g")
                .attr("class", "tool-tip-region");

            hoverRegion.append("svg:rect")
                .attr("class", "tooltip-hover-region")
                .attr("width", this.width)
                .attr("fill", "none")
                .attr("height", this.height)
                .attr("pointer-events", "all");

            // For Right Axis
            type.append('path')
                .attr('class', (d) => d.id)
                .attr('toSetYDomain', (d) => this.setYDomain(d))
                .attr('d', (d) => (((d.type == PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR) || (d.type == PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA) || (d.type == PucGraphTypes.HORIZONTALLY_STACKED_MERGED) || (d.type == PucGraphTypes.LINE_ALTER_AXIS) || (d.type == PucGraphTypes.LINE_ALTER_AXIS_DYNAMIC_LIMITS)) ? this.lineRightYAxis(d.values) : ''))
                .style('fill', (d) => this.getFill(d.type, d.color))
                .style('stroke', (d) => this.getStroke(d.type, d.color))
                .style('stroke-width', (d) => this.getStrokeWidth(d.type))
                .style('opacity', (d) => this.getOpacity(d.type));

            const hoverRegionRA = type.append("g")
                .attr("class", "tool-tip-region");

            hoverRegionRA.append("svg:rect")
                .attr("class", "tooltip-hover-region")
                .attr("width", this.width)
                .attr("fill", "none")
                .attr("height", this.height)
                .attr("pointer-events", "all");

            // Runtime areas
            if (this.runtimeAreaGraphs.length) {
                this.runtimeAreaGraphs.forEach(runtime => {
                    const areaType = this.g.append('g')
                        .attr('class', 'runtimeTypeArea' + runtime.id)
                        .data(this.GRAPHDATA.filter(curve => curve.id == runtime.id))

                    areaType.append('path')
                        .attr('class', runtime.id)
                        .attr('d', (d) => runtime.curve(d.values))
                        .style('fill', this.getFill(PucGraphTypes.AREA, runtime.color))
                        .style('opacity', this.getOpacity(PucGraphTypes.AREA));

                    const areaHoverRegion = areaType.append("g")
                        .attr("class", "tool-tip-region");

                    areaHoverRegion.append("svg:rect")
                        .attr("class", "tooltip-hover-region")
                        .attr("width", this.width)
                        .attr("fill", "none")
                        .attr("height", this.height)
                        .attr("pointer-events", "all");
                })
            }

            // cooling band
            if (this.coolingBand) {
                const areaType = this.g.append('g')
                    .attr('class', 'coolBand')
                    .data(this.GRAPHDATA)

                areaType.append('path')
                    .attr('class', 'coolingBand')
                    .attr('d', (d) => this.coolingBand(d.values))
                    .style('fill', this.getFill(PucGraphTypes.BAND, this.coolingBandColor))
                    .style('opacity', this.getOpacity(PucGraphTypes.BAND));

                const areaHoverRegion = areaType.append("g")
                    .attr("class", "tool-tip-region");

                areaHoverRegion.append("svg:rect")
                    .attr("class", "tooltip-hover-region")
                    .attr("width", this.width)
                    .attr("fill", "none")
                    .attr("height", this.height)
                    .attr("pointer-events", "all");
            }
            // heating band
            if (this.heatingBand) {
                const areaType = this.g.append('g')
                    .attr('class', 'heatBand')
                    .data(this.GRAPHDATA)

                areaType.append('path')
                    .attr('class', 'heatingBand')
                    .attr('d', (d) => this.heatingBand(d.values))
                    .style('fill', this.getFill(PucGraphTypes.BAND, this.heatingBandColor))
                    .style('opacity', this.getOpacity(PucGraphTypes.BAND));

                const areaHoverRegion = areaType.append("g")
                    .attr("class", "tool-tip-region");

                areaHoverRegion.append("svg:rect")
                    .attr("class", "tooltip-hover-region")
                    .attr("width", this.width)
                    .attr("fill", "none")
                    .attr("height", this.height)
                    .attr("pointer-events", "all");
            }
        }
        else {
            // Graph not rendered
        }

        if (this.linearData) {
            const linearGraphData = JSON.parse(JSON.stringify(this.GRAPHDATA));
            this.linearData.map((linearValue, index) => {
                linearGraphData[index].values.forEach((data) => {
                    data.ts = data.ts;
                    data.val = this.linearData[index].val;
                });
                linearGraphData[index].color = this.linearData[index].color;
            });
            const tax = this.g.selectAll('.tax')
                .data(linearGraphData)
                .enter().append('g')
                .attr('class', 'tax');


            tax.append('path')
                .attr('class', 'line')
                .attr('d', (d) => this.line(d.values))
                .style('stroke', (d) => d.color)
                .style('stroke-dasharray', ('3, 3'))
                .style('stroke-width', '1px');
        }
    }

    getStroke(graphType, graphColor) {
        let param: string;
        switch (graphType) {
            case PucGraphTypes.HORIZONTALLY_STACKED_MERGED: case PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR: case PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA: case PucGraphTypes.LINE: case PucGraphTypes.DASHED_LINE: case PucGraphTypes.AREA_LINE: case PucGraphTypes.LINE_ALTER_AXIS: case PucGraphTypes.LINE_ALTER_AXIS_DYNAMIC_LIMITS:
                param = graphColor;
                break;

            case PucGraphTypes.AREA: case PucGraphTypes.BAND:
                param = "";
                break;

            default:
                throw new Error("Error: Unsupported graph type: " + graphType)

        }
        return param
    }

    getOpacity(graphType) {
        let param: string;
        switch (graphType) {
            case PucGraphTypes.HORIZONTALLY_STACKED_MERGED: case PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA: case PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR: case PucGraphTypes.LINE: case PucGraphTypes.DASHED_LINE: case PucGraphTypes.AREA_LINE: case PucGraphTypes.LINE_ALTER_AXIS: case PucGraphTypes.LINE_ALTER_AXIS_DYNAMIC_LIMITS:
                param = "";
                break;

            case PucGraphTypes.AREA: case PucGraphTypes.BAND:
                param = "0.3";
                break;

            default:
                throw new Error("Error: Unsupported graph type: " + graphType)

        }
        return param
    }

    getFill(graphType, graphColor) {
        let param: string;
        switch (graphType) {
            case PucGraphTypes.HORIZONTALLY_STACKED_MERGED: case PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR: case PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA: case PucGraphTypes.LINE: case PucGraphTypes.DASHED_LINE: case PucGraphTypes.AREA_LINE: case PucGraphTypes.LINE_ALTER_AXIS: case PucGraphTypes.LINE_ALTER_AXIS_DYNAMIC_LIMITS:
                param = "transparent";
                break;

            case PucGraphTypes.AREA: case PucGraphTypes.BAND:
                param = graphColor;
                break;

            default:
                throw new Error("Error: Unsupported graph type: " + graphType)

        }
        return param
    }

    getStrokeWidth(graphType) {
        let param: string;
        switch (graphType) {
            case PucGraphTypes.HORIZONTALLY_STACKED_MERGED: case PucGraphTypes.HORIZONTALLY_STACKED_SINGULAR:
                param = "8px";
                break;

            case PucGraphTypes.HORIZONTALLY_STACKED_WITH_AREA:
                param = "4px";
                break;

            case PucGraphTypes.LINE: case PucGraphTypes.DASHED_LINE: case PucGraphTypes.AREA_LINE: case PucGraphTypes.LINE_ALTER_AXIS: case PucGraphTypes.LINE_ALTER_AXIS_DYNAMIC_LIMITS:
                param = "1.5px";
                break;

            case PucGraphTypes.AREA: case PucGraphTypes.BAND:
                param = "";
                break;

            default:
                throw new Error("Error: Unsupported graph type: " + graphType)

        }
        return param
    }

    // Sets bowser offset
    public setBrowserOffset() {
        if (navigator.userAgent.indexOf("Chrome") != -1) {
            this.heatMapToolTipService.browserOffset = this.margin.right;
        }
        else if (navigator.userAgent.indexOf("Safari") != -1) {
            this.heatMapToolTipService.browserOffset = this.margin.right;
        }
        else if (navigator.userAgent.indexOf("Firefox") != -1) {
            this.heatMapToolTipService.browserOffset = 0;
        }
        else {
            throw new Error("Error: Unsupported Browser Type !!!!")
        }
    }


    setEnumProperties(parentKey: string, enumKeys: any[]) {
        const enumArray: any[] = (this.graphService.graphPointsEnumCollection
            && this.graphService.graphPointsEnumCollection.has(parentKey)
            && this.graphService.graphPointsEnumCollection.get(parentKey))
            ? this.graphService.graphPointsEnumCollection.get(parentKey).split(',') : [];
        if (Array.isArray(enumArray) && enumArray.length) {
            enumKeys.forEach((key, index) => {
                if (key) {
                    this.heatMapToolTipService.curveEnumCollection.set(key, enumArray[index].charAt(0).toUpperCase() + enumArray[index].slice(1));
                }
            })
        }
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.heatMapToolTipService.clearTooltipData();
    }
}