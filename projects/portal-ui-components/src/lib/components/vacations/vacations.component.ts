import { Component, Input, OnChanges, OnInit, SimpleChanges, SecurityContext } from '@angular/core';
import { Moment } from 'moment';
import * as moment_ from 'moment';
import { VacationScheduleDetails } from '../../models/vacations.model';
import { HelperService } from '../../services/hs-helper.service';
import { SiteService } from '../../services/site.service';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { VacationModalComponent } from '../vacation-modal/vacation-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { DomSanitizer } from '@angular/platform-browser';

const moment = moment_;
@Component({
  selector: 'puc-vacations',
  templateUrl: './vacations.component.html',
  styleUrls: ['./vacations.component.scss']
})
export class VacationsComponent implements OnChanges {

  public vacationsData: any = [];
  displayedColumns: string[] = ['vacationName', 'startDate', 'endDate', 'editVacation', 'deleteVacation'];

  validationMessage: Array<string> = [];


  vacationScheduleDetails: VacationScheduleDetails;
  vacationsTableHeaders = [
    'Vacation Name',
    'Start Date',
    'End Date',
    ' ', // edit
    ' ' // delete
  ];


  confirmationModal: any = {
    active: false,
    fixed: false,
    width: 45,
    left: 0
  };

  @Input() public roomRef: string;
  @Input() public siteRef: string;
  @Input() public vacationsServerData: Array<any>;
  @Input() public siteTimeZone: string;
  @Input() public isZoneVac = true;


  sortData(sort: Sort) {
    switch (sort.active) {
      case 'vacationName':
        {
          if (sort.direction === 'asc') {
            this.vacationsData.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
          } else if (sort.direction == 'desc') {
            this.vacationsData.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? -1 : 1);
          }
        }
        break;
      case 'startDate':
        {
          if (sort.direction === 'asc') {
            this.vacationsData.sort((a, b) => (a.strtDate.isBefore(b.strtDate, 'day') ? -1 : 1));
          } else if (sort.direction == 'desc') {
            this.vacationsData.sort((a, b) => (a.strtDate.isBefore(b.strtDate, 'day') ? 1 : -1));
          }
        }
        break;
      case 'endDate':
        {
          if (sort.direction === 'asc') {
            this.vacationsData.sort((a, b) => (a.endDate.isBefore(b.endDate, 'day') ? -1 : 1));
          } else if (sort.direction == 'desc') {
            this.vacationsData.sort((a, b) => (a.endDate.isBefore(b.endDate, 'day') ? 1 : -1));
          }
        }
        break;

    }

    this.vacationsData = Array.from(this.vacationsData);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.vacationsServerData && changes.vacationsServerData.currentValue) {
      // default value
      if (this.vacationsData == undefined) {
        this.vacationsData = [];
      }
      const data = changes.vacationsServerData.currentValue;

      if (data && data.length) {
        const vacationData = [];
        data.forEach((vacation: any) => {
          if (vacation && vacation.id && vacation.val) {
            const range = this.getDateRange(vacation.val.range);
            const vac = new VacationScheduleDetails(vacation.id, this.siteRef,
              this.roomRef, vacation.val.name, range.startDate, range.endDate, this.isZoneVac);
            vacationData.push(vac);
          }
        });

        // update Existing Vacation
        this.vacationsData.forEach((existinvac, index) => {
          const fetchedVac = vacationData.filter((newvac) => {
            return newvac.vacId === existinvac.vacId;
          })[0];

          if (fetchedVac) {
            this.vacationsData[index] = fetchedVac;
          } else {
            this.vacationsData.splice(index, 1);
          }

        });

        // Add Newly added Vacation
        vacationData.forEach((newvac, index) => {
          const fetchedVac = this.vacationsData.filter((existinvac) => {
            return newvac.vacId === existinvac.vacId;
          })[0];

          if (fetchedVac) {
          } else {
            this.vacationsData.push(newvac);
          }

        });

      } else {
        this.vacationsData = [];
      }
      this.vacationsData = Array.from(this.vacationsData);
      this.vacationsServerData = changes.vacationsServerData.currentValue;
      // Filter expired vacaction
      const siteTodayDate = moment.tz(moment(), this.siteService.getIANATimeZone(this.siteTimeZone)).startOf('day');
      this.vacationsData.forEach((vac: VacationScheduleDetails) => {
        vac.isExpired = !(vac.endDate.isSameOrAfter(siteTodayDate));
        vac.dispNameStDate = moment.tz(vac.strtDate, this.siteService.getIANATimeZone(this.siteTimeZone)).format('DD MMM YY');
        vac.dispNameEdDate = moment.tz(vac.endDate, this.siteService.getIANATimeZone(this.siteTimeZone)).format('DD MMM YY');

      });
      this.vacationsData = Array.from(this.vacationsData.filter((vac: VacationScheduleDetails) => !vac.isExpired));
    }

    if (changes.siteTimeZone && changes.siteTimeZone.currentValue) {
      this.siteTimeZone = changes.siteTimeZone.currentValue;
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

  constructor(
    private helperService: HelperService,
    private siteService: SiteService,
    public dialog: MatDialog,
    public dom: DomSanitizer
  ) {
    // For new vacation

  }


  addVacationSchedule() {
    this.openVacationModal();
  }

  closevacationModal(event: Event) {
    this.validationMessage = [];
  }

  editVacationSchedule(vacation: VacationScheduleDetails) {
    // Set the selected vacation vals
    this.openVacationModal(true,{ ...vacation });
  }

  deleteVacationSchedule(vacation: VacationScheduleDetails) {
    this.openDeleteConfirm(vacation)
  }

  openDeleteConfirm(vacation) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '450px',
      disableClose: true
    });
    // tslint:disable-next-line
    const htmlContent = `<div>Are you sure you want to delete the vacation:
    ${ vacation.name } ?`;
    dialogRef.componentInstance.title = 'Confirmation';
    dialogRef.componentInstance.htmlContent = this.dom.sanitize(SecurityContext.HTML, htmlContent);
    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'confirm') {
        this.handleDelete(vacation);
      }
    });
  }



  handleDelete(vacation) {
    const indexOfVac = this.vacationsData.findIndex(vac => vac.vacId === vacation.vacId);
    this.siteService.removeEntity(vacation.vacId).subscribe(res => {
      this.vacationsData.splice(indexOfVac, 1);
      this.vacationsData = Array.from(this.vacationsData);
    });

  }

  openVacationModal(isEdit=false,vacationScheduleDetails=null) {
    const dialogRef:any = this.dialog.open(VacationModalComponent,{
      panelClass: 'vacation-modal-dialog',
    });
    dialogRef.componentInstance.isEdit = isEdit;
    dialogRef.componentInstance.roomRef = this.roomRef;
    dialogRef.componentInstance.vacationScheduleDetails = vacationScheduleDetails;
    dialogRef.componentInstance.siteTimeZone = this.siteTimeZone;
    dialogRef.componentInstance.siteRef = this.siteRef;
    dialogRef.componentInstance.isZoneVac = this.isZoneVac;
    dialogRef.componentInstance.vacationsData = this.vacationsData


    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.vacationsData = result;
      }
    });
  }
}
