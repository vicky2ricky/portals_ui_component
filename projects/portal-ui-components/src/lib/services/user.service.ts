import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  caretakerUrl;
  pasUrl;
  constructor(public configService: ConfigurationService,
              public http: HttpClient,
              public authService: AuthenticationService) {
    this.caretakerUrl = this.configService.getConfig('auth').caretakerUrl;
    this.pasUrl = this.configService.getConfig('pasUrl');
  }

  getDisplayId() {

    const loggedInUserDetails = this.authService.getLoggedInUserDetails();
    if (loggedInUserDetails) {
      return loggedInUserDetails.firstName + ' ' + loggedInUserDetails.lastName;
    } else {
      return null;
    }
  }

  getUserDetails(userid) {
    return this.http.get(`${this.caretakerUrl}` + '/user/' + userid);
  }

  getUserSites(userid) {
    return this.http.get(`${this.caretakerUrl}` + '/user/' + userid + '/sites?role=facilityManager');
  }

  getAllUsers(params) {
    return this.http.get(`${this.caretakerUrl}` + '/user/search', { params });
  }

  getUsersRelatedToSites(userId, params?) {
    return this.http.get(`${this.caretakerUrl}` + `/user/${userId}/peers`, { params });
  }

  transferOwnership(sites) {
    return this.http.post(`${this.caretakerUrl}` + '/sites/transfer', sites);
  }

  updateUserDetails(userid, userdetails) {
    return this.http.post(`${this.caretakerUrl}` + '/user/' + userid, userdetails);
  }

  editUser(payload) {
    return this.http.post(`${this.caretakerUrl}` + '/users', payload);
  }

  changePassword(payload) {
    return this.http.get(`${this.caretakerUrl}` + '/user/password/change', payload);
  }

  getUserPerf(siteId) {
    return this.http.get(`${this.pasUrl}` + `/heatmap/preference/site/${siteId}`);
  }

  updateUserPerf(siteId,payload) {
    return this.http.post(`${this.pasUrl}` + `/heatmap/preference/site/${siteId}`,payload);
  }



}

