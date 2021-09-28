import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { PucUserIntentTempSliderValueChangedIds } from '../../models/user-intnet/puc-user-intent-temp-slider-value-changed-ids.model';
import { LoaderService } from '../../services/loader.service';
import { SiteService } from '../../services/site.service';
import { DateUtil } from '../../utils/date-util';

@Component({
  selector: 'puc-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() profileName: string;
  @Input() inputBuildingLimit: any;
  @Input() inputZoneName: any;
  @Input() currentRate: any;
  @Input() energyReading: any;
  @Input() sliderDisplayFlag: boolean;
  @Input() profileFormattedName = '';
  @Input() piLoopData;
  @Input() senseData;
  @Input() zoneSettings;
  @Input() siteTimeZone ='';
  @Output() desiredTempsChanged: any = new EventEmitter();

  displayProfile: string;
  buildingLimit: any;
  zoneName: any;
  profileShortName: any;
  checkForTemperature:any;

  inputValue;
  loopOutputValue;
  outputValue;
  offsetValue;
  profileWidget = ['slider', '../../../../assets/images/piloop.png', '../../../../assets/images/energymeter.png',''];

  subscriptions = {};

  inputLabel = '';
  outputLabel = '';
  offsetLabel = '';
  offsetUnit = '';
  inputValueUnit;
  loopOutputUnit;
  outputValueUnit;

  analog1Label = '';
  analog2Label ='';
  th1Label ='';
  th2Label ='';


  analog1Value:any;
  analog1Unit:any;

  th1Value:any;
  th1Unit:any;

  th2Value:any;
  th2Unit:any;

  analog2Value: any;
  analog2Unit:any;


  analog1UnitFetch;
  analog2UnitFetch;
  th1UnitFetch;
  th2UnitFetch;


  constructor(
    private siteService: SiteService,
    private loaderService: LoaderService) { }

    ngOnInit() {
      console.log("senseData",this.senseData)
      this.buildingLimit = this.inputBuildingLimit;
      this.zoneName = this.inputZoneName;
      this.currentRate = this.currentRate ? this.currentRate : 'NA';
      this.energyReading = this.energyReading ? this.energyReading : 'NA';
      this.profileShortName = this.profileName.split('-')[this.profileName.split('-').length - 2].toLocaleLowerCase();
      this.select();
      if (this.piLoopData) {
        this.inputValueUnit = this.piLoopData.inputUnit;
        this.outputValueUnit = this.piLoopData.outputUnit;
        this.inputLabel = this.piLoopData.input;
        this.loopOutputUnit = this.piLoopData.loopOutput
        this.outputLabel = this.piLoopData.target ? this.piLoopData.target : this.piLoopData.dynamicTarget;
      }
      if(this.senseData) {
        this.analog1Label = this.senseData.analog1;
        this.analog2Label = this.senseData.analog2;
        this.th1Label     = this.senseData.th1;
        this.th2Label     =  this.senseData.th2;
      }
    }

    ngOnChanges(changes: SimpleChanges) {
      const setting = changes.zoneSettings
      if(setting) {
        const profileShortName = this.profileName.split('-')[this.profileName.split('-').length - 2].toLocaleLowerCase();
        this.zoneSettings = setting.currentValue;
        if (RegExp(/^(pid)$/).test(profileShortName)) {
          if (this.zoneSettings && this.zoneSettings['inputValue'] &&
          (this.zoneSettings['dynamicValue'] || this.zoneSettings['targetValue'])) {
            this.piloop();
          }
        } else if(RegExp(/^(sense)$/).test(profileShortName)){
            this.hyperStatSense();
            this.checkForTemperature = true
        }
      }
    }

  desiredTempsChangedHandler(changedbuttonid: PucUserIntentTempSliderValueChangedIds) {
    this.desiredTempsChanged.emit(changedbuttonid);
  }

  select() {
    this.loaderService.active(false);
    if (RegExp(/^(dab|vav|cpu|2pfcu|4pfcu|hpu|sse|ti|dualduct|series|parallel|daikin vrv)$/).test(this.profileShortName)) {
      this.displayProfile = this.profileWidget[0];
    } else if (RegExp(/^(pid)$/).test(this.profileShortName)) {
      this.displayProfile = this.profileWidget[1];
    } else if (RegExp(/^(emr)$/).test(this.profileShortName)) {
      this.displayProfile = this.profileWidget[2];
    } else if(RegExp(/^(sense)$/).test(this.profileShortName)) {
      this.displayProfile = this.profileWidget[0];
    }

  }

  checksliderdisplaycondition() {
    if (typeof (this.sliderDisplayFlag) === 'undefined') {
      return false;
    } else {
      return true;
    }
  }
  
  hyperStatSense() {
      console.log("settings in sense fun", this.zoneSettings)
      console.log("settings in fgn fun", this.senseData)
      if (! this.zoneSettings) return;
      if ( this.zoneSettings['analog1'] &&  this.zoneSettings['analog1'].id) {
          this.analog1Value =  this.zoneSettings['analog1'].val;
          if (!this.analog1Unit && !this.analog1UnitFetch) {
              this.analog1UnitFetch = true;
          }
      }

      if ( this.zoneSettings['analog2'] &&  this.zoneSettings['analog2'].id) {
        this.analog2Value =  this.zoneSettings['analog2'].val;
        if (!this.analog1Unit && !this.analog2UnitFetch) {
            this.analog2UnitFetch = true;
        }
      }

      if ( this.zoneSettings['th1'] &&  this.zoneSettings['th1'].id) {
        this.th1Value =  this.zoneSettings['th1'].val;
        if (!this.th1Unit && !this.th1UnitFetch) {
            this.th1UnitFetch = true;
        }
      }


      if ( this.zoneSettings['th2'] &&  this.zoneSettings['th2'].id) {
        this.th2Value =  this.zoneSettings['th2'].val;
        if (!this.th2Unit && !this.th2UnitFetch) {
            this.th2UnitFetch = true;
        }
      }
  }

  piloop() {
    if (!this.zoneSettings) { return; }

    this.inputValue = this.zoneSettings['inputValue'] && this.zoneSettings['inputValue']['val'] ?
        (this.zoneSettings['inputValue'].val).split(' ')[0] : '';
    this.loopOutputValue =  this.zoneSettings['loopOutput'] && this.zoneSettings['loopOutput']['val']?
      (this.zoneSettings['loopOutput'].val).split(' ')[0] : '';
    if (this.zoneSettings['targetValue'] && this.zoneSettings['targetValue'].id) {
      this.outputValue = this.zoneSettings['targetValue'].val ? (this.zoneSettings['targetValue'].val).split(' ')[0] : '';
    }

    if (this.zoneSettings['dynamicValue'] && this.zoneSettings['dynamicValue'].id) {
      this.outputValue = this.zoneSettings['dynamicValue'] ? (this.zoneSettings['dynamicValue'].val).split(' ')[0] : '';

    }
    this.offsetValue = this.zoneSettings['offsetValue'] && this.zoneSettings['offsetValue']['val'] ? this.zoneSettings['offsetValue'].val : '';

  }

  isOnline() {
    if(!(this.zoneSettings['lastUpdated'] && this.zoneSettings['lastUpdated'].hasOwnProperty('val'))) return;
    this.zoneSettings['lastUpdated']['val'] = moment.utc(this.zoneSettings['lastUpdated']['time']).local();
    let timeDiffMinutes = Math.abs(this.zoneSettings['lastUpdated']['val'].diff(moment(), 'minutes'))
    return timeDiffMinutes < 16;
}

  dateFormat(val) {
    return DateUtil.dateFormat(val,this.siteService.getIANATimeZone(this.siteTimeZone));
  }

  ngOnDestroy() {
    Object.keys(this.subscriptions).forEach((key) => {
      this.subscriptions[key].unsubscribe();
    });
  }

}
