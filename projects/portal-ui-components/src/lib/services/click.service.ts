import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClickService {

  constructor() { }

  private chartPickerClicked$: Subject<any> = new Subject(); // Emits the widget Id for which the user is accessing the widget settings
  private heatmapSettingsClicked$: Subject<any> = new Subject(); // Emits the widget Id for which the user is accessing the widget settings

  getPickerClicked(): Observable<string> {
    return this.chartPickerClicked$.asObservable();
  }
  setPickerClicked(pickerId) {
    this.chartPickerClicked$.next(pickerId);
  }

  getHeatmapSettingsClicked(): Observable<string> {
    return this.heatmapSettingsClicked$.asObservable();
  }
  setHeatmapSettingsClicked(widgetId) {
    this.heatmapSettingsClicked$.next(widgetId);
  }


  createRandomId(length) {
    const set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const id = [];
    for (let i = 0 ; i < length; i ++) {
        id.push(set[Math.floor(Math.random() * set.length)]);
    }
    return id.join('');
  }
}
