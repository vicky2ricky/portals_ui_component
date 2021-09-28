import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpCancelService } from './cancel.service';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class HttpCancelInterceptor implements HttpInterceptor {
  constructor(
    private httpCancelService: HttpCancelService
  ) { }

  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(req).pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()));
  }
}
