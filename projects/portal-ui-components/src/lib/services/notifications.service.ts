import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { AuthenticationService } from './authentication.service';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  url: string;
  alertsUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigurationService
  ) {

    this.alertsUrl = this.configService.getConfig('alertsUrl');
  }



  setHttpParams(params) {
    let httpParams = new HttpParams();
    if (params) {

      Object.keys(params).forEach((key, index) => {
        if (params[key] instanceof Object) {
          httpParams = httpParams.append(key, JSON.stringify(params[key]));
        } else {
          httpParams = httpParams.append(key, params[key]);
        }

      });
    }
    return httpParams;
  }

  getUserNotificationPrefrenece(siteId, userId) {
    return this.http.get(`${this.alertsUrl}preferences/sites/${siteId}/users/${userId}`).pipe(catchError(this.handleError));
  }

  setUserNotificationPrefrenece(siteId, userId,alertId,alertDef) {
    return this.http.put(`${this.alertsUrl}preferences/sites/${siteId}/users/${userId}/definitions/${alertId}`,alertDef)
    .pipe(catchError(this.handleError));
  }

  getPreferencesPerSite(siteId,userId) {
    return this.http.get(`${this.alertsUrl}preferences/sites/${siteId}/users/${userId}`)
    .pipe(catchError(this.handleError));
  }

  getPreferencesForAccessSite() {
    return this.http.get(`${this.alertsUrl}preferences`)
    .pipe(catchError(this.handleError));
  }

  setPrefreneceForSite(siteId, userId,definitionId,reqbody) {
    return this.http.put(`${this.alertsUrl}preferences/sites/${siteId}/users/${userId}/definitions/${definitionId}`,reqbody)
    .pipe(catchError(this.handleError));
  }

  registerPushNotification(fcmToken) {
    return this.http.post(`${this.alertsUrl}notifications/register/browser?fcmAddress=${fcmToken}`,{})
    .pipe(catchError(this.handleError));
  }

  getExternalEmailsForSite(siteId) {
    return this.http.get(`${this.alertsUrl}preferences/sites/${siteId}/external-users`)
    .pipe(catchError(this.handleError));
  }

  addExternalEmail(siteId,reqBody) {
    return this.http.post(`${this.alertsUrl}preferences/sites/${siteId}/external-users`,reqBody)
    .pipe(catchError(this.handleError));
  }

  editExternalEmail(siteId,externalUserId,reqBody) {
    return this.http.put(`${this.alertsUrl}preferences/sites/${siteId}/external-users/${externalUserId}`,reqBody)
    .pipe(catchError(this.handleError));
  }

  deleteExternalEmail(siteId,externalUserId) {
    return this.http.delete(`${this.alertsUrl}preferences/sites/${siteId}/external-users/${externalUserId}`)
    .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.error);
  }

}
