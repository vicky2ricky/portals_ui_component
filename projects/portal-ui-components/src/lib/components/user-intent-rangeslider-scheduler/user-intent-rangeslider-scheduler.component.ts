import {
  Component, OnInit, AfterContentChecked, Input, ViewEncapsulation,
  ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter
} from '@angular/core';
import { PucSliderInputOutputData } from '../../models/user-intnet/puc-slider-input-output-data.model';
import { PucUserIntentTempSliderValueChangedIds } from '../../models/user-intnet/puc-user-intent-temp-slider-value-changed-ids.model';
import { PucUserLimitDataSources } from '../../models/user-intnet/puc-user-limit-data-sources.enum';
import { PucUserLimitTempButton } from '../../models/user-intnet/puc-user-limit-temp-button.model';
import { SliderUserIntentService } from '../../services/slider-user-intent.service';


@Component({
  selector: 'puc-user-intent-rangeslider-scheduler',
  templateUrl: './user-intent-rangeslider-scheduler.component.html',
  styleUrls: ['./user-intent-rangeslider-scheduler.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserIntentRangesliderSchedulerComponent implements OnInit, AfterContentChecked {

  /* tslint:disable-next-line */
  @Input('schedulerMin') schedulerMin: any;
  /* tslint:disable-next-line */
  @Input('schedulerMax') schedulerMax: any;
  /* tslint:disable-next-line */
  @Input('schedulerStep') schedulerStep: any;
  /* tslint:disable-next-line */
  @Input('schedulerZoneName') schedulerZoneName: any;
  /* tslint:disable-next-line */
  @Input('sliderDisplay') sliderDisplay: boolean;
  temperatureInputs: PucSliderInputOutputData;
  @ViewChild('schedulerslider', { static: true }) slidercontrol: ElementRef;

  @Output() schedulerDesiredTempsChanged = new EventEmitter<any>();

  slider: any;
  stepwidth: any;
  RangeContainer: any;
  MarksContainer: any;

  // Further steps inside slider steps(eg: 65.5 step between 65 and 66 steps)
  stepdenomination = 2;

  heatingdesiredtempvalue: number;
  coolingdesiredtempvalue: number;
  currenttempvalue: number;

  heatingmin: number;
  heatingmax: number;


  coolingmin: number;
  coolingmax: number;

  deadband: number;

  editmode = 0;
  editmodecomplete = 0;



  Buttons: PucUserLimitTempButton[];


  usertemperatureInputs: PucSliderInputOutputData = {
    currentTemp: '0.0',
    desiredTempHeating: '70',
    desiredTempCooling: '74',
    heatingUserLimitMin: '72',
    heatingUserLimitMax: '67',
    coolingUserLimitMin: '72',
    coolingUserLimitMax: '77',
    coolingDeadband: '2',
    heatingDeadband: '2',
  };


  constructor(private cd: ChangeDetectorRef, private sliderUserIntentService: SliderUserIntentService) {
    sessionStorage.setItem('schedulerEditmode', this.editmode.toString());
    sessionStorage.setItem('schedulerEditmodecomplete', this.editmodecomplete.toString());
  }



  ngOnInit() {
    setTimeout(() => {
    this.slider = this.slidercontrol.nativeElement.querySelector('.scheduler__slider__component');

    // Creating a slider line with steps
    this.RangeContainer = this.slidercontrol.nativeElement.querySelector('#schedulerRangePointContainer');
    this.MarksContainer = this.slidercontrol.nativeElement.querySelector('#schedulerMarkPointContainer');

    if (this.sliderDisplay) {
      const latestUserIntentBySlider = this.sliderUserIntentService.
        getData(PucUserLimitDataSources.SLIDER, this.schedulerZoneName + '_scheduler');
      if (latestUserIntentBySlider) {
        this.usertemperatureInputs = latestUserIntentBySlider;
      } else {
        const latestUpdatedByExternal = this.sliderUserIntentService.
          getData(PucUserLimitDataSources.EXTERNAL_DEVICE, this.schedulerZoneName + '_scheduler');
        if (latestUpdatedByExternal) {
          this.usertemperatureInputs = latestUpdatedByExternal;
        } else {
          this.usertemperatureInputs = this.sliderUserIntentService.
            getData(PucUserLimitDataSources.EXTERNAL_DEVICE, this.schedulerZoneName + '_scheduler_First_External');
        }

      }
    } else {
      this.usertemperatureInputs = {
        currentTemp: '0.0',
        desiredTempHeating: '70',
        desiredTempCooling: '74',
        heatingUserLimitMin: '72',
        heatingUserLimitMax: '67',
        coolingUserLimitMin: '72',
        coolingUserLimitMax: '77',
        coolingDeadband: '2',
        heatingDeadband: '2',
      };
    }


    this.setinitTempValues(this.usertemperatureInputs);

    if ((this.slider.clientWidth) && ((this.RangeContainer.childNodes.length <= 0) || (this.MarksContainer.childNodes.length <= 0))) {
      this.createSlider();
    }
    this.Initbuttonposition();
    }, 10);

  }

  ngAfterContentChecked() {

    const buttons = JSON.parse(sessionStorage.getItem('schedulerButtons'));
    if (this.usertemperatureInputs && buttons) {
      this.setdesiredtemps();
    }

    this.editmode = parseInt(sessionStorage.getItem('schedulerEditmode'), 10);

    // Update slider on receiving new values from database
    // This code should not fire while the slider is being used
    if (this.editmode === 0) {
      if (this.sliderDisplay) {
        const latestUserIntentBySlider = this.sliderUserIntentService.
          getData(PucUserLimitDataSources.SLIDER, this.schedulerZoneName + '_scheduler');
        if (latestUserIntentBySlider) {
          this.usertemperatureInputs = latestUserIntentBySlider;
        } else {
          const latestUpdatedByExternal = this.sliderUserIntentService.
            getData(PucUserLimitDataSources.EXTERNAL_DEVICE, this.schedulerZoneName + '_scheduler');
          if (latestUpdatedByExternal) {
            this.usertemperatureInputs = latestUpdatedByExternal;
          } else {
            this.usertemperatureInputs = this.sliderUserIntentService.
              getData(PucUserLimitDataSources.EXTERNAL_DEVICE, this.schedulerZoneName + '_scheduler_First_External');
          }

        }
      } else {
        this.usertemperatureInputs = {
          currentTemp: '0.0',
          desiredTempHeating: '70',
          desiredTempCooling: '74',
          heatingUserLimitMin: '72',
          heatingUserLimitMax: '67',
          coolingUserLimitMin: '72',
          coolingUserLimitMax: '77',
          coolingDeadband: '2',
          heatingDeadband: '2',
        };
      }

    if (this.usertemperatureInputs) {
      this.setinitTempValues(this.usertemperatureInputs);
      if (this.slider && (this.slider.clientWidth) &&
        ((this.RangeContainer.childNodes.length <= 0) || (this.MarksContainer.childNodes.length <= 0))) {
        this.createSlider();
      }
      this.Initbuttonposition();
    }
  }
}


  // Setting User-Intent Values
  setinitTempValues(temperatureInputs) {

    this.heatingdesiredtempvalue = parseFloat(temperatureInputs.desiredTempHeating);
    this.coolingdesiredtempvalue = parseFloat(temperatureInputs.desiredTempCooling);
    this.currenttempvalue = parseFloat(temperatureInputs.currentTemp);
    this.heatingmin = parseFloat(temperatureInputs.heatingUserLimitMax);
    this.heatingmax = parseFloat(temperatureInputs.heatingUserLimitMin);
    this.coolingmin = parseFloat(temperatureInputs.coolingUserLimitMin);
    this.coolingmax = parseFloat(temperatureInputs.coolingUserLimitMax);
    this.deadband = parseFloat(temperatureInputs.heatingDeadband) + parseFloat(temperatureInputs.coolingDeadband);
    sessionStorage.setItem('schedulerHeatingmin', this.heatingmin.toString());
    sessionStorage.setItem('schedulerHeatingmax', this.heatingmax.toString());
    sessionStorage.setItem('schedulerCoolingmin', this.coolingmin.toString());
    sessionStorage.setItem('schedulerCoolingmax', this.coolingmax.toString());
    sessionStorage.setItem('schedulerDeadband', this.deadband.toString());

    this.Buttons = [
      {
        id: 'schedulerHeatingdesiredtempbutton',
        value: this.heatingdesiredtempvalue
      },
      {
        id: 'schedulerCoolingdesiredtempbutton',
        value: this.coolingdesiredtempvalue
      }
    ];

    sessionStorage.setItem('schedulerButtons', JSON.stringify(this.Buttons));
  }

  removePreviousSliderComponent(element: any) {
    const list = element;
    let i = element.childNodes.length - 1;
    while (i >= 0) {
      element.removeChild(element.childNodes[i]);
      i--;
    }
  }

  // Creating the slider with markings
  createSlider() {

    if (!this.sliderDisplay) {
      this.schedulerMin = 55;
      this.schedulerMax = 90;
    }

    const span = this.schedulerMax - this.schedulerMin;

    if (!this.sliderDisplay) {
      this.slidercontrol.nativeElement.querySelector('.scheduler__slider__component').style.border = '1px solid #CCCCCC';
      this.slidercontrol.nativeElement.querySelector('.scheduler__slider__component').style.bordercolor = '#CCCCCC';
      this.slidercontrol.nativeElement.querySelector('.scheduler__slider__component').style.background = '#CCCCCC';
    }


    if (span > 35) {
      this.slider.style.marginLeft = 0 + '%';
      this.slider.style.width = 100 + '%';
    }

    let valueInterval = 2;
    let shiftAlign = 3;

    if ((span > 35) && (span <= 90)) {
      valueInterval = 3;
      shiftAlign = 5;
    } else if ((span > 90)) {
      valueInterval = 4;
      shiftAlign = 7;
    }

    this.stepwidth = ((this.slider.clientWidth) / span);

    const rangestep = span / (this.schedulerStep / this.stepdenomination);

    // Variables needed for sliding buttons on slider
    sessionStorage.setItem('schedulerStep', this.schedulerStep.toString());
    sessionStorage.setItem('schedulerMin', this.schedulerMin.toString());
    sessionStorage.setItem('schedulerStepdenomination', this.stepdenomination.toString());
    sessionStorage.setItem('schedulerStepwidth', this.stepwidth);






    this.MarksContainer.style.marginTop = 17 + 'px';

    let z = 0;

    const markheight = 1.5;

    while ((this.sliderDisplay) && (z <= rangestep)) {
      const markwidth = ((this.stepwidth) * ((this.schedulerStep / this.stepdenomination) * z));

      // Creating Marks on slider
      const mark = document.createElement('div');
      mark.classList.add('scheduler__slider__component__marks');

      if (z % (this.stepdenomination * 2) === 0) {
        mark.setAttribute('style', 'left:' + (markwidth - 5) + 'px;');
        mark.style.width = markheight + '%';

      } else if (z % 2 === 1) {
        mark.setAttribute('style', 'left:' + (markwidth - 2.5) + 'px;');
        mark.style.width = (markheight * (50 / 100)) + '%';

      } else {
        mark.setAttribute('style', 'left:' + (markwidth - 5) + 'px;');
        mark.style.width = (markheight * (74 / 100)) + '%';

      }

      this.RangeContainer.appendChild(mark);


      // Creating values below slider

      if (z % (this.stepdenomination * valueInterval) === 0) {
        const marklabel = document.createElement('div');
        marklabel.classList.add('scheduler__slider__component__markslabel');
        marklabel.setAttribute('style', 'left:' + (markwidth - shiftAlign) + 'px;');
        marklabel.innerText = ((this.schedulerStep / this.stepdenomination) * z + this.schedulerMin).toString();
        this.MarksContainer.appendChild(marklabel);
      }

      z++;
    }
    this.cd.detectChanges();
  }

  // Set initial button position
  Initbuttonposition() {
    const span = this.schedulerMax - this.schedulerMin;

    this.Buttons.forEach((button) => { // foreach statement
      const element = this.slidercontrol.nativeElement.querySelector('#' + button.id);
      const buttonposition = this.stepwidth * (button.value - this.schedulerMin);
      element.setAttribute('style', 'left:' + (buttonposition - 5) + 'px;');
      if (this.sliderDisplay) {
        if (button.id === 'schedulerHeatingdesiredtempbutton') {
          element.classList.remove('scheduler__slider__component__noDatadesiredtempbutton');
          if (span > 35) {
            element.classList.remove('scheduler__slider__component__heatingdesiredtempbutton');
            element.classList.add('scheduler__slider__component__heatingdesiredtempbuttonsmall');
          } else {
            element.classList.add('scheduler__slider__component__heatingdesiredtempbutton');
            element.classList.remove('scheduler__slider__component__heatingdesiredtempbuttonsmall');
          }
        } else if (button.id === 'schedulerCoolingdesiredtempbutton') {
          element.classList.remove('scheduler__slider__component__noDatadesiredtempbutton');
          if (span > 35) {
            element.classList.remove('scheduler__slider__component__coolingdesiredtempbutton');
            element.classList.add('scheduler__slider__component__coolingdesiredtempbuttonsmall');
          } else {
            element.classList.add('scheduler__slider__component__coolingdesiredtempbutton');
            element.classList.remove('scheduler__slider__component__coolingdesiredtempbuttonsmall');
          }
        }

      } else {
        if (button.id === 'schedulerHeatingdesiredtempbutton') {
          element.classList.remove('scheduler__slider__component__heatingdesiredtempbutton');
          element.classList.remove('scheduler__slider__component__heatingdesiredtempbuttonsmall');
          element.classList.add('scheduler__slider__component__noDatadesiredtempbutton');
        } else if (button.id === 'schedulerCoolingdesiredtempbutton') {
          element.classList.remove('scheduler__slider__component__coolingdesiredtempbutton');
          element.classList.remove('scheduler__slider__component__coolingdesiredtempbuttonsmall');
          element.classList.add('scheduler__slider__component__noDatadesiredtempbutton');
        }

      }
      if (button.value > this.schedulerMax || button.value < this.schedulerMin) {
        element.hidden = true;
      }
    }
    );

  }


  // Slide function
  MouseDown(event: any) {
    this.editmode = 1;
    sessionStorage.setItem('schedulerEditmode', this.editmode.toString());
    let editmode = this.editmode;

    event.preventDefault(); // prevent selection start (browser action)
    const button = document.getElementById(event.target.id) as HTMLElement;

    const markPointContainer = document.getElementById('schedulerMarkPointContainer') as HTMLElement;

    const slider = document.getElementsByClassName('scheduler__slider__component')[0] as HTMLElement;


    markPointContainer.style.marginTop = 30 + 'px';

    const shiftX = event.clientX - button.getBoundingClientRect().left;


    sessionStorage.setItem('schedulerValuesChanged', button.id.toString());

    if (button.id === 'schedulerHeatingdesiredtempbutton') {
      // Changing look of Button
      button.classList.remove('scheduler__slider__component__heatingdesiredtempbutton');
      button.classList.add('scheduler__slider__component__heatingbuttonlook');


      // Creating heating active range
      const heatrange = document.getElementById('schedulerHeatingRange') as HTMLElement;
      const heatingminpos = this.stepwidth * (this.heatingmin - this.schedulerMin);
      const heatingmaxpos = this.stepwidth * (this.heatingmax - this.schedulerMin);
      heatrange.style.left = heatingminpos + 'px';
      heatrange.style.width = (heatingmaxpos - heatingminpos) + 'px';
      heatrange.classList.add('scheduler__slider__component__heatingRangeclass');

    } else
      if (button.id === 'schedulerCoolingdesiredtempbutton') {

        // Changing look of Button
        button.classList.remove('scheduler__slider__component__coolingdesiredtempbutton');
        button.classList.add('scheduler__slider__component__coolingbuttonlook');

        // Creating cooling active range
        const coolrange = document.getElementById('schedulerCoolingRange') as HTMLElement;
        const coolingminpos = this.stepwidth * (this.coolingmin - this.schedulerMin);
        const coolingmaxpos = this.stepwidth * (this.coolingmax - this.schedulerMin);
        coolrange.style.left = coolingminpos + 'px';
        coolrange.style.width = (coolingmaxpos - coolingminpos) + 'px';
        coolrange.classList.add('scheduler__slider__component__coolingRangeclass');

      }

    // Adding required event listners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    // tslint:disable-next-line:no-shadowed-variable
    function onMouseMove(event) {
      const newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left;


      const stepwidth = parseFloat(sessionStorage.getItem('schedulerStepwidth'));
      const step = parseInt(sessionStorage.getItem('schedulerStep'), 10);
      const stepdenomination = parseInt(sessionStorage.getItem('schedulerStepdenomination'), 10);
      const min = parseInt(sessionStorage.getItem('schedulerMin'), 10);


      // Code for button jump to adjacent steps - start
      const buttonposition = newLeft / (stepwidth * (step / stepdenomination));
      const buttonposLowRange = Math.trunc(buttonposition);
      const buttoncenterpos = buttonposition - buttonposLowRange;
      const scrollstart = (step / stepdenomination) / 2;

      // Variable for capturing button's new position value
      let buttontext = 0;
      let buttonleftstyle = 0;

      if (buttoncenterpos >= 0 && buttoncenterpos < scrollstart) {
        buttontext = ((buttonposLowRange * (step / stepdenomination)) + min);

      } else if (buttoncenterpos > scrollstart && buttoncenterpos < step) {
        buttontext = (((buttonposLowRange + 1) * (step / stepdenomination)) + min);
      }

      // Code for button jump to adjacent steps - end


      // Restricting heating desired temp button and cooling desired temp button
      if (button.id === 'schedulerHeatingdesiredtempbutton') {
        const heatingmin = parseInt(sessionStorage.getItem('schedulerHeatingmin'), 10);
        const heatingmax = parseInt(sessionStorage.getItem('schedulerHeatingmax'), 10);
        if (buttontext < heatingmin) {
          buttontext = heatingmin;
        } else
          if (buttontext > heatingmax) {
            buttontext = heatingmax;
          }

      } else
        if (button.id === 'schedulerCoolingdesiredtempbutton') {
          const coolingmin = parseInt(sessionStorage.getItem('schedulerCoolingmin'), 10);
          const coolingmax = parseInt(sessionStorage.getItem('schedulerCoolingmax'), 10);
          if (buttontext < coolingmin) {
            buttontext = coolingmin;
          } else
            if (buttontext > coolingmax) {
              buttontext = coolingmax;
            }

        }

      buttonleftstyle = (buttontext - min) * stepwidth;
      button.style.left = buttonleftstyle + 'px';

      // Updating the new values of all three buttons
      const Buttons = JSON.parse(sessionStorage.getItem('schedulerButtons'));

      Buttons.find(x => x.id === button.id).value = buttontext;

      // Deadband check
      const deadband = parseInt(sessionStorage.getItem('schedulerDeadband'), 10);
      const heatingdesiredbutton = document.getElementById('schedulerHeatingdesiredtempbutton') as HTMLElement;
      const heatingdesiredvalue = Buttons.find(x => x.id === 'schedulerHeatingdesiredtempbutton').value;
      const coolingdesiredvalue = Buttons.find(x => x.id === 'schedulerCoolingdesiredtempbutton').value;
      const heatcooldifference = coolingdesiredvalue - heatingdesiredvalue;

      if (heatcooldifference < deadband) {
        sessionStorage.setItem('schedulerValuesChanged', PucUserIntentTempSliderValueChangedIds.Deadband);
        const deadbandrange = document.getElementById('schedulerDeadbandRange') as HTMLElement;


        if (button.id === 'schedulerHeatingdesiredtempbutton') {
          // Calculating cooling desired value wrt deadband
          const coolingdesiredbutton = document.getElementById('schedulerCoolingdesiredtempbutton') as HTMLElement;
          const coolingdesiredafterdeadband = heatingdesiredvalue + deadband;
          Buttons.find(x => x.id === 'schedulerCoolingdesiredtempbutton').value = coolingdesiredafterdeadband;

          // Display deadband on slider
          const deadbandminpos = stepwidth * (heatingdesiredvalue - min);
          const deadbandwidth = stepwidth * (deadband);
          deadbandrange.style.left = deadbandminpos + 'px';
          deadbandrange.style.width = deadbandwidth + 'px';
          deadbandrange.classList.add('scheduler__slider__component__deadbandRangeclass');

          // shift cooling desired button wrt deadband
          coolingdesiredbutton.style.left = ((coolingdesiredafterdeadband - min) * stepwidth) + 'px';
        } else {
          // Calculating heating desired value wrt deadband
          // tslint:disable-next-line:no-shadowed-variable
          const heatingdesiredbutton = document.getElementById('schedulerHeatingdesiredtempbutton') as HTMLElement;
          const heatingdesiredafterdeadband = coolingdesiredvalue - deadband;
          Buttons.find(x => x.id === 'schedulerHeatingdesiredtempbutton').value = heatingdesiredafterdeadband;

          // Display deadband on slider
          const deadbandminpos = stepwidth * ((coolingdesiredvalue - deadband) - min);
          const deadbandwidth = stepwidth * (deadband);
          deadbandrange.style.left = deadbandminpos + 'px';
          deadbandrange.style.width = deadbandwidth + 'px';
          deadbandrange.classList.add('scheduler__slider__component__deadbandRangeclass');

          // shift heating desired button wrt deadband
          heatingdesiredbutton.style.left = ((heatingdesiredafterdeadband - min) * stepwidth) + 'px';
        }
      }
      sessionStorage.setItem('schedulerButtons', JSON.stringify(Buttons));
    }

    function onMouseUp() {
      const IsSchedulerSlider = JSON.parse(sessionStorage.getItem('schedulerIsSchedulerSlider'));
      // returning the slider back to inactive state - start


      const deadbandRange = document.getElementsByClassName('scheduler__slider__component__deadbandRangeclass')[0] as HTMLElement;
      if (deadbandRange) {
        deadbandRange.classList.remove('scheduler__slider__component__deadbandRangeclass');
      }

      markPointContainer.style.marginTop = 17 + 'px';

      if (button.id === 'schedulerHeatingdesiredtempbutton') {
        button.classList.remove('scheduler__slider__component__heatingbuttonlook');
        button.classList.add('scheduler__slider__component__heatingdesiredtempbutton');

        const range = document.getElementById('schedulerHeatingRange') as HTMLElement;
        range.classList.remove('scheduler__slider__component__heatingRangeclass');

      } else
        if (button.id === 'schedulerCoolingdesiredtempbutton') {
          button.classList.remove('scheduler__slider__component__coolingbuttonlook');
          button.classList.add('scheduler__slider__component__coolingdesiredtempbutton');

          const range = document.getElementById('schedulerCoolingRange') as HTMLElement;
          range.classList.remove('scheduler__slider__component__coolingRangeclass');

        }
      // returning the slider back to inactive state - end

      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
      editmode = 0;
      sessionStorage.setItem('schedulerEditmode', editmode.toString());
      const editmodecomplete = 1;
      sessionStorage.setItem('schedulerEditmodecomplete', editmodecomplete.toString());
    }

  }

  // Update all desired temp values on change
  setdesiredtemps() {
    this.Buttons = JSON.parse(sessionStorage.getItem('schedulerButtons'));
    this.heatingdesiredtempvalue = this.Buttons.find(x => x.id === 'schedulerHeatingdesiredtempbutton').value;

    this.coolingdesiredtempvalue = this.Buttons.find(x => x.id === 'schedulerCoolingdesiredtempbutton').value;

    this.editmodecomplete = parseInt(sessionStorage.getItem('schedulerEditmodecomplete'), 10);
    this.usertemperatureInputs.desiredTempCooling = this.coolingdesiredtempvalue.toString();
    this.usertemperatureInputs.desiredTempHeating = this.heatingdesiredtempvalue.toString();

    if (this.editmodecomplete === 1) {
      this.sliderUserIntentService.setData(this.usertemperatureInputs,
        PucUserLimitDataSources.SLIDER, this.schedulerZoneName + '_scheduler');
      this.schedulerDesiredTempsChanged.emit(sessionStorage.getItem('schedulerValuesChanged'));
      this.editmodecomplete = 0;
      sessionStorage.setItem('schedulerEditmodecomplete', this.editmodecomplete.toString());

    }
    this.cd.detectChanges();
  }


}
