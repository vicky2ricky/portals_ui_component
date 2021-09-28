import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GraphService {
  public graphPointsCollection: Map<string, string> = new Map<string, string>();
  public graphPointsUnitsCollection: Map<string, string> = new Map<string, string>();
  public graphPointsEnumCollection: Map<string, string> = new Map<string, string>();
  public graphDataCollection: any;

  public graphDataSubject: Subject<any> = new Subject();
  public graphDataServiceSubjectCollection: Array<Subscription> = new Array<Subscription>();

  public setData(data: any) {
    this.graphDataCollection = { ...this.graphDataCollection, ...data };
    this.graphDataSubject.next(this.graphDataCollection);
  }

  public getData(): Array<any> {
    return this.graphDataCollection;
  }

  public resetGraphData() {
    this.graphDataCollection = [];
    this.graphDataSubject.next([]);
    this.graphDataServiceSubjectCollection.forEach(sub => sub.unsubscribe());
    this.graphDataServiceSubjectCollection = [];
    this.graphPointsUnitsCollection.clear();
    this.graphPointsEnumCollection.clear();
  }
}
