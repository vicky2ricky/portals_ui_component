import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeatmapConnectService {

  constructor() { }

  private heatmapCustomChanges$: Subject<number> = new Subject(); // number of total changes
  private draftActionTaken$:  Subject<string> = new Subject(); // Action taken on Header - save, discard, publish

  private globalDashboardStatus$: Subject<any> = new Subject(); // updatedTime, published
  private dashboardLevelChanges$: Subject<any> = new Subject(); // sends the dashboardId to which changes have been made

  getHeatmapCustomChanges() : Observable<number> {
    return this.heatmapCustomChanges$.asObservable();
  }

  setHeatmapCustomChanges(changes: number) {
    this.heatmapCustomChanges$.next(changes);
  }

  getDraftActionTaken(): Observable<string> {
    return this.draftActionTaken$.asObservable();
  }

  setDraftActionTaken(action) {
    this.draftActionTaken$.next(action);
  }

  getGlobalDashboardStatus(): Observable<any> {
    return this.globalDashboardStatus$.asObservable();
  }

  setGlobalDashboardStatus(statusObj) {
    this.globalDashboardStatus$.next(statusObj);
  }

  getDashboardLevelChanges(): Observable<any> {
    return this.dashboardLevelChanges$.asObservable();
  }

  setDashboardLevelChanges(dashboardId) {
    this.dashboardLevelChanges$.next(dashboardId);
  }
}
