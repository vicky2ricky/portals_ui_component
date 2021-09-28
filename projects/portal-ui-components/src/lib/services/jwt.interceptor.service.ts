import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  paramIds = new Set();

  constructor(
    private authService: AuthenticationService,
    private configService: ConfigurationService,
    @Inject('LOCALSTORAGE') private localStorage: any
  ) {

  }

  private handleAuthError(errResponse: HttpErrorResponse): Observable<any> {

    let errorMessage = '';
    /* istanbul ignore if */
    if (errResponse.error instanceof ErrorEvent) { // client-side error

      errorMessage = `Error: ${errResponse.error.message}`;
      console.log(errorMessage);

      return throwError(errResponse);

    } else { // server-side error
      /* istanbul ignore if */
      if (errResponse.status === 401) {
        this.authService.logout();
        // if(errResponse.error && (
        //   errResponse.error.reason === 'blacklisted' || errResponse.error.reason === 'login')) {
        //   this.authService.logout();
        // }

      } else {

        if (errResponse.error.msg) {
          errorMessage = errResponse.error.msg;
        } else if (errResponse.error.suberror) {
          errorMessage = 'Missing consent to access resource';
        }

        return throwError(errResponse);

      }
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const bearerToken = this.localStorage.getItem('bearer_token');
    const flaskmlapp75f = 'https://flaskmlapp75f';
    const ssap = this.configService.getConfig('ssapUrl') || ''
    if (!bearerToken || bearerToken === 'undefined' ||
      request.url.includes('sso/verifytoken') ||
      request.url.startsWith(flaskmlapp75f) ||
      (ssap.length && request.url.startsWith(ssap)) ||
      request.url.startsWith('https://gitlab.com/api/v4/')) {
      return next.handle(request);
    } else {
      const hayStackUrl = this.configService.getConfig('haystackUrl');
      if(request.url.startsWith(hayStackUrl)) {
        request = request.clone({
            setHeaders: {
                'content-type' : 'text/zinc'
            }
        });
      }

      /* istanbul ignore else */
      if (bearerToken && bearerToken !== 'undefined') {

        const tokenReq = request.clone({
          setHeaders: { Authorization: `Bearer ${bearerToken}` }
        });

        return next.handle(tokenReq)
          .pipe(
            catchError(err => this.handleAuthError(err))
          );
      } else {
        return next.handle(request);
      }




    }
  }
}


