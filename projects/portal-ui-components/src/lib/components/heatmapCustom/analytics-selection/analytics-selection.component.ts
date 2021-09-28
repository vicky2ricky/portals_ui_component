import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { find, uniq } from 'lodash';

import { CustomHeatmapService } from '../../../services/custom-heatmap.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'puc-analytics-selection',
  templateUrl: './analytics-selection.component.html',
  styleUrls: ['./analytics-selection.component.scss']
})
export class AnalyticsSelectionComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() mode; // create, edit
  @Input() type; // global, ccu, zone

  @Input() selectedEntityId; // Show the options but keep disabled, if type is system or zone.
  selectedEntityName;

  @Input() ccus = [];
  @Input() zones = [];

  @Input() siteRef;
  @Input() incomingTaglist;


  // The widget that was selected
  @Input() selectedVisualizationParameters: any;
  visParamsLocal;

  // @Output() selectionsComplete: EventEmitter<any> = new EventEmitter();
  @Output() modeSwitched: EventEmitter<any> = new EventEmitter();

  @Output() tagChanged: EventEmitter<any> = new EventEmitter();
  @Output() widgetTypeChanged: EventEmitter<any> = new EventEmitter();
  @Output() scopeChanged: EventEmitter<any> = new EventEmitter();
  @Output() entitiesSelectionChangedEvt: EventEmitter<any> = new EventEmitter();

  @ViewChild('tagSelect') public tagSelect: NgSelectComponent;

  analyticsSelectionForm: FormGroup;

  manualChangesMade: boolean;

  selectedTags = [];
  scope;

  canSwitchBuild: boolean;
  canSwitchScope: boolean;
  showEntitySelector: boolean;

  buildType: string;
  showBuildChangeWarning: boolean;
  tempBuildType: any = {};

  showscopeChangeWarning: boolean;
  tempscope: any = {};

  selectedEntities = [];
  numResults = 0;

  tagList;

  unsubscribe$: Subject<boolean> = new Subject();

  buildOptions: Array<any> = [
    {
      label: 'Builder',
      value: 'builder'
    },
    {
      label: 'Custom',
      value: 'custom'
    }
  ];

  scopeOptions: Array<any> = [
    {
      label: 'System',
      value: 'ccu'
    },
    {
      label: 'Zone',
      value: 'zone'
    }
  ];

  constructor(private formBuilder: FormBuilder,
    private customHeatmapService: CustomHeatmapService) {

  }


  ngOnInit(): void {
    this.buildForm();
  }


  buildForm() {
    this.analyticsSelectionForm = this.formBuilder.group({
      buildType: 'builder',
      scope: '',
      entities: [],
      tags: []
    });
  }


  ngAfterViewInit() {
    this.initializeForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedVisualizationParameters && changes.selectedVisualizationParameters.currentValue) {
      this.initializeForm();
    }
  }


  initializeForm() {
    let canSwitchBuild = false; // Decided whether you can switch builder type
    let canSwitchScope = false; // Decided whether you can switch scope type

    let showEntitySelector = false; // Able to select entity or is preselected

    this.getTags(this.siteRef);

    // Global Create
    if (this.mode === 'create' && this.type === 'global') {
      this.analyticsSelectionForm?.patchValue({
        scope: 'ccu'
      });
      canSwitchBuild = true;
      canSwitchScope = true;
      showEntitySelector = true;

      this.scope = 'ccu';
      this.buildType = 'builder';
    }


    // System Or Zone Create
    if (this.mode === 'create' && this.type !== 'global') {
      this.analyticsSelectionForm?.patchValue({
        buildType: 'builder',
        scope: this.type,
        entities: [this.selectedEntityId],
        tags: []
      });
      canSwitchBuild = true;
      this.selectedEntityName = this.selectedVisualizationParameters.entityName;
      // this.getSelectedEntityName(this.selectedEntityId, this.type);
    }


    if (this.mode === 'edit') {
      this.visParamsLocal = JSON.parse(JSON.stringify(this.selectedVisualizationParameters || {}));

      if (this.type === 'global') { // Global Edit
        this.selectedTags = (this.visParamsLocal && this.visParamsLocal.tags
          && Array.isArray(this.visParamsLocal.tags)) ? this.visParamsLocal.tags : [];
        this.scope = this.visParamsLocal.scope;

        const selectedScope = this.visParamsLocal.siteSelections;
        let entities = [];
        if (this.scope === 'ccu') {
          entities = selectedScope.devices;
          this.selectEntities(selectedScope.devices, 'ccu', false);

        } else if (this.scope === 'zone') {
          entities = selectedScope.rooms;
          this.selectEntities(selectedScope.rooms, 'zone', false);
        }

        this.analyticsSelectionForm?.patchValue({
          buildType: this.visParamsLocal.level,
          scope: this.scope,
          entities,
          tags: this.selectedTags
        });

        canSwitchScope = true;
        showEntitySelector = true;

      } else { // System or Zone Edit
        this.selectedTags = (this.visParamsLocal && this.visParamsLocal.tags
          && Array.isArray(this.visParamsLocal.tags)) ? this.visParamsLocal.tags : [];
        // this.scope = this.type;

        this.analyticsSelectionForm?.patchValue({
          buildType: this.visParamsLocal.level,
          scope: this.type,
          entities: [this.selectedEntityId],
          tags: this.selectedTags
        });

        // this.getSelectedEntityName(this.selectedEntityId, this.type);
        this.selectedEntityName = this.selectedVisualizationParameters.entityName;
      }
    }

    this.canSwitchBuild = canSwitchBuild;
    this.canSwitchScope = canSwitchScope;
    this.showEntitySelector = showEntitySelector;

    // this.makeTheDataCall();
  }


  get f() { return this.analyticsSelectionForm?.controls; }

  // Reset all selections
  reset() {
    if (this.mode === 'create' && this.type !== 'global') {
      this.analyticsSelectionForm?.patchValue({
        tags: []
      });
    } else {
      this.analyticsSelectionForm?.patchValue({
        tags: [],
        scope: null,
        entities: []
      });
      this.scope = undefined;
    }
  }

  resetOnScopeChange() {
    this.analyticsSelectionForm?.patchValue({
      tags: [],
      entities: []
    });
  }

  onBuildChange(event, buildSwitch = false) {
    // If edit mode return false
    if (!this.canSwitchBuild) {
      return false;
    }

    if (this.buildType && this.buildType !== event.value && !buildSwitch) {
      this.showBuildChangeWarning = true;
      this.tempBuildType = find(this.buildOptions, ['value', event.value]);
      return;
    }

    this.showBuildChangeWarning = false;
    this.buildType = event.value;

    this.analyticsSelectionForm?.patchValue({
      buildType: event.value
    });

    this.widgetTypeChanged.emit(event.value);
    this.selectedTags = [];
    this.tagSelect.handleClearClick();
    this.reset();
  }


  onScopeChange(event, buildscope = false) {
    // If edit mode return false
    if (!this.canSwitchScope) {
      return false;
    }

    if (this.scope && this.scope !== event.value && !buildscope) {
      this.showscopeChangeWarning = true;
      this.tempscope = find(this.scopeOptions, ['value', event.value]);
      return;
    }

    this.showscopeChangeWarning = false;
    this.scope = event.value;

    this.analyticsSelectionForm?.patchValue({
      scope: event.value
    });

    this.scopeChanged.emit(this.scope);
    this.selectedTags = [];
    this.tagSelect.handleClearClick();
    this.resetOnScopeChange();
  }


  entitiesSelectionChanged(event, type) {
    this.selectEntities(event.value, type);
  }


  selectEntities(valueList, type, emitData = true) {
    this.selectedEntities = [];
    if (type === 'ccu') {
      for (const value of valueList) {
        this.ccus.map(ccu => {
          if (ccu._id === value) {
            this.selectedEntities.push({id: ccu._id, name: ccu.name});
          }
        });
      }
    } else if (type === 'zone') {
      for (const value of valueList) {
        this.zones.map(zone => {
          if (zone._id === value) {
            this.selectedEntities.push({id: zone._id, name: zone.name});
          }
        });
      }
    }

    if (emitData) {
      this.manualChangesMade = true;
      // this.entitiesSelectionChangedEvt.emit({level: this.scope, selectedEntities: this.analyticsSelectionForm.get('entities').value});
      this.entitiesSelectionChangedEvt.emit({scope: type, selectedEntities: valueList});
    }
  }


  // getSelectedEntityName(id, type) {
  //   this.selectedEntityName = '';
  //   if (type === 'ccu') {
  //     this.ccus.map(ccu => {
  //       if (ccu._id === id) {
  //         this.selectedEntityName = ccu.name;
  //       }
  //     });
  //   } else if (type === 'zone') {
  //       this.zones.map(zone => {
  //         if (zone.zoneId === id) {
  //           this.selectedEntityName = zone.main;
  //         }
  //     });
  //   }
  // }

  /***************** Tags Selection **********************/

  markFirst() {
    const cond = this.numResults === 0;
    return cond;
  }

  onTagSelect(item) {
    this.manualChangesMade = true;
    this.selectedTags.push(item);
    this.tagChanged.emit(this.selectedTags);
  }


  onTagDeSelect(item) {
    this.manualChangesMade = true;
    this.selectedTags = this.selectedTags.filter((_item) => _item !== item['value']);
    this.tagChanged.emit(this.selectedTags);

    if (this.selectedTags.length === 0) {
      this.modeSwitched.emit(false);
    }
  }


  onTagsClear() {
    this.manualChangesMade = true;
    this.selectedTags = [];
    this.modeSwitched.emit(false);
    this.tagChanged.emit(this.selectedTags);
  }


  searchTag(searchTerm: string, tag: any) {
    if (searchTerm.startsWith('!')) {
      if (tag.startsWith(searchTerm.slice(1))) {
        return true;
      }
      return false;
    } else {
      if (tag.startsWith(searchTerm)) {
        return true;
      }
      return false;
    }
  }

  getTags(siteRef) {
    if (this.incomingTaglist && this.incomingTaglist.length > 0) {
      this.tagList = this.incomingTaglist;
    } else {
      this.customHeatmapService.getSiteTags(siteRef)
        .pipe(
          takeUntil(this.unsubscribe$)
        )
        .subscribe(({ rows }) => {
            this.tagList = uniq(rows[0].tags);
        });
    }
  }

  /********************************************************/

  switchMode(event) {
    this.modeSwitched.emit(event.checked);
  }


  // makeTheDataCall(currentSelections?) {
  //   if (!currentSelections) {
  //       currentSelections = this.analyticsSelectionForm.value;
  //   }
  //   console.log('Analytics config Current Selections : ', currentSelections);
  //   this.selectionsComplete.emit({ currentSelections, manualChangesMade: this.manualChangesMade });
  // }
}
