import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneSettingsService {
  subject: Subject<any> = new Subject<any>();
}
