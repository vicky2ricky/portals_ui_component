import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import * as jwt_decode_ from 'jwt-decode';
import * as moment_ from 'moment';
import { Observable, Observer, Subscription, timer } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';

const moment = moment_;
const jwt_decode = jwt_decode_;

@Injectable({ providedIn: 'root' })
export class AuthenticationService implements OnDestroy {
  tokenTimer: Observable<any>;
  tokenTimerSubscription: Subscription;
  appName: string;
  constructor(
    private http: HttpClient,
    private configService: ConfigurationService,
    @Inject(DOCUMENT) private document: any,
    @Inject('LOCALSTORAGE') private localStorage: any) {

  }

  ngOnDestroy() {
    this.tokenTimerSubscription.unsubscribe();
  }

  setSession(authResult) {
    this.localStorage.setItem('bearer_token', authResult.idToken);
    // tslint:disable-next-line
    this.localStorage.setItem('expires_at', JSON.stringify(authResult.expiresAt!.valueOf()));
    this.localStorage.setItem('user_data', JSON.stringify(authResult.userData));

    this.localStorage.setItem('global_session_id', authResult.globalSessionID);

    this.setTimer();
  }

  setTimer() {
    /* istanbul ignore if  */
    if (this.tokenTimerSubscription) {
      this.tokenTimerSubscription.unsubscribe();
    }

    // Find the time difference between now and the expiry date set on the token
    const expiresIn = Math.abs(moment().subtract(this.getExpiration(), 'second').unix());

    // Token timer to run after 90% time in milliseconds has elapsed for the access token expiry
    this.tokenTimer =
      timer(Math.floor(.9 * expiresIn * 1000))
        .pipe(
          mergeMap(() => this.getNewToken()),
          take(1)
        );

    this.tokenTimerSubscription = this.tokenTimer.subscribe();
  }


  login() {
    const gatekeeperUrl = this.configService.getConfig('auth').gatekeeperUrl;
    const currentUrl = this.document.location.href;

    this.document.location.href = `${gatekeeperUrl}/sso/login?serviceURL=${currentUrl}`;
  }

  logout() {
    const gatekeeperUrl = this.configService.getConfig('auth').gatekeeperUrl;
    const currentUrl = this.document.location.href;

    const userId = this.getUser() ? this.getUser().userId : null;
    const sessionId = this.getSessionId();

    this.localStorage.clear();

    this.document.location.href = `${gatekeeperUrl}/user/logout?serviceURL=${currentUrl}&userId=${userId}&stateId=${sessionId}`;
  }

  setUser(userData) {
    this.localStorage.setItem('user_data', JSON.stringify(userData));
  }

  getUser() {
    return JSON.parse(this.localStorage.getItem('user_data'));
  }

  getSessionId() {
    return this.localStorage.getItem('global_session_id');
  }

  public isLoggedIn() {
    return this.localStorage.getItem('bearer_token');
    // return moment().isBefore(this.getExpiration());
  }

  public isTokenExpired() {
    console.log(`Token Expiry - ${this.getExpiration()}`);
    console.log(`Current Time - ${moment().unix()}`);
    console.log(moment().unix() - this.getExpiration());
    return moment().unix() - this.getExpiration() > 0; // If now is more than the expiry time in the token
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = this.localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return expiresAt;
  }


  handleAuthCallback(): Observable<any> {
    return new Observable((observer: Observer<void>) => {
      const params = window.location.search;
      /* istanbul ignore if  */
      if (params.includes('ssoToken=')) {
        const gatekeeperUrl = this.configService.getConfig('auth').gatekeeperUrl;
        const ssoToken = params.substring(params.indexOf('ssoToken=') + 9);

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'x-api-key': `${this.configService.getConfig('auth').appSecret}`
        });

        this.http.get(`${gatekeeperUrl}/sso/verifytoken?ssoToken=${ssoToken}`, {
          headers
        }).subscribe(data => {
          const decoded = jwt_decode(data['token']);
          this.setSession({
            idToken: data['token'],
            userData: decoded.userData,
            expiresAt: decoded.exp,
            globalSessionID: decoded.globalSessionID
          });

          observer.next();
          observer.complete();
        }, err => {
          console.log(err);
          if (err.error && err.error.msgCode === 'accessDenied') {
            this.document.location.href = err.error.redirectUrl;
          }
        });
      } else {
        observer.next();
      }
    });
  }


  // This would be called from multiple places - based on an Interval Or isTokenExpired
  getNewToken(): Observable<any> {
    return new Observable(observer => {
      const gatekeeperUrl = this.configService.getConfig('auth').gatekeeperUrl;

      this.http.post(`${gatekeeperUrl}/sso/regenerateToken`, {
        userId: this.getUser().userId,
        appName: this.appName
      }).subscribe(data => {
        const decoded = jwt_decode(data['token']);

        this.setSession({
          idToken: data['token'],
          userData: decoded.userData,
          expiresAt: decoded.exp,
          globalSessionID: decoded.globalSessionID
        });

        observer.next();
      }, err => {
        console.log(err);
        this.login();
      });
    });
  }

  /* istanbul ignore next  */
  fetchLoggedInUserDetails(): Observable<any> {
    return new Observable(observer => {
      const caretakerUrl = this.configService.getConfig('auth').caretakerUrl;
      const userId = this.getUser().userId;

      this.http.get(`${caretakerUrl}/user/${userId}`)
        .subscribe(data => {
          if (data['success'] && data['user']) {
            this.localStorage.setItem('user_info', JSON.stringify(data['user']['personalInfo']));
          }
          observer.next();
        });
    });
  }


  getLoggedInUserDetails() {
    let userInfo = JSON.parse(this.localStorage.getItem('user_info'));
    userInfo = userInfo || {};
    // userInfo.lastName = userInfo.lastName || '';

    return userInfo;
  }

  setLoggedInUserDetails(user) {
    this.localStorage.setItem('user_info', JSON.stringify(user));
  }
}

