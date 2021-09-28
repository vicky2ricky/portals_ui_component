import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';
const basePath = 'api/v1';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private BASE_URL = 'assets/mock/';
  private readonly FM_URL = 'facility-managers.json';
  private readonly BU_URL = 'buildings.json';
  private readonly OR_URL = 'other-roles.json';
  private readonly PREFERENCE_URL = 'preferences.json';
  private readonly ORG_URL = 'organizations.json';
  private readonly ZONE_URL = 'zones.json';
  private readonly ENDUSER_URL = 'endusers.json';
  private readonly ZONES_BY_USER_URL = 'zonesByUser.json';
  caretakerUrl: string;
  userMangementTypes: Array<any> = [];

  userChanged$: Subject<any> = new Subject<any>();

  mockUserChange$: Subject<any> = new Subject<any>();
  constructor(
    private http: HttpClient,
    private configService: ConfigurationService
  ) {
    this.caretakerUrl = this.configService.getConfig('auth').caretakerUrl;
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

  getUserOtherRoles(userId, params?) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(`${this.caretakerUrl}` + '/user/' + userId + '/roles', { params }).pipe(catchError(this.handleError));
  }

  getUsers(params?) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(`${this.caretakerUrl}` + '/user/search', { params }).pipe(catchError(this.handleError));
  }

  getBuildings(params?) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(`${this.caretakerUrl}` + '/sites/search', { params }).pipe(catchError(this.handleError));
  }

  getBuildingsByUser(userId, params?) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(`${this.caretakerUrl}` + '/user/' + userId + '/sites', { params }).pipe(catchError(this.handleError));
  }

  getOrgsByUser(userId, params?) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(`${this.caretakerUrl}` + '/user/' + userId + '/orgs', { params }).pipe(catchError(this.handleError));
  }

  getPreferences(userId, params?) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(`${this.caretakerUrl}` + '/user/' + userId + '/alertPreferences', { params }).pipe(catchError(this.handleError));
  }

  getUserOrganizations(userId, params) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(`${this.caretakerUrl}` + '/user/' + userId + '/orgs', { params }).pipe(catchError(this.handleError));
  }

  getOrganizations(params?) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(`${this.caretakerUrl}` + '/org/search', { params }).pipe(catchError(this.handleError));
  }

  getZones() {
    return this.http.get(`${this.BASE_URL}${this.ZONE_URL}`).pipe(catchError(this.handleError));
  }

  getEndUers(params?) {
    return this.http.get(`${this.BASE_URL}${this.ENDUSER_URL}`).pipe(catchError(this.handleError));
  }

  getUserRoles() {
    return this.http.get(`${this.caretakerUrl}` + '/roles').pipe(catchError(this.handleError));
  }

  getUserBySite(siteId, params?) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(`${this.caretakerUrl}` + '/sites/' + siteId + '/users', { params }).pipe(catchError(this.handleError));
  }

  setUserMgmtTypes(val: any[]) {
    this.userMangementTypes = val;
  }

  getUserMgmtTypes() {
    return this.userMangementTypes;
  }

  createUser(body) {
    return this.http.post(`${this.caretakerUrl}` + '/users', body).pipe(catchError(this.handleError));
  }

  deleteUser(params) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.delete(`${this.caretakerUrl}` + '/users', { params }).pipe(catchError(this.handleError));
  }

  getAllUsers(params) {
    params = params ? this.setHttpParams(params) : {};
    return this.http.get(`${this.caretakerUrl}` + '/user/search', { params });
  }

  updateUserDetails(userid, userdetails) {
    return this.http.post(`${this.caretakerUrl}` + '/user/' + userid, userdetails);
  }

  deleteSiteUser(siteId, payload) {
    return this.http.post(`${this.caretakerUrl}` + '/sites/' + siteId + '/users', payload).pipe(catchError(this.handleError));
  }

  transferOwnership(sites) {
    return this.http.post(`${this.caretakerUrl}` + '/users-sites-modifications', sites);
  }

  getZonesByUser(userId) {
    return this.http.get(`${this.BASE_URL}${this.ZONES_BY_USER_URL}`).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error);
  }
}

