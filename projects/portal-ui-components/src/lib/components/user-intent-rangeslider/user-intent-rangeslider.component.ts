import {
    Component,
    OnInit,
    AfterContentChecked,
    Input,
    ViewEncapsulation,
    ChangeDetectorRef,
    ViewChild,
    ElementRef,
    Output,
    EventEmitter,
    OnDestroy
} from '@angular/core';
import { SliderUserIntentService } from '../../services/slider-user-intent.service';
import { ResizeSensor } from 'css-element-queries';
import { PucSliderInputOutputData } from '../../models/user-intnet/puc-slider-input-output-data.model';
import { PucUserLimitTempButton } from '../../models/user-intnet/puc-user-limit-temp-button.model';
import { PucUserLimitDataSources } from '../../models/user-intnet/puc-user-limit-data-sources.enum';
import { PucUserIntentTempSliderValueChangedIds } from '../../models/user-intnet/puc-user-intent-temp-slider-value-changed-ids.model';

@Component({
    // tslint:disable-next-line
    selector: 'puc-user-intent-rangeslider',
    templateUrl: './user-intent-rangeslider.component.html',
    styleUrls: ['./user-intent-rangeslider.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserIntentRangesliderComponent implements OnInit, OnDestroy, AfterContentChecked {
    @Input ('checkForTemperature')checkForTemperature : any;
    // tslint:disable-next-line
    @Input('min') slidermin: number;
    // tslint:disable-next-line
    @Input('max') slidermax: number;
    // tslint:disable-next-line
    @Input('step') sliderstep: number;
    // tslint:disable-next-line
    @Input('zoneName') zoneName: string;
    // tslint:disable-next-line
    @Input('sliderDisplay') sliderDisplay: boolean;
    temperatureInputs: PucSliderInputOutputData;
    @ViewChild('slider', { static: true }) slidercontrol: ElementRef;

    @Output() desiredTempsChanged = new EventEmitter<any>();

    slider: any;
    stepwidth: any;
    RangeContainer: any;
    MarksContainer: any;

    resizeSensor: any;

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
        currentTemp: undefined,
        desiredTempHeating: undefined,
        desiredTempCooling: undefined,
        heatingUserLimitMin: undefined,
        heatingUserLimitMax: undefined,
        coolingUserLimitMin: undefined,
        coolingUserLimitMax: undefined,
        coolingDeadband: undefined,
        heatingDeadband: undefined,
    };

    subscription: any;

    constructor(private cd: ChangeDetectorRef, private sliderUserIntentService: SliderUserIntentService,
    ) {
        sessionStorage.setItem('editmode', this.editmode.toString());
        sessionStorage.setItem('editmodecomplete', this.editmodecomplete.toString());
    }



    ngOnInit() {

        if (this.sliderDisplay) {
            let datalastupdatedby;
            datalastupdatedby = this.sliderUserIntentService.getLatestUpdatedBy(this.zoneName);
            const latestUserIntent = this.sliderUserIntentService.getData(datalastupdatedby, this.zoneName);
            if (this.usertemperatureInputs) {
                if (!this.sliderUserIntentService.isEquivalent(this.usertemperatureInputs, latestUserIntent)) {
                    this.sliderUserIntentService.setData(latestUserIntent, PucUserLimitDataSources.EXTERNAL_DEVICE, this.zoneName);
                    this.usertemperatureInputs = latestUserIntent;
                }
            } else {
                this.usertemperatureInputs = latestUserIntent;
            }
        } else {
            this.usertemperatureInputs = {
                currentTemp: '0',
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


        // Creating a slider line with steps
        this.RangeContainer = this.slidercontrol.nativeElement.querySelector('#rangePointContainer');
        this.MarksContainer = this.slidercontrol.nativeElement.querySelector('#markPointContainer');

        this.setinitTempValues(this.usertemperatureInputs);


        this.slider = this.slidercontrol.nativeElement.querySelector('.slider__component');
        if ((this.slider.clientWidth) && ((this.RangeContainer.childNodes.length <= 0) ||
            (this.MarksContainer.childNodes.length <= 0))) {
            this.createSlider();
        }
        this.Initbuttonposition();

        // redraw slider on resize
        this.resizeSensor = new ResizeSensor(this.slidercontrol.nativeElement, () => {
            this.debounced(100, this.refreshSliderOnResolutionChange());
        });
    }

    debounced(delay, fn) {
        let timerId;
        // tslint:disable-next-line
        return function (...args) {
            if (timerId) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(() => {
                fn(...args);
                timerId = null;
            }, delay);
        };
    }

    refreshSliderOnResolutionChange() {
        if (this.RangeContainer.childNodes.length > 0) { this.removePreviousSliderComponent(this.RangeContainer); }
        if (this.MarksContainer.childNodes.length > 0) { this.removePreviousSliderComponent(this.MarksContainer); }
        if ((this.slider.clientWidth) && ((this.RangeContainer.childNodes.length <= 0) || (this.MarksContainer.childNodes.length <= 0))) {
            this.createSlider();
        }

    }

    ngAfterContentChecked() {


        if (this.usertemperatureInputs) {
            this.setdesiredtemps();
        }

        this.editmode = parseInt(sessionStorage.getItem('editmode'), 10);

        // Update slider on receiving new values from database
        // This code should not fire while the slider is being used
        if (this.editmode === 0) {
            if (this.sliderDisplay) {
                let datalastupdatedby;
                datalastupdatedby = this.sliderUserIntentService.getLatestUpdatedBy(this.zoneName);
                const latestUserIntent = this.sliderUserIntentService.getData(datalastupdatedby, this.zoneName);
                if (this.usertemperatureInputs) {
                    if (!this.sliderUserIntentService.isEquivalent(this.usertemperatureInputs, latestUserIntent)) {
                        this.sliderUserIntentService.setData(latestUserIntent, datalastupdatedby, this.zoneName);
                        this.usertemperatureInputs = latestUserIntent;
                    }
                } else {
                    this.usertemperatureInputs = latestUserIntent;
                }
            } else {
                this.usertemperatureInputs = {
                    currentTemp: '0',
                    desiredTempHeating: '70',
                    desiredTempCooling: '74',
                    heatingUserLimitMin: '72',
                    heatingUserLimitMax: '67',
                    coolingUserLimitMin: '72',
                    coolingUserLimitMax: '77',
                    coolingDeadband: '2',
                    heatingDeadband: '2',
                };
                // this.sliderUserIntentService.setData( this.usertemperatureInputs,
                // PucUserLimitDataSources.EXTERNAL_DEVICE, this.zoneName, false);
            }



            if (this.usertemperatureInputs) {
                this.setinitTempValues(this.usertemperatureInputs);
                if ((this.slider.clientWidth) && ((this.RangeContainer.childNodes.length <= 0) ||
                    (this.MarksContainer.childNodes.length <= 0))) {
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
        sessionStorage.setItem('heatingmin', this.heatingmin.toString());
        sessionStorage.setItem('heatingmax', this.heatingmax.toString());
        sessionStorage.setItem('coolingmin', this.coolingmin.toString());
        sessionStorage.setItem('coolingmax', this.coolingmax.toString());
        sessionStorage.setItem('deadband', this.deadband.toString());

        this.Buttons = [
            {
                id: 'heatingdesiredtempbutton',
                value: this.heatingdesiredtempvalue
            },
            {
                id: 'currenttempbutton',
                value: this.currenttempvalue
            },
            {
                id: 'coolingdesiredtempbutton',
                value: this.coolingdesiredtempvalue
            }
        ];



        sessionStorage.setItem('Buttons', JSON.stringify(this.Buttons));
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
            this.slidermin = 55;
            this.slidermax = 90;
        }

        const span = this.slidermax - this.slidermin;

        if (!this.sliderDisplay) {
            this.slidercontrol.nativeElement.querySelector('.slider__component').style.border = '1px solid #CCCCCC';
            this.slidercontrol.nativeElement.querySelector('.slider__component').style.bordercolor = '#CCCCCC';
            this.slidercontrol.nativeElement.querySelector('.slider__component').style.background = '#CCCCCC';
        }

        if (span > 35) {
            this.slidercontrol.nativeElement.querySelector('.slider__labels').marginLeft = 36 + '%';
            this.slider.style.marginLeft = 0 + '%';
            this.slider.style.width = 100 + '%';
        }


        let valueInterval = 2;
        let shiftAlign = 5;

        if ((span > 35) && (span <= 90)) {
            valueInterval = 3;
            shiftAlign = 7;
        } else if ((span > 90)) {
            valueInterval = 4;
            shiftAlign = 8;
        }

        this.stepwidth = ((this.slider.clientWidth) / span);

        const rangestep = span / (this.sliderstep / this.stepdenomination);


        // Variables needed for sliding buttons on slider
        // tslint:disable-next-line
        this.sliderstep ? sessionStorage.setItem('step', this.sliderstep.toString()) : '';
        // tslint:disable-next-line
        this.slidermin ? sessionStorage.setItem('min', this.slidermin.toString()) : '';
        // tslint:disable-next-line
        this.stepdenomination ? sessionStorage.setItem('stepdenomination', this.stepdenomination.toString()) : '';
        // tslint:disable-next-line
        this.stepwidth ? sessionStorage.setItem('stepwidth', this.stepwidth) : '';





        this.MarksContainer.style.marginTop = 17 + 'px';

        let z = 0;

        const markheight = 1.5;

        while ((this.sliderDisplay) && (z <= rangestep)) {
            const markwidth = ((this.stepwidth) * ((this.sliderstep / this.stepdenomination) * z));

            // Creating Marks on slider
            const mark = document.createElement('div');
            mark.classList.add('slider__component__marks');

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
                marklabel.classList.add('slider__component__markslabel');
                marklabel.setAttribute('style', 'left:' + (markwidth - shiftAlign) + 'px;');
                marklabel.innerText = ((this.sliderstep / this.stepdenomination) * z + this.slidermin).toString();
                this.MarksContainer.appendChild(marklabel);
            }

            z++;
        }
        this.cd.detectChanges();
    }

    // Set initial button position
    Initbuttonposition() {
        const span = this.slidermax - this.slidermin;


        this.Buttons.forEach((button) => { // foreach statement
            const element = this.slidercontrol.nativeElement.querySelector('#' + button.id);
            const buttonposition = (this.stepwidth * (button.value - this.slidermin));
            element.setAttribute('style', 'left:' + (buttonposition - 5) + 'px;');

            if (this.sliderDisplay) {
                if (button.id === 'heatingdesiredtempbutton') {
                    element.classList.remove('slider__component__noDatadesiredtempbutton');
                    if (span > 35) {
                        element.classList.remove('slider__component__heatingdesiredtempbutton');
                        element.classList.add('slider__component__heatingdesiredtempbuttonsmall');
                    } else {
                        element.classList.add('slider__component__heatingdesiredtempbutton');
                        element.classList.remove('slider__component__heatingdesiredtempbuttonsmall');
                    }
                } else if (button.id === 'coolingdesiredtempbutton') {
                    element.classList.remove('slider__component__noDatadesiredtempbutton');
                    if (span > 35) {
                        element.classList.remove('slider__component__coolingdesiredtempbutton');
                        element.classList.add('slider__component__coolingdesiredtempbuttonsmall');
                    } else {
                        element.classList.add('slider__component__coolingdesiredtempbutton');
                        element.classList.remove('slider__component__coolingdesiredtempbuttonsmall');
                    }
                } else if (button.id === 'currenttempbutton') {
                    if (span > 35) {
                        element.classList.remove('slider__component__currenttempbutton');
                        element.classList.add('slider__component__currenttempbuttonsmall');
                    } else {
                        element.classList.add('slider__component__currenttempbutton');
                        element.classList.remove('slider__component__currenttempbuttonsmall');
                    }
                }

            } else {
                if (button.id === 'heatingdesiredtempbutton') {
                    element.classList.remove('slider__component__heatingdesiredtempbutton');
                    element.classList.remove('slider__component__heatingdesiredtempbuttonsmall');
                    element.classList.add('slider__component__noDatadesiredtempbutton');
                } else if (button.id === 'coolingdesiredtempbutton') {
                    element.classList.remove('slider__component__coolingdesiredtempbutton');
                    element.classList.remove('slider__component__coolingdesiredtempbuttonsmall');
                    element.classList.add('slider__component__noDatadesiredtempbutton');
                }

            }

            if (button.value > this.slidermax || button.value < this.slidermin) {
                element.hidden = true;
            } else {
                element.hidden = false;
            }
        });

    }


    // Slide function
    MouseDown(event: any) {
        this.editmode = 1;
        sessionStorage.setItem('editmode', this.editmode.toString());
        let editmode = this.editmode;

        event.preventDefault(); // prevent selection start (browser action)
        const button = document.getElementById(event.target.id) as HTMLElement;

        const temptextlabel = document.getElementById('TempTextlabel') as HTMLElement;
        const markPointContainer = document.getElementById('markPointContainer') as HTMLElement;

        const slider = document.getElementsByClassName('slider__component')[0] as HTMLElement;


        markPointContainer.style.marginTop = 30 + 'px';

        const shiftX = event.clientX - button.getBoundingClientRect().left;


        sessionStorage.setItem('valuesChanged', button.id.toString());

        if (button.id === 'heatingdesiredtempbutton') {
            // Hiding the other labels and desired temp button
            document.getElementById('currenttempbutton').hidden = true;
            const heatinglabel = document.getElementById('heatingdesiredtemplabel') as HTMLElement;
            const coolinglabel = document.getElementById('coolingdesiredtemplabel') as HTMLElement;
            const currenttemplabel = document.getElementById('currenttemplabel') as HTMLElement;
            coolinglabel.hidden = true;
            currenttemplabel.hidden = true;
            currenttemplabel.classList.remove('slider__labels__active');
            heatinglabel.classList.remove('slider__labels__heatingdesiredtemplabelinactiveclass');
            heatinglabel.classList.add('slider__labels__active');
            temptextlabel.innerText = 'Heating Desired';
            temptextlabel.classList.remove('slider__labels__currenttemplabelclass');
            temptextlabel.classList.add('slider__labels__heatingdesiredtemplabelclass');


            // Changing look of Button
            button.classList.remove('slider__component__heatingdesiredtempbutton');
            button.classList.add('slider__component__heatingbuttonlook');


            // Creating heating active range
            const heatrange = document.getElementById('heatingRange') as HTMLElement;
            const heatingminpos = this.stepwidth * (this.heatingmin - this.slidermin);
            const heatingmaxpos = this.stepwidth * (this.heatingmax - this.slidermin);
            heatrange.style.left = heatingminpos + 'px';
            heatrange.style.width = (heatingmaxpos - heatingminpos) + 'px';
            heatrange.classList.add('slider__component__heatingRangeclass');

        } else
            if (button.id === 'coolingdesiredtempbutton') {
                // Hiding the other labels and desired temp button
                document.getElementById('currenttempbutton').hidden = true;
                const coolinglabel = document.getElementById('coolingdesiredtemplabel') as HTMLElement;
                const heatinglabel = document.getElementById('heatingdesiredtemplabel') as HTMLElement;
                const currenttemplabel = document.getElementById('currenttemplabel') as HTMLElement;
                heatinglabel.hidden = true;
                currenttemplabel.hidden = true;
                currenttemplabel.classList.remove('slider__labels__active');
                coolinglabel.classList.remove('slider__labels__coolingdesiredtemplabelinactiveclass');
                coolinglabel.classList.add('slider__labels__active');
                temptextlabel.innerText = 'Cooling Desired';
                temptextlabel.classList.remove('slider__labels__currenttemplabelclass');
                temptextlabel.classList.add('slider__labels__coolingdesiredtemplabelclass');

                // Changing look of Button
                button.classList.remove('slider__component__coolingdesiredtempbutton');
                button.classList.add('slider__component__coolingbuttonlook');

                // Creating cooling active range
                const coolrange = document.getElementById('coolingRange') as HTMLElement;
                const coolingminpos = this.stepwidth * (this.coolingmin - this.slidermin);
                const coolingmaxpos = this.stepwidth * (this.coolingmax - this.slidermin);
                coolrange.style.left = coolingminpos + 'px';
                coolrange.style.width = (coolingmaxpos - coolingminpos) + 'px';
                coolrange.classList.add('slider__component__coolingRangeclass');

            }

        // Adding required event listners
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // tslint:disable-next-line
        function onMouseMove(event) {
            const newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left;


            const stepwidth = parseFloat(sessionStorage.getItem('stepwidth'));
            const step = parseInt(sessionStorage.getItem('step'), 10);
            const stepdenomination = parseInt(sessionStorage.getItem('stepdenomination'), 10);
            const min = parseInt(sessionStorage.getItem('min'), 10);


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
            if (button.id === 'heatingdesiredtempbutton') {
                const heatingmin = parseInt(sessionStorage.getItem('heatingmin'), 10);
                const heatingmax = parseInt(sessionStorage.getItem('heatingmax'), 10);
                if (buttontext < heatingmin) {
                    buttontext = heatingmin;
                } else
                    if (buttontext > heatingmax) {
                        buttontext = heatingmax;
                    }

            } else
                if (button.id === 'coolingdesiredtempbutton') {
                    const coolingmin = parseInt(sessionStorage.getItem('coolingmin'), 10);
                    const coolingmax = parseInt(sessionStorage.getItem('coolingmax'), 10);
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
            const Buttons = JSON.parse(sessionStorage.getItem('Buttons'));

            Buttons.find(x => x.id === button.id).value = buttontext;

            // Deadband check
            const deadband = parseInt(sessionStorage.getItem('deadband'), 10);
            const heatingdesiredbutton = document.getElementById('heatingdesiredtempbutton') as HTMLElement;
            const heatingdesiredvalue = Buttons.find(x => x.id === 'heatingdesiredtempbutton').value;
            const coolingdesiredvalue = Buttons.find(x => x.id === 'coolingdesiredtempbutton').value;
            const heatcooldifference = coolingdesiredvalue - heatingdesiredvalue;

            if (heatcooldifference < deadband) {
                sessionStorage.setItem('valuesChanged', PucUserIntentTempSliderValueChangedIds.Deadband);
                const deadbandrange = document.getElementById('deadbandRange') as HTMLElement;


                if (button.id === 'heatingdesiredtempbutton') {
                    // Calculating cooling desired value wrt deadband
                    const coolingdesiredbutton = document.getElementById('coolingdesiredtempbutton') as HTMLElement;
                    const coolingdesiredafterdeadband = heatingdesiredvalue + deadband;
                    Buttons.find(x => x.id === 'coolingdesiredtempbutton').value = coolingdesiredafterdeadband;

                    // Display deadband on slider
                    const deadbandminpos = stepwidth * (heatingdesiredvalue - min);
                    const deadbandwidth = stepwidth * (deadband);
                    deadbandrange.style.left = deadbandminpos + 'px';
                    deadbandrange.style.width = deadbandwidth + 'px';
                    deadbandrange.classList.add('slider__component__deadbandRangeclass');

                    // shift cooling desired button wrt deadband
                    coolingdesiredbutton.style.left = ((coolingdesiredafterdeadband - min) * stepwidth) + 'px';
                } else {
                    // Calculating heating desired value wrt deadband
                    // tslint:disable-next-line
                    const heatingdesiredbutton = document.getElementById('heatingdesiredtempbutton') as HTMLElement;
                    const heatingdesiredafterdeadband = coolingdesiredvalue - deadband;
                    Buttons.find(x => x.id === 'heatingdesiredtempbutton').value = heatingdesiredafterdeadband;

                    // Display deadband on slider
                    const deadbandminpos = stepwidth * ((coolingdesiredvalue - deadband) - min);
                    const deadbandwidth = stepwidth * (deadband);
                    deadbandrange.style.left = deadbandminpos + 'px';
                    deadbandrange.style.width = deadbandwidth + 'px';
                    deadbandrange.classList.add('slider__component__deadbandRangeclass');

                    // shift heating desired button wrt deadband
                    heatingdesiredbutton.style.left = ((heatingdesiredafterdeadband - min) * stepwidth) + 'px';
                }
            }
            sessionStorage.setItem('Buttons', JSON.stringify(Buttons));
        }

        function onMouseUp() {
            // returning the slider back to inactive state - start

            temptextlabel.innerText = 'Current Temperature';
            temptextlabel.classList.add('slider__labels__currenttemplabelclass');

            const deadbandRange = document.getElementsByClassName('slider__component__deadbandRangeclass')[0] as HTMLElement;
            if (deadbandRange) {
                deadbandRange.classList.remove('slider__component__deadbandRangeclass');
            }

            markPointContainer.style.marginTop = 17 + 'px';

            if (button.id === 'heatingdesiredtempbutton') {
                document.getElementById('currenttempbutton').hidden = false;
                const heatinglabel = document.getElementById('heatingdesiredtemplabel') as HTMLElement;
                const coolinglabel = document.getElementById('coolingdesiredtemplabel') as HTMLElement;
                const currenttemplabel = document.getElementById('currenttemplabel') as HTMLElement;
                coolinglabel.hidden = false;
                currenttemplabel.hidden = false;
                currenttemplabel.classList.add('slider__labels__active');
                heatinglabel.classList.add('slider__labels__heatingdesiredtemplabelinactiveclass');
                heatinglabel.classList.remove('slider__labels__active');
                temptextlabel.classList.remove('slider__labels__heatingdesiredtemplabelclass');

                button.classList.remove('slider__component__heatingbuttonlook');
                button.classList.add('slider__component__heatingdesiredtempbutton');

                const range = document.getElementById('heatingRange') as HTMLElement;
                range.classList.remove('slider__component__heatingRangeclass');

            } else
                if (button.id === 'coolingdesiredtempbutton') {
                    document.getElementById('currenttempbutton').hidden = false;
                    const heatinglabel = document.getElementById('heatingdesiredtemplabel') as HTMLElement;
                    const coolinglabel = document.getElementById('coolingdesiredtemplabel') as HTMLElement;
                    const currenttemplabel = document.getElementById('currenttemplabel') as HTMLElement;
                    heatinglabel.hidden = false;
                    currenttemplabel.hidden = false;
                    currenttemplabel.classList.add('slider__labels__active');
                    coolinglabel.classList.add('slider__labels__coolingdesiredtemplabelinactiveclass');
                    coolinglabel.classList.remove('slider__labels__active');
                    temptextlabel.classList.remove('slider__labels__coolingdesiredtemplabelclass');

                    button.classList.remove('slider__component__coolingbuttonlook');
                    button.classList.add('slider__component__coolingdesiredtempbutton');

                    const range = document.getElementById('coolingRange') as HTMLElement;
                    range.classList.remove('slider__component__coolingRangeclass');

                }
            // returning the slider back to inactive state - end

            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
            editmode = 0;
            sessionStorage.setItem('editmode', editmode.toString());
            const editmodecomplete = 1;
            sessionStorage.setItem('editmodecomplete', editmodecomplete.toString());
        }

    }

    // Update all desired temp values on change
    setdesiredtemps() {
        this.Buttons = JSON.parse(sessionStorage.getItem('Buttons'));
        this.heatingdesiredtempvalue = this.Buttons.find(x => x.id === 'heatingdesiredtempbutton').value;
        this.currenttempvalue = this.Buttons.find(x => x.id === 'currenttempbutton').value;
        this.coolingdesiredtempvalue = this.Buttons.find(x => x.id === 'coolingdesiredtempbutton').value;
        this.editmodecomplete = parseInt(sessionStorage.getItem('editmodecomplete'), 10);
        this.usertemperatureInputs.desiredTempCooling = this.coolingdesiredtempvalue.toString();
        this.usertemperatureInputs.desiredTempHeating = this.heatingdesiredtempvalue.toString();

        if (this.editmodecomplete === 1) {
            this.sliderUserIntentService.setData(this.usertemperatureInputs, PucUserLimitDataSources.SLIDER, this.zoneName);
            this.desiredTempsChanged.emit(sessionStorage.getItem('valuesChanged'));
            this.editmodecomplete = 0;
            sessionStorage.setItem('editmodecomplete', this.editmodecomplete.toString());

        }
        this.cd.detectChanges();
    }

    ngOnDestroy() {
        if (this.resizeSensor) {
            this.resizeSensor.detach();
        }
    }

}
