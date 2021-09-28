import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private _data: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private _pointId: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  public setData(data: any) {
    this._data.next(data);
  }

  public getData(): Observable<any> {
    return this._data.asObservable();
  }

  public setId(data: any) {
    this._pointId.next(data);
  }

  public getId(): Observable<any> {
    return this._pointId.asObservable();
  }

  public clearData() {
    this._pointId.next(null);
  }
}
