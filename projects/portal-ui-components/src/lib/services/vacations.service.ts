import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { VacationScheduleDetails } from '../models/vacations.model';
import { SiteService } from './site.service';

@Injectable({
  providedIn: 'root'
})
export class VacationsService {
  url: string = this.siteService.url;
  siteTimezone = new Subject<any>();
  updateVacationList = true;

  constructor(private siteService: SiteService, private http: HttpClient) {
    this.siteService.url$.subscribe(url => this.url = url);
  }

  updateVacation(vacDetails: VacationScheduleDetails, timeZone: string) {
    return this.http.post(`${this.url}v1/addEntity/`, this.getHttpBody(vacDetails, timeZone));
  }

  getHttpBody(vacDetails: VacationScheduleDetails, timeZone: string) {
    const tz = timeZone;
    // tslint:disable-next-line
    return `ver:"3.0"\nrange,${vacDetails.isZoneVAc ? 'zone' : 'building'},dis,${vacDetails.vacId.length ? 'id,' : ''}vacation,heating,temp,schedule,cooling,siteRef${vacDetails.isZoneVAc ? ',roomRef' : ''}\n${'{stdt:' + this.siteService.inHaystackDateTimeForVacation(vacDetails.strtDate, tz, 'startDate') + ' etdt:' + this.siteService.inHaystackDateTimeForVacation(vacDetails.endDate, tz, 'endDate') + '}'},M,"${vacDetails.name}"${vacDetails.vacId.length ? ',@' + vacDetails.vacId : ''},M,M,M,M,M,@${vacDetails.siteRef}${vacDetails.isZoneVAc ? ',@' + vacDetails.roomRef : ''}`;
  }

  getSIteTz(siteRef: string) {
    this.siteService.getReadById(siteRef).subscribe(({ rows }) => {
      if (rows.length) {
        // got data for site
        if (rows[0] && rows[0].tz) {
          // got time zone
          this.siteTimezone.next(rows[0].tz);
        }
      }
    });
  }
}
