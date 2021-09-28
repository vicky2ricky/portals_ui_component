import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { VacationScheduleDetails } from '../../models/vacations.model';
import { DaterangepickerComponent } from 'ngx-daterangepicker-material';
import { Moment } from 'moment';
import { VacationsService } from '../../services/vacations.service';
import { SiteService } from '../../services/site.service';
import * as moment from 'moment';
import { HelperService } from '../../services/hs-helper.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'puc-vacation-modal',
  templateUrl: './vacation-modal.component.html',
  styleUrls: ['./vacation-modal.component.scss']
})
export class VacationModalComponent implements OnInit {
  @ViewChild('daterangepicker', { static: true }) dateRangePicker: DaterangepickerComponent;
  @Input() vacationScheduleDetails: VacationScheduleDetails;
  validationMessage: Array<string> = [];
  @Input() isEdit = false;
  @Input() vacationsData;
  @Input() public siteTimeZone: string;
  @Input() public siteRef: string;
  @Input() public isZoneVac = true;
  @Input() public roomRef: string;
  constructor(public vacationsService: VacationsService,
    public dialogRef: MatDialogRef<VacationModalComponent>,
    public siteService: SiteService, public helperService:HelperService) { }

  ngOnInit(): void {
    if(this.isEdit) {
      const chosenLabel =  moment(this.vacationScheduleDetails.dispNameStDate).format('MM/DD/YYYY')+ ' - '
      +moment(this.vacationScheduleDetails.dispNameEdDate).format('MM/DD/YYYY');
      this.udpateDateRangePicker(moment(this.vacationScheduleDetails.dispNameStDate), moment(this.vacationScheduleDetails.dispNameEdDate), chosenLabel);
    } else {
      this.vacationScheduleDetails = new VacationScheduleDetails('', this.siteRef, this.roomRef, '', moment(), moment(), this.isZoneVac);
      this.udpateDateRangePicker(moment(), moment());
    }
  }

  selectedDateRangeChange(range) {
    this.dateRangePicker.chosenLabel = range.chosenLabel;

    this.vacationScheduleDetails.strtDate = range.startDate;
    this.vacationScheduleDetails.endDate = range.endDate;

    this.udpateDateRangePicker(range.startDate, range.endDate);
  }

  udpateDateRangePicker(startDate: Moment, endDate: Moment, chosenLabel: string = null) {
    this.dateRangePicker.setStartDate(startDate);
    this.dateRangePicker.setEndDate(endDate);

    if (chosenLabel) {
      this.dateRangePicker.chosenLabel = chosenLabel;
    }

    this.dateRangePicker.updateView();
  }

  valueChange(event: Event) {
    if (this.vacationScheduleDetails.name && this.validationMessage.length) {
      // clear the validation message
      this.validationMessage = [];
    }
  }

  isInvalidDate = (m: moment.Moment) => {
    // Start date should always be today or later but never less than
    return m.isBefore(moment(), 'day');
  }

  clearData() {
    this.vacationScheduleDetails.name = '';
  }

  handleCancel() {
    this.dialogRef.close();
  }

  handleSave() {
    // Validaitons
    this.validationMessage = [];

    if (this.isEdit) {
      // Edit vacation

      // Remove the selected entry and find conflcits with rest
      const otherVacDetails = this.vacationsData.filter(vac => vac.vacId != this.vacationScheduleDetails.vacId);

      // Name validaiton
      if (this.vacationScheduleDetails.name == '') {
        this.validationMessage.push('Please enter a vacation name.');
      }

      // Validate dates
      if (!(this.dateRangePicker.startDate && this.dateRangePicker.startDate.isValid())) {
        // Invalid start date in calendar
        const msg = 'Invalid Start Date.';
        if (!this.validationMessage.includes(msg)) {
          this.validationMessage.push(msg);
        }
      }
      if (!(this.dateRangePicker.endDate && this.dateRangePicker.endDate.isValid())) {
        // Invalid end date in calendar
        const msg = 'Invalid End Date.';
        if (!this.validationMessage.includes(msg)) {
          this.validationMessage.push(msg);
        }
      }

      // Check name conflict
      const conflictNameVac = otherVacDetails.find(vac => vac.name.toLowerCase() == this.vacationScheduleDetails.name.toLowerCase());
      if (conflictNameVac) {
        const msg = 'Vacation \'' + this.vacationScheduleDetails.name + '\' already exists.';
        if (!this.validationMessage.includes(msg)) {
          this.validationMessage.push(msg);
        }
      }

      // Check start date conflicts
      const conflictDateVac = otherVacDetails.find(vac => vac.strtDate.format('MM/DD/YYYY')
        .match(this.vacationScheduleDetails.strtDate.format('MM/DD/YYYY')));
      if (conflictDateVac) {
        // Start Date conflict
        const msg = 'Two or more vacations cannot have the same start date.';
        if (!this.validationMessage.includes(msg)) {
          this.validationMessage.push(msg);
        }
      }
    } else {
      // Save new Vacation

      // Name validaiton
      if (this.vacationScheduleDetails.name == '') {
        this.validationMessage.push('Please enter a vacation name.');
      } else {
        // check for duplicate name

        // Name Validation
        let filterVac = this.vacationsData.filter(vac => vac.name.toLowerCase() == this.vacationScheduleDetails.name.toLowerCase());
        if (filterVac.length) {
          // Name conflict
          const msg = 'Vacation \'' + this.vacationScheduleDetails.name + '\' already exists.';
          if (!this.validationMessage.includes(msg)) {
            this.validationMessage.push(msg);
          }
        }

        // Validate dates
        if (!(this.dateRangePicker.startDate && this.dateRangePicker.startDate.isValid())) {
          // Invalid start date in calendar
          const msg = 'Invalid Start Date.';
          if (!this.validationMessage.includes(msg)) {
            this.validationMessage.push(msg);
          }
        } else {
          // Valid date seletced , update object
          this.vacationScheduleDetails.strtDate = this.dateRangePicker.startDate;
        }

        if (!(this.dateRangePicker.endDate && this.dateRangePicker.endDate.isValid())) {
          // Invalid end date in calendar
          const msg = 'Invalid End Date.';
          if (!this.validationMessage.includes(msg)) {
            this.validationMessage.push(msg);
          }
        } else {
          // Valid date seletced , update object
          this.vacationScheduleDetails.endDate = this.dateRangePicker.endDate;
        }

        // Start date conflict
        filterVac = this.vacationsData.filter(vac => vac.strtDate.format('MM/DD/YYYY')
          .match(this.vacationScheduleDetails.strtDate.format('MM/DD/YYYY')));
        if (filterVac.length) {
          // Start Date conflict
          const msg = 'Two or more vacations cannot have the same start date.';
          if (!this.validationMessage.includes(msg)) {
            this.validationMessage.push(msg);
          }
        }
      }
    }

    if (this.validationMessage.length == 0) {
      if (this.vacationScheduleDetails.vacId == '') {
        this.vacationsService.updateVacationList = false;
      } else {
        this.vacationsService.updateVacationList = true;
      }
      const resp: any = this.vacationsService.updateVacation(this.vacationScheduleDetails, this.siteTimeZone).subscribe((resp: any) => {
        if (resp && resp.rows[0] && resp.rows[0].id) {
          const vacation = resp.rows[0];
          const range = this.getDateRange(vacation.range);
          const vac = new VacationScheduleDetails(vacation.id.split(':')[1], this.siteRef,
            this.roomRef, vacation.dis, range.startDate, range.endDate, this.isZoneVac);

          // Remove old entry and add the new
          const indexOfVac = this.vacationsData.findIndex(vacObj => vac.vacId === vacObj.vacId);
          if (indexOfVac > -1) {
            this.vacationsData[indexOfVac] = vac;
          } else {
            this.vacationsData.push(vac);
          }

          const siteTodayDate = moment.tz(moment(), this.siteService.getIANATimeZone(this.siteTimeZone)).startOf('day');
          this.vacationsData.forEach((vac: VacationScheduleDetails) => {
            vac.isExpired = !(vac.endDate.isSameOrAfter(siteTodayDate));
            vac.dispNameStDate = moment.tz(vac.strtDate, this.siteService.getIANATimeZone(this.siteTimeZone)).format('DD MMM YY');
            vac.dispNameEdDate = moment.tz(vac.endDate, this.siteService.getIANATimeZone(this.siteTimeZone)).format('DD MMM YY');

          });
          this.vacationsData = Array.from(this.vacationsData);
          this.dialogRef.close(this.vacationsData);

        }
      },
        error => {
          throw new Error('Error Response from haystack server.');
        });
      // this.closevacationModal(event);

    }
  }

  private getDateRange(range): any {
    let startDate: Moment;
    let endDate: Moment;

    // start date
    startDate = moment(this.helperService.stripHaystackTypeMapping(range.stdt.split(' ')[0]));

    // end date
    endDate = moment(this.helperService.stripHaystackTypeMapping(range.etdt.split(' ')[0]));

    return { startDate, endDate };
  }

}
