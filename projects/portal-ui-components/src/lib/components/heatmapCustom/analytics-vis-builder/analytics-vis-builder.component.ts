import * as moment from 'moment';

import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { cloneDeep, filter, find, flatten } from 'lodash-es';

import { AlertService } from '../../../services/alert.service';
import { ClickService } from '../../../services/click.service';
import { CustomHeatmapService } from '../../../services/custom-heatmap.service';
import { HeatmapConnectService } from '../../../services/heatmap-connect.service';
import { HelperService } from '../../../services/hs-helper.service';
import { SiteService } from '../../../services/site.service';
import { TEXT } from '../../../constants/text';
import { map } from 'rxjs/operators';

export interface Idata {
  entityRef: string;
  ccus: Array<any>;
  zones: Array<any>;
  mode: string;
  equips: Array<any>;
  siteRef: string;
  type: string;
  modalType: string;
  allWidgets: Array<any>;
  widgetSelected: any; // date Range, timeConstraint
  yPosition: number;
  mappedDashboardId: string;
  createMappingDashboard: boolean;
  widgetName: string;
}

const CHART_OPTION_ONE_CHART = 'oneChart';
const CHART_OPTION_SEPARATE_CHARTS = 'chartPerPoint';
const CHART_OPTION_COMBINE_EQUIPS = 'chartPerEquip';

const baseColorOptions = ['#E95E6F', '#EF9453', '#F7C325', '#1AAE9F', '#92CA4B', '#897A5F',
    '#439AEB', '#9635E2', '#C660D7', '#4B5C6B', '#788896', '#BABABA'];

@Component({
  selector: 'puc-analytics-vis-builder',
  templateUrl: './analytics-vis-builder.component.html',
  styleUrls: ['./analytics-vis-builder.component.scss']
})
export class AnalyticsVisBuilderComponent implements OnInit, OnDestroy {

  @Input() data: Idata;
  @Input() taglist;

  @Output() visBuilderClosed: EventEmitter<any> = new EventEmitter();

  @ViewChild('analyticsVisBuilderContent', { static: true }) analyticsVisBuilderContent: ElementRef;
  chartOptions: Array<any> = [
    {
        label: 'Separate Charts',
        value: 'chartPerPoint'
    },
    {
        label: 'Combine Equips',
        value: CHART_OPTION_COMBINE_EQUIPS
    },
    {
        label: 'Combine Points',
        value: CHART_OPTION_ONE_CHART
    },
  ];

  visibleChartOptions;

  numResults = 0;

  selectedTags: string[] = [];

  points: Array<any> = [];
  // originalPoints: Array<any> = [];

  dataEquips: Array<any> = [];
  equips: Array<any> = [];

  selectedOption: any = CHART_OPTION_SEPARATE_CHARTS;

  hayStackQuery: any;

  equipSearchText: any;

  searchText: any;
  widgetName: string;

  buildType;
  scope;
  entitiesSelected = [];

  equipsSelected = 0;
  allEquips = true;

  selectedPoints = 0;
  selectAllPoints = true;

  hasError = false;
  errMsg = '';

  callMade = false;
  chartName: string;

  gradientSwatchSelections: any = {
    grp1: { stopColor0: '#0000fc', stopColor100: '#00ff1d' },
    grp2: { stopColor0: '#f7c325', stopColor100: '#9635e2' },
    grp3: { stopColor0: '#e95e6f', stopColor100: '#439aeb' }
  };
  selectedGradientGroup: any = 'grp1';
  colorData: any = [[{ label: '', value: '#E95E6F', color: '#E95E6F' }], []];

  subscriptions: any = {};

  visualizations: Array<any> = [];

  vizSelectorOptions = [];

  globalEditMode = false;
  localEditMode = false;

  formData: any;

  showQueryOption = false;
  queryMode = false;

  fetchingPoints = false;

  allFieldsSet = true;
  hasChanges = false;

  minHeightToUseByEquip = 120;
  minHeightToUseSingle = 60;

  trendChartWidgetId = '';
  mappingDashboardId = '';

  vizSelected : any = {};
  viewAreaHeight = 0;

  deleteRequestInProgress = false;
  serverDeleteInProgress = false;

  updatesMadeToDashboard = false;

  chartYPosition = 0;

  savingViz = false;

  constructor(
    private customHeatmapService: CustomHeatmapService,
    private alertService: AlertService,
    private siteService: SiteService,
    private helperService: HelperService,
    private heatmapConnect: HeatmapConnectService,
    private clickService: ClickService
  ) { }


  ngOnInit(): void {

    const data = this.data;
    this.visibleChartOptions = this.chartOptions;

    if (this.data.mappedDashboardId && !this.data.createMappingDashboard) {
      this.mappingDashboardId = this.data.mappedDashboardId;
    }

    if (data.mode === 'edit' && data.type === 'global') {
      this.globalEditMode = true;
      this.visualizations = this.data.allWidgets;

      this.vizSelectorOptions = this.visualizations.map(viz => {
        return {id: viz.widgetId, name: viz.name}
      })

    } else if (data.mode === 'edit' && data.type !== 'global') {
      this.localEditMode = true;
      this.vizSelected = this.data.widgetSelected;

      this.widgetName = this.vizSelected.name;
      this.setFormdata(this.vizSelected);

      this.chartYPosition = this.data.yPosition;

    } else if (data.mode === 'create') {
      this.buildForm();
      this.selectedGradientGroup = Object.keys(this.gradientSwatchSelections)[0];

      this.vizSelected = this.data.widgetSelected;

      this.buildType = 'builder';
      this.chartYPosition = this.data.yPosition;

      if (data.type === 'global') {
        this.scope = 'ccu';
      } else  {
        this.scope = data.type;
        this.onEntitiesSelectionChanged(
          {selectedEntities: [data.entityRef], scope: this.scope, incomingSelection: false, queryGeneration: true});

        this.chartYPosition = this.data.yPosition;
      }

      if (this.scope === 'ccu') {
        this.visibleChartOptions = this.chartOptions.filter(chartOption => chartOption.value !== CHART_OPTION_COMBINE_EQUIPS);
      }
    }

    this.hasChanges = false;
    this.viewAreaHeight = (this.analyticsVisBuilderContent.nativeElement as HTMLElement).clientHeight;
  }


  buildForm() {
    this.widgetName = (this.data.type === 'global')
      ? `Global Widget ${this.data.yPosition}` : this.data.widgetName;
    this.allEquips = true;
    this.selectAllPoints = true;
  }


  // Reset all selections
  reset() {
    this.points = [];
    this.searchText = '';
    this.equipSearchText = '';
  }


  // Would be called only while editing a visualization
  setFormdata(selectedViz) {
    console.log(selectedViz);

    this.trendChartWidgetId = selectedViz.widgetId;
    this.widgetName = selectedViz.name;

    this.buildType = selectedViz.level;

    this.selectAllPoints = selectedViz.siteSelections.allPointsInd || false;
    let queryToUse;

    if (selectedViz.level === 'builder') {
      const equips = (selectedViz.siteSelections.equips) ? selectedViz.siteSelections.equips : [];
      this.allEquips = selectedViz.siteSelections.allEquipsInd || false;

      this.entitiesSelected = selectedViz.scope === 'ccu' ? selectedViz.siteSelections.devices : selectedViz.siteSelections.rooms;
      this.scope = selectedViz.scope;

      // Filter out chartOptions
      if (this.scope === 'ccu') {
        this.visibleChartOptions = this.chartOptions.filter(chartOption => chartOption.value !== CHART_OPTION_COMBINE_EQUIPS);
      }

      this.onEntitiesSelectionChanged(
        {selectedEntities: this.entitiesSelected, scope: selectedViz.scope, incomingSelection: true, queryGeneration: false});
      this.setChosenEquips(equips);

      this.selectedTags = selectedViz.tags;

      this.hayStackQuery = this.generateQuery();
      queryToUse = this.hayStackQuery;

    } else if (selectedViz.level === 'custom') {
      queryToUse = this.processCustomQuery(selectedViz.filter, this.data.type);
      this.hayStackQuery = selectedViz.filter;
    }

    this.points = selectedViz.siteSelections.points;

    // Also make the query to get all the available points
    this.getPoints(queryToUse, 'incoming');

    this.selectedOption = this.vizSelected.pointConsolidationRule;
    if (this.selectedOption === CHART_OPTION_ONE_CHART) {
      this.chartName = this.vizSelected.chartName;
    }

    this.chartYPosition = selectedViz.y;

  }


  /***************** Switching ********************/

  // Edit from Global visualization
  onVisualizationChanged(vizSelected: any) {
    this.vizSelected = this.visualizations.filter(viz => viz.widgetId === vizSelected.id)[0];
    this.setFormdata(this.vizSelected);
  }

  onVizNameChanged(newName) {
    this.widgetName = newName;
    this.hasChanges = true;
  }


  // Chart option changed
  onOptionChange(event) {
    this.selectedOption = event;
    this.hasChanges = true;

    this.chartName = null;
  }


  modeSwitched(value) {
    this.queryMode = value;
  }


  onTagChange(event) {
    this.selectedTags = event;
    this.hayStackQuery = this.generateQuery();

    this.onFilterDataByTags();
    this.hasChanges = true;
  }


  // OnSelectionsComplete(event) {
  //   console.log(event);
  //   const currentSelections = event.currentSelections;

  //   this.buildType = currentSelections.buildType;
  //   this.selectedTags = currentSelections.tags;
  //   this.entitiesSelected = currentSelections.entities;
  //   this.scope = currentSelections.scope;

  //   this.hayStackQuery = this.generateQuery();
  //   this.hasChanges = event.manualChangesMade;
  // }


  // Id the lvel is changed, then by default we set equips to blank
  onScopeChanged(event) {
    this.reset();
    this.selectedTags = [];
    this.equips = [];

    this.hasChanges = true;
    this.scope = event;

    // Filter out chartOptions
    if (event === 'ccu') {
      this.visibleChartOptions = this.chartOptions.filter(chartOption => chartOption.value !== CHART_OPTION_COMBINE_EQUIPS);
    } else {
      this.visibleChartOptions = this.chartOptions;
    }

    this.queryMode = false;
  }


  // Widget Type
  onWidgetTypeChanged(event) {
    this.buildType = event;

    this.reset();
    this.selectedTags = [];
    // this.equips = [];

    if (this.data.mode === 'create' && this.data.type !== 'global') {
      this.onEntitiesSelectionChanged(
        {selectedEntities: [this.data.entityRef], scope: this.scope, incomingSelection: false, queryGeneration: false});
    } else {
      this.equips = [];
    }

    this.hasChanges = true;

    if (this.buildType === 'custom') {
      this.hayStackQuery = null;
      this.visibleChartOptions = this.chartOptions;
    } else {
      this.queryMode = false;
      if (this.scope === 'ccu') {
        this.visibleChartOptions = this.chartOptions.filter(chartOption => chartOption.value !== CHART_OPTION_COMBINE_EQUIPS);
      } else {
        this.visibleChartOptions = this.chartOptions;
      }
    }
  }


  // Equips Filtering
  onEntitiesSelectionChanged(event) {
    this.dataEquips = (this.data && this.data.equips && Array.isArray(this.data.equips)) ? cloneDeep(this.data.equips) : [];

    let relevantEquips = [];
    this.entitiesSelected = event.selectedEntities;
    this.scope = event.scope;
    const incomingSelection = event.incomingSelection || false;
      // all manual changes made from the dropdown will not have this flag, but in case of edit, there will be this flag

    if (this.scope === 'ccu') { // System

      // First we translate the CCU Ids to the corresponding ahu, gateway and oao ids
      const checkIds = new Set();
      const ccus = (this.data && this.data.ccus && Array.isArray(this.data.ccus)) ? this.data.ccus : [];
      for (const ccu of ccus) {
        if (event.selectedEntities.includes(ccu._id)) {
          // Since they are the same for a CCU
          if (ccu.referenceIDs.ahu) {
            checkIds.add(ccu.referenceIDs.ahu);
          }

          if (ccu.referenceIDs.gateway) {
            checkIds.add(ccu.referenceIDs.gateway);
          }

          if (ccu.referenceIDs.oaoRef) {
            checkIds.add(ccu.referenceIDs.oaoRef);
          }

          if (ccu.referenceIDs.equip) {
            checkIds.add(ccu.referenceIDs.equip);
          }

          checkIds.add(ccu._id);
        }
      }

      relevantEquips = this.dataEquips.filter((_item) => {
        if (_item.type === 'equip' && _item.markers.includes('modbus') && !_item.referenceIDs.room) {
          return checkIds.has(_item.referenceIDs.gateway);
        } else if (_item.type === 'equip') {
          return checkIds.has(_item['_id']);
        } else if (_item.type === 'device' && _item.markers.includes('cm')) {
          return checkIds.has(_item.referenceIDs.equip);
        }
      });

      // relevantEquips = this.dataEquips.filter((_item) => {
      //   if ((_item['referenceIDs']['ahu'] && checkIds.has(_item['referenceIDs']['ahu']))
      //     || (_item['referenceIDs']['gateway'] && checkIds.has(_item['referenceIDs']['gateway']))
      //     || (_item['referenceIDs']['oao'] && checkIds.has(_item['referenceIDs']['oao']))
      //     || (_item['_id'] && checkIds.has(_item['_id']))) {
      //     return _item;
      //   }
      // });

      // this.equips = this.dataEquips.filter((_item) => {
      //   const equipCCUParentId = _item['referenceIDs']['ahu'] || _
      //     item['referenceIDs']['gateway'] || _item['referenceIDs']['oao'] || _item['_id'];

      //   const ahuRef = this.data.refs.ahuRef;
      //   if (
      //     (_item['referenceIDs']['ahu'] && ahuRef && (ahuRef == _item['referenceIDs']['ahu']))
      //     || (_item['_id'] && ahuRef && (ahuRef == _item['_id']))
      //     || (_item['referenceIDs']['gateway'] && ahuRef && (ahuRef == _item['referenceIDs']['gateway']))
      //     || (_item['referenceIDs']['oao'] && this.data.refs.oaoRef && (this.data.refs.oaoRef == _item['referenceIDs']['oao']))
      //   ) {
      //     return _item;
      //   }
      // });
    } else if (this.scope === 'zone') { // Zone
      relevantEquips = this.dataEquips.filter((_item) => {
        const equipReferenceRoomId = _item['referenceIDs']['room'];
        if (equipReferenceRoomId && event.selectedEntities.includes(equipReferenceRoomId)) {
          return _item;
        }
        // if (_item['referenceIDs']['room'] && this.data.refs.equipRef && (this.data.refs.equipRef == _item['_id'])) {
        //   return _item;
        // }
      });
    } else {
      relevantEquips = Array.from(this.dataEquips);
    }

    // If there was a manual change, then we would want to select all equips, else we do it in a later step based on the incoming equips
    if (!incomingSelection) {
      this.equips = this.markChecked(relevantEquips, true);
      this.equipsSelected = this.equips.length;

      if (event.hasOwnProperty('generateQuery') && event.generateQuery) {
        this.hayStackQuery = this.generateQuery();
      }
      this.hasChanges = true;
    } else {
      this.equips = relevantEquips;
      if (event.hasOwnProperty('generateQuery') && event.generateQuery) {
        this.hayStackQuery = this.generateQuery();
      }
    }


    if (relevantEquips.length === 0) {
      this.hasError = true;
      this.errMsg = TEXT.NO_EQUIPS_ERROR;
    } else {
      this.hasError = false;

      this.points = [];
      this.callMade = false;
    }

  }


  // Equips marking
  setChosenEquips(valueList) {
    this.equipsSelected = 0;
    for (const value of valueList) {
      this.equips = this.equips.map(equip => {
        if (equip['_id'] === value) {
          equip['checked'] = true;
          this.equipsSelected += 1;
        }
        return equip;
      });
    }
  }

  /*************** Utility Functions *******************/
  flattenByPropery(array, property) {
    return flatten(
      array.map((rec) => {
        if (property) {
          return Array.isArray(rec[property]) && rec[property].length > 0 ?
            [].concat([], this.flattenByPropery(rec[property], property)) : rec;
        }
      }
      )
    );
  }


  markChecked(arr, val) {
    if (!arr || (Array.isArray(arr) && !arr.length)) {
      return [];
    }
    return arr.filter((_filterItem) => _filterItem)
      .map((_item) => {
        _item['checked'] = val;
        return _item;
      });
  }



  /*********** Filtering  ************/
  filterEquips(tags) {
    this.equips = this.dataEquips.filter((_item) => {
      const found = (_item.markers && Array.isArray(_item.markers) && (
        _item.markers.some(r => tags.indexOf(r) >= 0))) ? true : false;
      if (found) {
        return _item;
      }
    });
  }


  // Not being Used
  filterPointsByEquips() {
    const promise = new Promise((resolve) => {
      const entities = this.flattenByPropery(this.equips, 'entities');
      if (this.data.mode === 'create') {
        this.points = entities.filter((_filterItem) => _filterItem)
          .map((_item) => {
            _item['checked'] = true;
            _item['chartType'] = 'lineChart';
            _item['colorCode'] = '#E95E6F';
            return _item;
          });
        // this.originalPoints = cloneDeep(this.points);
        resolve(true);
      } else {
        const selectedPoints = (this.formData && this.formData.points) ? this.formData.points : [];
        this.points = entities.filter((_filterItem) => _filterItem)
          .map((_item) => {
            const found = find(selectedPoints, ['pointRef', _item['_id']]);
            if (found) {
              _item['checked'] = true;
              _item['chartType'] = found['chartType'];
              _item['colorCode'] = found['colorCode'];
            } else {
              _item['chartType'] = 'lineChart';
              _item['colorCode'] = '#E95E6F';
            }
            return _item;
          });
        // this.originalPoints = cloneDeep(this.points);
        resolve(true);
      }
    });
    return promise;
  }


  onFilterDataByTags() {
    this.selectedPoints = 0;
    // if (!this.originalPoints || (Array.isArray(this.originalPoints) && !this.originalPoints.length)) {
    //   this.callMade = false;
    //   this.points = [];
    //   return;
    // }
    this.points = this.points.filter((_item) => {
      const hasTheseTags = this.selectedTags.length ? this.selectedTags.every(tag => _item.hasOwnProperty(tag)) : false;
      if (hasTheseTags) {
        if (_item.checked) {
          this.selectedPoints += 1;
        }
        return _item;
      }
    });
  }


  getPoints(query, eventType?) {
    this.fetchingPoints = true;
    this.selectedPoints = 0;

    this.hasError = false;
    this.callMade = false;

    this.subscriptions['querySerice'] = this.siteService.getHaystackDataByQuery(query).pipe(
      map(this.helperService.stripHaystackTypeMapping)
    )
      .subscribe(({ rows }) => {

        this.selectedPoints = 0;

        // The rows is all the points got and this.points is the current list - which also has the ones checked and unchecked.
        console.log(rows);
        console.log(this.points);

        const selectedPointsRefMap = {};
        this.points.forEach(
          point => selectedPointsRefMap[point.pointRef] = point
        );

        // Since the incoming points would have a whole level of customization,
        // check if the point exists in the selectedPointsRefMap, then replace it with the current selections
        let points = rows.map((_item) => {
          _item['name'] = _item['dis'];
          const pointId = _item['id'];
          if (selectedPointsRefMap[pointId]) {
            const exisitngPointDetails = selectedPointsRefMap[pointId];
            if (exisitngPointDetails['colorType'] == 'gradient') {
                this.selectedGradientGroup = exisitngPointDetails['colorCode'];
                _item['selectedColorSet'] = '#E95E6F';
            } else {
                _item['selectedColorSet'] = exisitngPointDetails['colorCode'];
            }
            _item['checked'] = true;
            _item['chartType'] = this.convertChartType(exisitngPointDetails['plotType']);
          } else {
            if (this.selectAllPoints) {
              _item['checked'] = true;
            } else if (this.points.length === 0) {
              _item['checked'] = true;
            }
            _item['chartType'] = 'lineChart';
            _item['selectedColorSet'] = '#E95E6F';
            _item['colorSets'] = baseColorOptions;
          }

          if (_item.checked) {
            this.selectedPoints += 1;
          }
          return _item;

        });

        // ascending order by point name
        points = points.sort((point1, point2) => {
          return point1?.name.localeCompare(point2?.name);
        })

        this.fetchingPoints = false;
        this.points = points;
        // this.originalPoints = cloneDeep(this.points);

        this.selectAllPoints = this.selectedPoints === this.points?.length;

        this.callMade = true;
      }, err => {
        this.hasError = true;
        this.errMsg = 'There was an error in executing the Query !';

        this.fetchingPoints = false;
      });
  }

  /****************** Query Generation  *******************/
  generateQueryForRefs(array, refObj) {
    let query = ``;
    if (!array || (Array.isArray(array) && !array.length)) {
      return query;
    }
    query += '(';

    const queries = [];
    array.forEach((_item, i) => {
      if (_item.equip) {
        queries.push( `${refObj.equip} == @${_item.equip}`);
        // query += `${refObj.equip} == @${_item.equip}`;
      } else if (_item.device && refObj.device) {
        queries.push( `${refObj.device} == @${_item.device}` );
        // query += `${refObj.device} == @${_item.device}`;
      }

      // if (array.length > 1) {
      //   query += `${(i === array.length - 1) ? '' : ' or '}`;
      // }
    });

    query += ` ${queries.join(' or ')} )`;
    return query;
  }


  generateSelectedIds(arr) {
    if (!arr || (Array.isArray(arr) && !arr.length)) {
      return [];
    }
    return arr.filter((_item) => _item['checked']).map((_mapItem) => {
      return {[_mapItem.type] : _mapItem['_id']};
    });
  }


  generateQuery() {
    let query = null;
    if (this.buildType === 'builder') {
      query = `siteRef==@${this.data.siteRef} and `;

      const queryTags = new Set();
      queryTags.add('point');
      queryTags.add('his');
      if (this.selectedTags && Array.isArray(this.selectedTags) && this.selectedTags.length) {
        this.selectedTags.forEach(tag => {
          queryTags.add(tag);
        });
      }

      query += `${[...queryTags].join(' and ')} and `;

      const selectedEquips: any[] = this.generateSelectedIds(this.equips);
      query += this.generateQueryForRefs(selectedEquips, {equip: 'equipRef', device: 'deviceRef'});

      this.showQueryOption = true;

      this.points = []; // Remove all points if a new query has been generated
      this.callMade = false;
    }

    return query;
  }


  /******************** Selects and Deselects *************************/

  colorSelectionChange(event) {
    console.log('event', event);
    for (const [key, value] of Object.entries(this.gradientSwatchSelections)) {
      if (value['stopColor0'] === event.stopColor0 && value['stopColor100'] === event.stopColor100) {
          this.selectedGradientGroup = key;
          this.hasChanges = true;
      }
    }
  }


  // Select all on Equips
  async onNodeGroupChange(event) {
    const checked = event.source.checked;
    this.equips = this.markChecked(this.equips, checked);
    this.equipsSelected = checked ? this.equips.length : 0;

    this.hayStackQuery = this.generateQuery();
    this.points = this.markChecked(this.points, checked);

    this.selectedPoints = checked ? this.points.length : 0;
    this.selectAllPoints = checked;

    // this.originalPoints = this.markChecked(this.originalPoints, checked);
    // this.onFilterDataByTags();
  }


  // The selectAll on Points
  onSelectAllChange(event) {
    const checked = event.source.checked;
    this.points = this.markChecked(this.points, checked);

    this.selectedPoints = checked ? this.points.length : 0;
    this.selectAllPoints = checked;

    this.hasChanges = true;
  }


  onSelectChart(event, point) {
    point['chartType'] = event;
    this.hasChanges = true;
  }


  onSelectColor(event, point) {
    point['selectedColorSet'] = event;
    this.hasChanges = true;
  }


  onTogglePoint(point) {
    point.checked = !point.checked;
    this.selectedPoints += point.checked ? 1 : -1;

    this.selectAllPoints = this.selectedPoints === this.points?.length;
    this.hasChanges = true;
  }


  mapPoints(arr, id, val) {
    if (!arr || (Array.isArray(arr) && !arr.length)) {
      return [];
    }
    return arr.filter((_filterItem) => _filterItem)
      .map((_item) => {
        const foundNode = (_item['equipRef'] === id) ? true : false;
        if (foundNode) {
          _item['checked'] = val;
          this.selectedPoints += val ? 1 : 0;
        }
        return _item;
      });
  }


  // Selecting - deselecting an Equip
  async onToggleNode(node, type='equip') {
    node.checked = !node.checked;
    this.equipsSelected += node.checked ? 1 : -1;

    this.points = this.mapPoints(this.points, node['_id'], node['checked']);
    // this.originalPoints = this.mapPoints(this.originalPoints, node['_id'], node['checked']);

    this.selectAllPoints = this.selectedPoints === this.points?.length;
    this.hayStackQuery = this.generateQuery();
  }


  onCustomHaystackQueryEdited(event) {
    this.points = []; // Remove all points if a new query has been generated
    this.callMade = false;
  }


  executeCustomQuery(query) {
    if (this.fetchingPoints) {
      return false;
    }

    if (query.includes('siteRef')) {
      this.hasError = true;
      this.errMsg = TEXT.SITE_REF_ERROR;

      this.fetchingPoints = false;
      return false;
    } else {
      this.hasError = false;
    }

    query = this.processCustomQuery(query, this.scope);
    this.getPoints(query, 'click');
    this.hasChanges = true;
  }


  processCustomQuery(query, scope) {
    let processedQuery;
    const siteRefPart = `siteRef==@${this.data.siteRef}`;

    if (! (query.includes('his'))) {
      processedQuery = `${siteRefPart} and ( ${query} ) and his `;
    } else {
      processedQuery = `${siteRefPart} and ${query} `;
    }

    // Add roomRef or equipRef is working with zone / equip
    if (this.data.type !== 'global') {
      if (! (query.includes('equipRef') || query.includes('deviceRef'))) {
        this.onEntitiesSelectionChanged(
          {selectedEntities: [this.data.entityRef], scope, incomingSelection: false, queryGeneration: false});
        processedQuery += ` and `;

        const selectedEquips: any[] = this.generateSelectedIds(this.equips);
        processedQuery += this.generateQueryForRefs(selectedEquips, {equip: 'equipRef', device: 'deviceRef'});
      }
    }

    return processedQuery;
  }


  retrievePoints() {
    if (this.fetchingPoints) {
      return false;
    }
    const query = this.generateQuery();
    this.getPoints(query, 'click');

    this.hasChanges = true;
  }

  /***************************** ACTIONS ******************************/
  onVizDelete() {
    this.deleteRequestInProgress = true;
    this.serverDeleteInProgress = false;
  }

  cancelDelete() {
    this.deleteRequestInProgress = false;
  }

  confirmDelete() {
    const vizName = this.vizSelected.name;
    const vizId = this.vizSelected.widgetId;
    this.serverDeleteInProgress = true;
    this.customHeatmapService.deleteWidget(vizId).subscribe(
      _ => {
        this.vizSelected = {};
        this.serverDeleteInProgress = false;
        this.deleteRequestInProgress = false;

        this.alertService.success(`${vizName} has been deleted successfully.`);

        this.vizSelectorOptions = this.vizSelectorOptions.filter(selectorOption => selectorOption.id !== vizId);
        console.log(this.vizSelectorOptions);
        this.heatmapConnect.setDashboardLevelChanges(
          {dashboardId: this.mappingDashboardId, ref: this.data.entityRef, type: this.data.type, widget: {widgetId: vizId}, op: 'delete'});
      }, _ => {
        this.serverDeleteInProgress = false;
        this.alertService.error(`${vizName} deletion failed. Please try again later.`);
      }
    )
  }


  onCloseDialog() {
    if (this.serverDeleteInProgress || this.deleteRequestInProgress) {
      return false;
    } else {
      this.visBuilderClosed.emit();
    }
  }


  saveVisualization(mode) {
    if (this.savingViz) {
      return false;
    }

    this.savingViz = true;

    if (this.selectedPoints === 0) {
      return;
    }

    const trendChartPayload = this.generateTrendChartPayload();
    console.log(trendChartPayload);

    if (this.mappingDashboardId !== '') {
      this.trendChartOnlySaveCall(trendChartPayload, this.mappingDashboardId, mode);
    } else {
      // First let's create a dashboard to house the widget
      const entityName = this.vizSelected.entityName
      this.customHeatmapService.createEntityDashboard(entityName, this.data.siteRef).subscribe(resp => {
        this.mappingDashboardId = resp.dashboardId;
        this.trendChartOnlySaveCall(trendChartPayload, this.mappingDashboardId, mode);
      })
    }
  }


  trendChartOnlySaveCall(trendChartPayload, dashboardId, mode) {
    trendChartPayload['dashboardId'] = dashboardId;
    if (this.trendChartWidgetId) {
      trendChartPayload['widgetId'] = this.trendChartWidgetId;
    }
    this.customHeatmapService.saveWidgetAfterTransformation(trendChartPayload).subscribe(resp => {
      console.log(resp);
      this.trendChartWidgetId = resp.widgetId;

      this.hasChanges = false;
      this.savingViz = false;

      if (this.globalEditMode) {
        // do not close the pop up
        const transformedWidget = this.customHeatmapService.transformToUIWidget(resp, true);
        console.log(transformedWidget);
        const index = this.visualizations.findIndex((viz) => viz.widgetId ===  transformedWidget.widgetId);
        if (index !== -1) {
          this.visualizations[index] = transformedWidget;
          this.alertService.success(`${transformedWidget.name} edited successfully.`);

          this.heatmapConnect.setDashboardLevelChanges(
            {dashboardId, ref: this.data.entityRef, type: this.data.type, widget: transformedWidget, op: 'edit'});
        }
      } else {
        // Need to tell the layout that changes have been made - which will tell the header to show the Draft management toolbar
        // this.dialogRef.close({entityDashboardId: dashboardId, widgetId: this.trendChartWidgetId, hasChanges: true, status:mode});
        const transformedWidget = this.customHeatmapService.transformToUIWidget(resp, this.data.type === 'global');
        console.log(transformedWidget);

        this.heatmapConnect.setDashboardLevelChanges(
          {dashboardId, ref: this.data.entityRef, type: this.data.type, widget: transformedWidget, op: mode});
        this.alertService.success(`${trendChartPayload.widgetName} saved successfully.`);
        this.onCloseDialog();
      }
    }, err => {
      if (err.status === 400 && err.error && err.error.error === TEXT.TREND_CHART_POINT_LIMIT_ERROR) {
        this.alertService.warning(TEXT.TREND_CHART_POINT_LIMIT_ERROR_MSG);
      } else {
        this.alertService.error(TEXT.GENERIC_ERROR);
      }
      this.savingViz = false;
    })
  }


  chartNameChange(event) {
    this.hasChanges = true;
  }


  getChartHeight(pointConsolidationRule, equipsSelected, selectedPoints) {
    let widgetHeight = 0;
    const headerHeight = 90;
    if (pointConsolidationRule === CHART_OPTION_ONE_CHART) {
      let heightToUse = 240;
      if (selectedPoints < 10) {
        if (selectedPoints === 1) {
          heightToUse = 60;
        } else if (selectedPoints < 5) {
          heightToUse = 90;
        } else {
          heightToUse = 160;
        }
      }
      widgetHeight = (headerHeight + 16 + heightToUse + 48); // Last 48 is for the top and bottom margin of the wrapper.
    } else if (pointConsolidationRule === CHART_OPTION_COMBINE_EQUIPS) {
      widgetHeight = headerHeight + 16 + ( equipsSelected * (this.minHeightToUseByEquip + 48 + 16 + 5 + 40));
    } else {
      widgetHeight = headerHeight + 16 + ( selectedPoints * (this.minHeightToUseSingle + 48 + 16 + 5 + 40));
    }

    return widgetHeight;
  }


  generateTrendChartPayload() {
    const widgetType = this.buildType === 'builder' ? 'builderTrendChart' : 'customTrendChart';
    const refreshValueSelected = this.getRefreshVals().filter(refreshVal => refreshVal.value === '5m')[0];

    const payload = {
      widgetType: widgetType || '',
      widgetName: this.widgetName || '',
      refreshCycleTime: refreshValueSelected.refreshCycleTime,
      refreshCycleUnit: refreshValueSelected.refreshCycleUnit,
      //  interpolationMethod: 'linear',

      width: 0,
      height: this.getChartHeight(this.selectedOption, this.equipsSelected, this.selectedPoints),
      horizontalStartPosition: 0,
      verticalStartPosition: this.chartYPosition,

      timeConstraint: this.vizSelected.timeConstraint,

      pointConsolidationRule: this.selectedOption,
      allSitesInd: false,
      chartName: this.chartName || '',
      sites: this.generateSitesPayloadForTrendChart(),
      //   aggregationFunction: 'last'
    };


    let startDate;
    let endDate;

    if (this.vizSelected.dateRange) {
      startDate = moment(this.vizSelected.dateRange['startDate']);
      endDate = moment(this.vizSelected.dateRange['endDate']);
    } else {
      // Default to yesterday and today
      startDate = moment().startOf('day');
      endDate = moment().endOf('day');
    }

    if (this.vizSelected.timeConstraint === 'specifiedRange') {
      payload['dateTimeFrom'] = startDate,
      payload['dateTimeThru'] = endDate;
    }

    if (widgetType == 'builderTrendChart') {
      payload['tags'] = this.selectedTags;
    } else {
      payload['filter'] = this.hayStackQuery;
    }

    const diff = endDate.diff(startDate, 'days');
    payload['groupByUnit'] = 'minute';
    if (diff < 2) {
      // payload['groupByUnit'] = 'minute';
      payload['groupByTime'] = 1;
    } else if (diff >= 2 && diff < 15) {
      // payload['groupByUnit'] = 'minute';
      payload['groupByTime'] = 5;
    } else if (diff >= 15 && diff < 60) {
      // payload['groupByUnit'] = 'minute';
      payload['groupByTime'] = 15;
    } else if (diff >= 60) {
      // payload['groupByUnit'] = 'hour';
      payload['groupByTime'] = 60;
    } else {
      // payload['groupByUnit'] = 'minute';
      payload['groupByTime'] = 1;
    }

    // payload['dashboardId'] = this.data.widgetSelections['dashboardId'];
    // if (widgetInfo['widgetId']) {
    //   payload['widgetId'] = widgetInfo['widgetId'];
    // } else {
    //   payload['dashboardId'] = widgetInfo['dashboardId'];
    // }
    return payload;
  }


  getRefreshVals() {
    const refreshVals = [{
        label: '5 min',
        value: '5m',
        refreshCycleTime: 5,
        refreshCycleUnit: 'minutes'
    },
    {
        label: '1 min',
        value: '1m',
        refreshCycleTime: 1,
        refreshCycleUnit: 'minutes'
    }];
    return refreshVals;
  }


  convertChartType(type) {
    switch (type) {
        case 'solidLine':
            return 'lineChart';
        case 'lineArea':
            return 'areaChart';
        case 'verticalBar':
            return 'barChartVert';
        case 'dashedLine':
            return 'dashed';
    }
  }

  generateSitesPayloadForTrendChart() {
    const sitesPayload = {
      siteRef: this.data.siteRef,
      allPointsInd: this.selectAllPoints,
      points: this.generatePointRefs(
        {points: cloneDeep(this.points), pointConsolidationRule: this.selectedOption, selectedGradientGroup: this.selectedGradientGroup})
    }

    if (this.buildType === 'builder') {
      if (this.scope === 'ccu') {
        sitesPayload['devices'] = this.entitiesSelected;
        sitesPayload['rooms'] = [];
      } else if (this.scope === 'zone') {
        sitesPayload['devices'] = [];
        sitesPayload['rooms'] = this.entitiesSelected;
      }

      sitesPayload['floors'] = [];
      sitesPayload['equips'] = this.equips.filter(equip => equip.checked).map(equip => equip._id);

      sitesPayload['allEquipsInd'] = this.allEquips;
    }

    return [sitesPayload];
  }


  generatePointRefs(data) {
    if (!data['points']) {
      return [];
    }
    return filter(data['points'], { checked: true }).map((_item) => {

      if (_item['chartType'] == 'lineChart') {
        _item['chartType'] = 'solidLine';
      } else if (_item['chartType'] == 'areaChart') {
        _item['chartType'] = 'lineArea';
      } else if (_item['chartType'] == 'dashed') {
        _item['chartType'] = 'dashedLine';
      } else {
        _item['chartType'] = 'verticalBar';
      }
      const obj = {
        pointRef: _item['id'].split(' ')[0],
        plotType: _item['chartType'],
        colorCode: (data['pointConsolidationRule'] == CHART_OPTION_ONE_CHART) ? _item['selectedColorSet']
          : data['selectedGradientGroup'],
        colorType: (data['pointConsolidationRule'] == CHART_OPTION_ONE_CHART) ? 'hex' : 'gradient'
      };
      if (_item.hasOwnProperty('enum')) {
        obj['aggregationFunction'] = 'last';
        obj['interpolationMethod'] = 'cov';
      } else if (!_item.hasOwnProperty('enum') && _item.hasOwnProperty('runtime')) {
        obj['aggregationFunction'] = 'total';
        obj['interpolationMethod'] = 'cov';
      } else if (_item.hasOwnProperty('diag')) {
        obj['aggregationFunction'] = 'last';
        obj['interpolationMethod'] = 'none';
      } else if (!_item.hasOwnProperty('enum') && !_item.hasOwnProperty('runtime')) {
        obj['aggregationFunction'] = 'avg';
        obj['interpolationMethod'] = 'cov';
      } else {
        obj['aggregationFunction'] = 'last';
        obj['interpolationMethod'] = 'cov';
      }
      return obj;
    });
  }


  ngOnDestroy() {
    Object.keys(this.subscriptions).forEach(e => {
      this.subscriptions[e].unsubscribe();
    });
  }

  trackByPoints(index: number, item: any) {
    return item.id;
  }


  @HostListener('click')
  documentClick(): void {
    this.clickService.setPickerClicked(null);
  }
}
