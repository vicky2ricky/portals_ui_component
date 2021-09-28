import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LocaleService } from 'ngx-daterangepicker-material';
import { ObjectUtil } from '../../utils/object-util';

@Component({
  selector: 'puc-muted-alert-dialog',
  templateUrl: './muted-alert-dialog.component.html',
  styleUrls: ['./muted-alert-dialog.component.scss'],
  providers: [LocaleService]
})
export class MutedAlertDialogComponent implements OnInit {
  changeText: boolean;
  ccus = [];
  equips = [];
  // selected: any;
  // displayMessage: string = "";

  @ViewChild('searchTextField', { static: true }) searchTextField: ElementRef;

  searchTextChanged = new Subject<string>();
  searchText = '';
  tempHolder = [];
  constructor(
    public dialogRef: MatDialogRef<MutedAlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public siteDetails,
    public dialog: MatDialog
  ) {
    // intialising site details
    this.ccus = this.siteDetails.data;
    this.tempHolder = ObjectUtil.deepClone(this.siteDetails.data);

  }

  subscriptions = {};
  panelOpenState = true;

  ngOnInit() {
    this.searchTextChanged.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((search) => {
      this.searchText = search.trim();
      this.filterEquips();
    });
  }
  filterEquips() {
    // this.ccus = ObjectUtil.deepClone(this.tempHolder);
    this.ccus = this.tempHolder.map((c) => {
      const ccu = {}
        if(c['disableDateTimeFrom']) ccu['disableDateTimeFrom'] = moment(c['disableDateTimeFrom']._i);
        if(c['disableDateTimeThru']) ccu['disableDateTimeThru'] = moment(c['disableDateTimeThru']._i);
        ccu['deviceId'] = c['deviceId'];
        ccu['ccuName'] = c['ccuName'];
        ccu['equips'] =  c.equips.map(e =>{
          const equips = {};
          if(e['disableDateTimeFrom']) equips['disableDateTimeFrom'] = moment(e['disableDateTimeFrom']._i);
          if(e['disableDateTimeThru']) equips['disableDateTimeThru'] = moment(e['disableDateTimeThru']._i);
          equips['equipId'] = e['equipId'];
          equips['equipName'] = e['equipName'];
          return equips
        })
        return ccu;
    })
    if (this.searchText) {
      this.ccus = this.ccus.map(c => {
        c.equips = c.equips.filter(e => e.equipName.toLowerCase().includes(this.searchText.toLowerCase()));
        return c;
      })
    }
  }

  search(searchText) {
    // const self = this;
    // searchText = searchText.trim();
    // self.searchText = searchText;

    // if (self.searchText == '') {
    //     self.hasSearch = false;
    // }
    this.searchTextChanged.next(searchText);
    // this.handleUsersInfo('search');
  }

  private _isExpansionIndicator(target: EventTarget): boolean {
    const expansionIndicatorClass = 'mat-expansion-indicator';

    return (
      target['classList'] &&
      target['classList'].contains(expansionIndicatorClass)
    );
  }

  expandPanel(matExpansionPanel, event): void {
    event.stopPropagation(); // Preventing event bubbling

    if (!this._isExpansionIndicator(event.target)) {
      matExpansionPanel.open(); // Here's the magic
    }
  }

  onDateChanged(res: any) {
    const selectedrange = {
      from: res.range ? moment(res.range.split(',')[0]) : null,
      to: res.range ? moment(res.range.split(',')[1]) : null
    }

    this.getById(res.id, res.type, selectedrange);

    // document.getElementById(res.id).innerHTML = string
  }

  getById(id, type, range) {
    if (type == 'ccu') {
      const ccu = this.ccus.find(c => c.deviceId == id);
      if (ccu) {
        ccu['disableDateTimeFrom'] = range.from;
        ccu['disableDateTimeThru'] = range.to;
      }
      const tempccu = this.tempHolder.find(c => c.deviceId == id);
      if (tempccu) {
        tempccu['disableDateTimeFrom'] = range.from;
        tempccu['disableDateTimeThru'] = range.to;
      }

    } else {
      for (let i = 0; i < this.ccus.length; i++) {             // tslint:disable-line
        const equipIdx = this.ccus[i].equips.findIndex(e => e.equipId == id);
        if (equipIdx > -1) {
          this.ccus[i].equips[equipIdx]['disableDateTimeFrom'] = range.from;
          this.ccus[i].equips[equipIdx]['disableDateTimeThru'] = range.to;
          break;
        }
      }
      for (let i = 0; i < this.tempHolder.length; i++) { // tslint:disable-line
        const equipIdx = this.tempHolder[i].equips.findIndex(e => e.equipId == id);
        if (equipIdx > -1) {
          this.tempHolder[i].equips[equipIdx]['disableDateTimeFrom'] = range.from;
          this.tempHolder[i].equips[equipIdx]['disableDateTimeThru'] = range.to;
          break;
        }
      }
    }

  }

  dateFormat(value) {
    if (!value['disableDateTimeThru']) return '';

    const timePeriod = value['disableDateTimeThru'].diff(moment(), 'days');
    const duration = (value['disableDateTimeThru'].format('HH:mm') == '23:59') ? 'midnight' : value['disableDateTimeThru'].format('HH:mm')
    let displayMessage = '';
    switch (timePeriod) {
      case 0:
        displayMessage = `till Today ${duration == 'mignight' ? duration : ' | ' + duration}`
        break

      case 1:
        displayMessage = `till Tomorrow ${duration}`
        break

      default:
        displayMessage = `till ${value['disableDateTimeThru'].format('MMMM Do YYYY')} | ${duration}`
        break
    }
    return displayMessage;
  }

  // popupOpen(ev, isHide = false) {
  //   ev.currentTarget.parentElement.nextElementSibling.style.display = isHide ? 'none' : "block";
  // }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
