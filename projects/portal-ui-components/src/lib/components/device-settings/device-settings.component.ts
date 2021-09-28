import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChange,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import { HelperService } from '../../services/hs-helper.service';
import { ArrayUtil } from '../../utils/array-util';
import { SelectComponent } from '../select/select.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ObjectUtil } from '../../utils/object-util';
import { DateUtil } from '../../utils/date-util';
import { SiteService } from '../../services/site.service';

@Component({
  selector: 'puc-device-settings',
  templateUrl: './device-settings.component.html',
  styleUrls: ['./device-settings.component.scss']
})
export class DeviceSettingsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() settings: any;
  @Input() tags: any;
  @Output() modeChange: any = new EventEmitter();
  @Input() siteTimeZone;
  @Input()
  get cancelValues(): any[] {
    return this._cancelValues;
  }
  set cancelValues(val: any[]) {
    if (val.length) {
      this.revertValues(val);
    }
    this._cancelValues = val;

  }
  _cancelValues: any[];
  @ViewChildren('select') selectFields: QueryList<SelectComponent>;
  labelObj: any = {
    equipStatusMessage: {
      name: 'Status',
      type: 'html',
      unit: ''
    },
    damperPos: {
      name: 'Damper',
      type: 'text',
      unit: 'Open'
    },
    reheatPos: {
      name: 'Reheat Coil',
      type: 'text',
      unit: 'Open'
    },
    enteringAirTemp: {
      name: 'Supply Airflow',
      type: 'text',
      unit: '',
    },
    dischargeAirTemp: {
      name: 'Discharge Airflow',
      type: 'text',
      unit: '',
    },
    conditioningMode: {
      name: 'Conditioning Mode',
      type: 'select',
      options: 'conditioningMode',
      unit: '',
    },
    fanMode: {
      name: 'Fan Mode',
      type: 'select',
      options: 'fanMode',
      unit: '',
    },
    targetDehumidity: {
      name: 'Target Dehumidity',
      type: 'select',
      options: 'targetDehumidity',
      unit: '',
    },
    targetHumidity: {
      name: 'Target Humidity',
      type: 'select',
      options: 'targetHumidity',
      unit: '',
    },

    coolingSupplyAir: {
      name: 'Cooling Supply Airflow',
      type: 'text',
      unit: '',
    },
    heatingSupplyAir: {
      name: 'Heating Supply Airflow',
      type: 'text',
      unit: ''
    },
    coolingDamper: {
      name: 'Cooling Damper',
      type: 'text',
      unit: 'Open'
    },
    heatingDamper: {
      name: 'Heating Damper',
      type: 'text',
      unit: 'Open'
    },
    lastUpdated: {
       name:'Last Updated',
       type: 'datetime',
       unit:''
    },
    humidity :{
       name:'Humidity',
       type: 'text',
       unit:'RH'
    },
    airflowDirection: {
      name:'Airflow Direction',
       type: 'select',
       options: 'airflowDirection',
       unit:''
    },
    fanSpeed: {
      name:'Fan Speed',
      type: 'select',
      options: 'fanSpeed',
      unit:''
   },
    operationMode: {
      name:'Operation Mode',
      type: 'select',
      options: 'operationMode',
      unit:''
   }
  };

  cmOptions = [
    {
      name: 'Off',
      value: '0'
    },
    {
      name: 'Auto',
      value: '1'
    },
    {
      name: 'Heat Only',
      value: '2'
    },
    {
      name: 'Cool Only',
      value: '3'
    }
  ]

  fanModeOptions = [
    {
      name: 'Off',
      value: '0'
    },
    {
      name: 'Auto',
      value: '1'
    },
    {
      name: 'Fan Low Current Occupied Period',
      value: '2',
      group: 'fanLowSpeed'
    },
    {
      name: 'Fan Low Occupied Period',
      value: '3',
      group: 'fanLowSpeed'
    },
    {
      name: 'Fan Low All Times',
      value: '4',
      group: 'fanLowSpeed'
    },
    {
      name: 'Fan Medium Current Occupied Period',
      value: '5',
      group: 'fanMediumSpeed'
    },
    {
      name: 'Fan Medium Occupied Period',
      value: '6',
      group: 'fanMediumSpeed'
    },
    {
      name: 'Fan Medium All Times',
      value: '7',
      group: 'fanMediumSpeed'
    },
    {
      name: 'Fan High Current Occupied Period',
      value: '8',
      group: 'fanHighSpeed'
    },
    {
      name: 'Fan High Occupied Period',
      value: '9',
      group: 'fanHighSpeed'
    },
    {
      name: 'Fan High All Times',
      value: '10',
      group: 'fanHighSpeed'
    }
  ];

  options: any = {
    fanMode: {
      default: [
        {
          name: 'Off',
          value: '0'
        },
        {
          name: 'Auto',
          value: '1'
        },
        {
          name: 'Fan Low Current Occupied Period',
          value: '2'
        },
        {
          name: 'Fan Low Occupied Period',
          value: '3'
        },
        {
          name: 'Fan Low All Times',
          value: '4'
        },
        {
          name: 'Fan High Current Occupied Period',
          value: '5',
          group: 'fanHighSpeed'
        },
        {
          name: 'Fan High Occupied Period',
          value: '6',
          group: 'fanHighSpeed'
        },
        {
          name: 'Fan High All Times',
          value: '7',
          group: 'fanHighSpeed'
        }
      ]
    },
    conditioningMode: {
      default: [
        {
          name: 'Off',
          value: '0'
        },
        {
          name: 'Auto',
          value: '1'
        },
        {
          name: 'Heat Only',
          value: '2'
        },
        {
          name: 'Cool Only',
          value: '3'
        }
      ]
    },
    operationMode: {
      default: [
        {
          name: 'Off',
          value: '0'
        },
        {
          name: 'Fan (Ventilation)',
          value: '1'
        },
        {
          name: 'Heat Only Mode',
          value: '2',
          disabled: false
        },
        {
          name: 'Cool Only Mode',
          value: '3',
          disabled: false
        },
        {
          name: 'Auto',
          value: '4'
        },
      ]
    },
    fanSpeed: {
      default: [
        {
          name: 'Low',
          value: '0'
        },
        {
          name: 'Medium',
          value: '1'
        },
        {
          name: 'High',
          value: '2'
        },
        {
          name: 'Auto',
          value: '3',
          disabled: true
        }
      ]
    },
    airflowDirection: {
      default: [
        {
          name: 'Position0',
          value: '0'
        },
        {
          name: 'Position1',
          value: '1'
        },
        {
          name: 'Position2',
          value: '2'
        },
        {
          name: 'Position3',
          value: '3'
        },
        {
          name: 'Position4',
          value: '4'
        },
        {
          name: 'Swing',
          value: '5'
        },
        {
          name: 'Auto',
          value: '6',
          disabled: true
        }
      ],
      dropDownSelectDisabled: true
    }
  };
  supportedtags: any[] = [];
  isModbus = false;
  tempSettingHolder={};
  changeSubject = new Subject();
  constructor(
    private siteService: SiteService,
    private helperService: HelperService
  ) {
    this.changeSubject
      .pipe(debounceTime(500))
      .subscribe(() => {
          this.supportedtags = Object.keys(this.settings).sort();
          this.isModbus = true;
          this.tempSettingHolder =  ObjectUtil.deepClone(this.settings);
        }
      );
  }

  ngOnInit() {
    this.generateTargetDehumidityVals();
  }
  generateTargetDehumidityVals() {
    this.options['targetHumidity'] = {};
    this.options['targetDehumidity'] = {};

    this.options['targetHumidity']['default'] = this.options['targetDehumidity']['default'] = Array.from(Array(100), (e, i) => {
      const obj = { name: i + 1, value: (i + 1).toString() };
      return obj;
    });
  }

  isDataLoaded(data: any) {
    return this.helperService.isDataLoaded(data);
  }

  dateFormat(val) {
    return DateUtil.dateFormat(val,this.siteService.getIANATimeZone(this.siteTimeZone));
  }
  
  revertValues(data) {
    const self = this;
    Object.keys(self.settings).forEach((key) => {
      const found = ArrayUtil.findInArray(data, 'mode', key);
      if (new RegExp(/^(modbus)$/).test(this.tags.profileType)) {
        data[0].mode = data[0].mode.replace(/\s\s+/g, ' ');
        if (self.settings[key].data && self.settings[key].data.shortDis == data[0].mode) {
          const selectElement: any = self.selectFields.find((e: any) => e.nativeElement.id === key);
          if (selectElement) {
            selectElement.selectedOption = this.tempSettingHolder[key]['val'].toString();
            selectElement.nativeElement.value = this.tempSettingHolder[key]['val'].toString();
          }
        }

      } else if (found && this.selectFields && this.selectFields.length) {
        this.selectFields.forEach((_item) => {
          if (found['mode'] == _item.optionType) {
            _item.selectedOption = this.settings[key]['val'].toString();
          }
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const settings: SimpleChange = changes.settings;
    const tags: SimpleChange = changes.tags;
    if (settings) {
      this.settings = settings.currentValue;
      if (new RegExp(/^(modbus)$/).test(this.tags.profileType)) {
        this.changeSubject.next(true);
      }

      try{
        this.fanModeOptionsHandle();
        this.fanSpeedOptionsforVRV();
        this.airflowDirectionSupportCapability();
        this.operationModeSelectionOptions();
        this.conditioningModeOptonsHandle();
      } catch(e) {

      }


    }
    if (tags && tags.currentValue) {

      if (!new RegExp(/^(modbus)$/).test(this.tags.profileType)) {
        this.supportedtags = Object.keys(tags.currentValue.tags).reverse();
      }
    }
  }

  fanModeOptionsHandle () {
    if(this.tags.profileType && this.settings && this.settings['fanlowspeed'] && this.settings['fanhighspeed']
      && this.settings['fanmediumspeed'] && (this.tags.profileType == 'pipe2' || this.tags.profileType == 'pipe4')) {
        if(this.settings['fanlowspeed'] && !this.settings['fanlowspeed'].val) {
          this.options['fanMode']['default'] = Array.from([{
              name: 'Off',
              value: '0'
          }]);
        } else if(this.settings['fanhighspeed'] && this.settings['fanhighspeed'].val) {
          this.options['fanMode']['default'] = Array.from(this.fanModeOptions);
        } else {
          let fanModeOptions = ArrayUtil.clone(this.fanModeOptions);
          if(this.settings['fanhighspeed'] && !this.settings['fanhighspeed'].val) {
            fanModeOptions = fanModeOptions.filter((_item) => {
              if (_item && _item['group'] != 'fanHighSpeed') {
                return _item;
              }
            });
          }
          if(this.settings['fanmediumspeed'] && !this.settings['fanmediumspeed'].val) {
            fanModeOptions = fanModeOptions.filter((_item) => {
              if (_item && _item['group'] != 'fanMediumSpeed') {
                return _item;
              }
            });
          }
          this.options['fanMode']['default']  = ArrayUtil.clone(fanModeOptions);
        }

      } else if(this.tags.profileType && this.settings && this.settings['fanlowspeed'] &&
        (this.tags.profileType == 'cpu' || this.tags.profileType == 'hpu')) {
        // checking profile type is cpu & hpu and getting relay values
        if(!this.settings['fanlowspeed'].val) {
          this.options['fanMode']['default'] = Array.from([{
            name: 'Off',
            value: '0'
          }]);
        }
        else if (this.options['fanMode'] && this.settings['enablefan']
        && (!this.settings['enablefan'].val || ((this.tags.profileType == 'cpu' && this.settings['enablefan'].val && this.settings['relay6Type'] && this.settings['relay6Type'].val != 1) || (this.tags.profileType == 'hpu' && this.settings['enablefan'].val && this.settings['relay5Type'] && this.settings['relay5Type'].val != 1)))) {
          this.options['fanMode']['default'] = this.fanModeOptions.filter((_item) => {
            if (_item && _item['group'] != 'fanHighSpeed' && _item['group'] != 'fanMediumSpeed' ) {
              return _item;
            }
          });
        } else {
          this.options['fanMode']['default'] = Array.from(this.options['fanMode']['default']);
        }
      }
  }

  fanSpeedOptionsforVRV() {
    if(this.tags.profileType && this.settings && this.settings['fanSpeed'] && this.settings['fanSpeedAutoCapability']
      && this.settings['fanSpeedControlLevelCapability'] && (this.tags.profileType == 'vrv')) {
        if(this.settings['fanSpeedControlLevelCapability'] && this.settings['fanSpeedControlLevelCapability'].val == 1) {
          this.options['fanSpeed']['default']  = ArrayUtil.clone([{
            name: 'High',
            value: '2'
          }]);
        } else if(this.settings['fanSpeedControlLevelCapability'] && this.settings['fanSpeedControlLevelCapability'].val == 2) {
          this.options['fanSpeed']['default']  = ArrayUtil.clone([{
              name: 'Low',
              value: '0'
            },
            {
            name: 'High',
            value: '2'
          },
          {
            name: 'Auto',
            value: '3',
            disabled: true
          }]);
          if(this.settings['fanSpeedAutoCapability'] && this.settings['fanSpeedAutoCapability'].val == 0) {
            this.options['fanSpeed']['default']['2']['disabled'] = true;
          } else {
            this.options['fanSpeed']['default']['2']['disabled'] = false;
          }
        } else if(this.settings['fanSpeedControlLevelCapability'] && this.settings['fanSpeedControlLevelCapability'].val == 3) {
          this.options['fanSpeed']['default']  = ArrayUtil.clone([{
            name: 'Low',
            value: '0'
          },
          {
            name: 'Medium',
            value: '1'
          },
          {
          name: 'High',
          value: '2'
        },
        {
          name: 'Auto',
          value: '3',
          disabled: true
        }]);
        if(this.settings['fanSpeedAutoCapability'] && this.settings['fanSpeedAutoCapability'].val == 0) {
          this.options['fanSpeed']['default']['3']['disabled'] = true;
        } else {
          this.options['fanSpeed']['default']['3']['disabled'] = false;
        }
        } else {
          this.options['fanSpeed']['default'] = Array.from(this.options['fanSpeed']['default']);
          if(this.settings['fanSpeedAutoCapability'] && this.settings['fanSpeedAutoCapability'].val == 0) {
            this.options['fanSpeed']['default']['3']['disabled'] = true;
          } else {
            this.options['fanSpeed']['default']['3']['disabled'] = false;
          }
        }
      
  }
}

airflowDirectionSupportCapability() {
  if(this.tags.profileType && this.settings && this.settings['airflowDirection'] && this.settings['airflowDirectionAutoCapability']
      && this.settings['airflowDirectionSupportCapability'] && (this.tags.profileType == 'vrv')) {
        if(this.settings['airflowDirectionSupportCapability'] && this.settings['airflowDirectionSupportCapability'].val == 0) {
          this.options['airflowDirection']['dropDownSelectDisabled'] = true;
        } else {
          this.options['airflowDirection']['dropDownSelectDisabled'] = false;
            if(this.settings['airflowDirectionAutoCapability'] && this.settings['airflowDirectionAutoCapability'].val == 0) {
              this.options['airflowDirection']['default']['6']['disabled'] = true;
            } else {
              this.options['airflowDirection']['default']['6']['disabled'] = false;
            } 
        }
         
  }
}

operationModeSelectionOptions() {
  if(this.tags.profileType && this.settings && this.settings['operationMode'] && this.settings['masterControllerMode']
      && this.settings['masterOperationMode'] && (this.tags.profileType == 'vrv')) {
        if(this.settings['masterControllerMode'] && this.settings['masterControllerMode'].val == 1) {
          this.options['operationMode']['default'] = Array.from(this.options['operationMode']['default']);
        } else {
          if(this.settings['masterOperationMode'] && this.settings['masterOperationMode'].val == 1) {
            this.options['operationMode']['default']  = ArrayUtil.clone([{
              name: 'Off',
              value: '0',
            },
            {
              name: 'Fan (Ventilation)',
              value: '1'
            },
            {
              name: 'Heat Only Mode',
              value: '2',
              disabled: true
            },
            {
              name: 'Cool Only Mode',
              value: '3',
              disabled: true
            }]);
          } else if(this.settings['masterOperationMode'] && this.settings['masterOperationMode'].val == 2) {
            this.options['operationMode']['default']  = ArrayUtil.clone([{
              name: 'Off',
              value: '0',
            },
            {
              name: 'Fan (Ventilation)',
              value: '1'
            },
            {
              name: 'Heat Only Mode',
              value: '2',
              disabled: false
            },
            {
              name: 'Cool Only Mode',
              value: '3',
              disabled: true
            }]);
          } else if(this.settings['masterOperationMode'] && this.settings['masterOperationMode'].val == 3) {
            this.options['operationMode']['default']  = ArrayUtil.clone([{
              name: 'Off',
              value: '0',
            },
            {
              name: 'Fan (Ventilation)',
              value: '1'
            },
            {
              name: 'Heat Only Mode',
              value: '2',
              disabled: true
            },
            {
              name: 'Cool Only Mode',
              value: '3',
              disabled: false
            }]);
          } else {
            this.options['operationMode']['default']  = ArrayUtil.clone([{
              name: 'Off',
              value: '0',
            },
            {
              name: 'Fan (Ventilation)',
              value: '1'
            },
            {
              name: 'Heat Only Mode',
              value: '2',
              disabled: false
            },
            {
              name: 'Cool Only Mode',
              value: '3',
              disabled: false
            }]);
          }
        } 
  }
}

  conditioningModeOptonsHandle() {
    const cmModeOptions = ArrayUtil.clone(this.cmOptions);
     if(this.tags.profileType == 'pipe4') {
      if(this.settings && this.settings['watervalueheating'] && !this.settings['watervalueheating'].val
      && this.settings['watervaluecooling'] && !this.settings['watervaluecooling'].val) {
        this.options['conditioningMode']['default']  =  [cmModeOptions[0]];
      } else if(this.settings && this.settings['watervalueheating'] && this.settings['watervalueheating'].val
       && this.settings['watervaluecooling'] && this.settings['watervaluecooling'].val) {
        this.options['conditioningMode']['default']  = ArrayUtil.clone(cmModeOptions);
      } else if(this.settings && this.settings['watervalueheating'] && this.settings['watervalueheating'].val) {
        this.options['conditioningMode']['default']  = ArrayUtil.clone([{
          name: 'Off',
          value: '0'
        },
        {
          name: 'Heat Only',
          value: '2'
        }]);
      } else if(this.settings && this.settings['watervaluecooling'] && this.settings['watervaluecooling'].val) {
        this.options['conditioningMode']['default']  = ArrayUtil.clone([{
          name: 'Off',
          value: '0'
        },
        {
          name: 'Cool Only',
          value: '3'
        }]);
      }
    } else if(this.tags.profileType == 'hpu') {
      if(this.settings && this.settings['compressorstage1'] && this.settings['compressorstage1'].val
      || this.settings['compressorstage2'] && this.settings['compressorstage2'].val) {
        this.options['conditioningMode']['default']  = ArrayUtil.clone(cmModeOptions);
      } else {
        this.options['conditioningMode']['default']  =  [cmModeOptions[0]];
      }
    } else if (this.tags.profileType == 'cpu') {
      if(this.settings && this.settings['coolingstage1'] && !this.settings['coolingstage1'].val
        && this.settings['coolingstage2'] && !this.settings['coolingstage2'].val &&
        this.settings['heatingstage1'] && !this.settings['heatingstage1'].val
        && this.settings['heatingstage2'] && !this.settings['heatingstage2'].val) {
        this.options['conditioningMode']['default']  = [cmModeOptions[0]];
      } else if(this.settings && ((this.settings['coolingstage1'] && this.settings['coolingstage1'].val) ||
        (this.settings['coolingstage2'] && this.settings['coolingstage2'].val)) &&
        ((this.settings['heatingstage1'] && this.settings['heatingstage1'].val) ||
        (this.settings['heatingstage2'] && this.settings['heatingstage2'].val))) {
        this.options['conditioningMode']['default']  =  ArrayUtil.clone(cmModeOptions);
      } else if(this.settings && (this.settings['coolingstage1'] && this.settings['coolingstage1'].val) ||
        (this.settings['coolingstage2'] && this.settings['coolingstage2'].val)) {
        this.options['conditioningMode']['default']  = ArrayUtil.clone([{
          name: 'Off',
          value: '0'
        },
        {
          name: 'Cool Only',
          value: '3'
        }]);
      } else if(this.settings && (this.settings['heatingstage1'] && this.settings['heatingstage1'].val) ||
        (this.settings['heatingstage2'] && this.settings['heatingstage2'].val)) {
        this.options['conditioningMode']['default']  = ArrayUtil.clone([{
          name: 'Off',
          value: '0'
        },
        {
          name: 'Heat Only',
          value: '2'
        }]);
      }
    }
  }

  onModeChange(selectObj) {
    const modeObj = {
      mode: selectObj.type || '',
      value: (selectObj.value || selectObj.value == 0) ? selectObj.value : ''
    };

    this.modeChange.emit(modeObj);
  }

  onChange(devicetype, deviceValue, tagName) {
    const modeObj = [];
    const val = this.getEnumValue(devicetype,deviceValue);
    modeObj.push({
      mode: devicetype,
      value: (val||val==0)?val:deviceValue,
      type: tagName.shortDis,
      priorityArray: this.settings[devicetype].priorityArray || { id: this.settings[devicetype].id }
    });
    this.helperService.handleInputChange(modeObj);
  }

  getEnumName(tag) {
    if(this.settings[tag]['data']['enum']) {
      const displayVal = this.settings[tag]['data']['enum'].find(option=>{
        return Number(option.value).toFixed(1) == this.settings[tag].val || option.value == this.settings[tag].val
      });

      if(displayVal) return displayVal.name;

      return '';
    }
  }

  getEnumValue(tag,selectedValue) {
    if(this.settings[tag]['data']['enum']) {
      const displayVal = this.settings[tag]['data']['enum'].find(option=>{
        return Number(option.value).toFixed(1) == selectedValue || option.value == selectedValue || option.value*1 == selectedValue*1;
      });

      if(displayVal) return displayVal.value;

      return '';
    }
  }

  ngOnDestroy() {
    this.changeSubject.unsubscribe();
  }
}
