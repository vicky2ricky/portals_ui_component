import * as moment from 'moment';

import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DaterangepickerDirective, LocaleConfig, LocaleService } from 'ngx-daterangepicker-material';

import { EventEmitter } from '@angular/core';
import { Moment } from 'moment';

@Component({
  selector: 'puc-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
  providers: [LocaleService]
})
export class AddEditComponent implements OnInit {
  @Input() id: string;
  @Input() type: string;
  @Output() formatDate: any = new EventEmitter()
  @Input() endTime: any;
  @Input() isAlert = false;
  calendarLocale: LocaleConfig;
  calendarPlaceholder: string;
  minDate: Moment;
  selectedRange: null;
  moment = moment;
  canEdit = false;
  eventObj = null;

  @ViewChild(DaterangepickerDirective, { static: false }) pickerDirective: DaterangepickerDirective;
  displayMessage: string;

  constructor() {
    // intializing calender modal
    this.calendarLocale = {
      applyLabel: 'Apply',
      clearLabel: 'Cancel',
      format: 'DD/MM/YYYY',
      daysOfWeek: ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'],
      monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      firstDay: 1
    };
    this.calendarPlaceholder = 'All';
    this.minDate = moment();
  }

  ngOnInit(): void {
    if (this.endTime) {
      this.dateFormat();
      this.canEdit = true
    }
  }
  dateFormat() {
    if (!this.endTime) return '';

    const timePeriod = this.endTime.diff(moment(), 'days')
    const duration = (this.endTime.format('HH:mm') == '23:59') ? 'midnight' : this.endTime.format('HH:mm')
    this.displayMessage = '';
    switch (timePeriod) {
      case 0:
        this.displayMessage = `Muted till <b>Today ${duration}</b>`
        break

      case 1:
        this.displayMessage = `Muted till <b>Tomorrow ${duration}</b>`
        break

      default:
        this.displayMessage = `Muted till <b>${this.endTime.format('MMMM Do YYYY')} | ${duration}</b>`
        break
    }
    return this.displayMessage
  }
  private getNextSunday() {
    const dayINeed = 7; // for Sunday
    const today = moment().isoWeekday();
    if (today <= dayINeed) {
      return moment().isoWeekday(dayINeed).endOf('days');
    } else {
      return moment().add(1, 'weeks').isoWeekday(dayINeed).endOf('days');
    }
  }

  open(e) {
    this.pickerDirective.open(e);
  }

  handleChange(event) {
    const selectedRange = {
      type: this.type,
      id: this.id,
      range: null
    }

    switch (event.currentTarget.value) {
      case 'today':
        selectedRange.range = `${[moment(), moment().endOf('day')]}`
        this.formatDate.emit(selectedRange);
        this.closePopup(event.currentTarget);
        break
      case 'tomorrow':
        selectedRange.range = `${[moment(), moment().add(1, 'days').endOf('days')]}`
        this.formatDate.emit(selectedRange);
        this.closePopup(event.currentTarget);
        break
      case 'twoday':
        selectedRange.range = `${[moment(), moment().add(2, 'days').endOf('days')]}`
        this.formatDate.emit(selectedRange);
        this.closePopup(event.currentTarget);
        break
      case 'week':
        selectedRange.range = `${[moment(), this.getNextSunday()]}`
        this.formatDate.emit(selectedRange);
        this.closePopup(event.currentTarget);
        break
      case 'custom':
        this.open(event);
        this.eventObj = event.currentTarget;
        break
      case 'unmute':
        selectedRange.range = null;
        this.formatDate.emit(selectedRange);
        this.closePopup(event.currentTarget);
        break
    }

  }

  closePopup(event) {
    if(!event) return;
    event.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
  }

  dateSelection(event) {
    const selectedRange = {
      type: this.type,
      id: this.id,
      range: null
    }
    selectedRange.range = `${[event.startDate, event.endDate]}`;
    this.formatDate.emit(selectedRange);
    this.closePopup(this.eventObj);
    this.eventObj = null;
  }
}
