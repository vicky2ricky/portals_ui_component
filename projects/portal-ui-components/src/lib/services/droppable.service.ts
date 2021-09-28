import { Injectable, SkipSelf, Optional } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DroppableService {
  dragStart$: Observable<PointerEvent>;
  dragMove$: Observable<PointerEvent>;
  dragEnd$: Observable<PointerEvent>;
  resize$: Observable<PointerEvent>;

  private dragStartSubject = new Subject<PointerEvent>();
  private dragMoveSubject = new Subject<PointerEvent>();
  private dragEndSubject = new Subject<PointerEvent>();
  private resizeSubject = new Subject<PointerEvent>();

  constructor(@SkipSelf() @Optional() private parent?: DroppableService) {
    this.dragStart$ = this.dragStartSubject.asObservable();
    this.dragMove$ = this.dragMoveSubject.asObservable();
    this.dragEnd$ = this.dragEndSubject.asObservable();
    this.resize$ = this.resizeSubject.asObservable();
  }

  onDragStart(event: PointerEvent): void {
    this.dragStartSubject.next(event);

    if (this.parent) {
      this.parent.onDragStart(event);
    }
  }

  onDragMove(event: PointerEvent): void {
    this.dragMoveSubject.next(event);

    if (this.parent) {
      this.parent.onDragMove(event);
    }
  }

  onDragEnd(event: PointerEvent): void {
    this.dragEndSubject.next(event);

    if (this.parent) {
      this.parent.onDragEnd(event);
    }
  }

  onResize(event: PointerEvent): void {
    this.resizeSubject.next(event);

    if (this.parent) {
      this.parent.onResize(event);
    }
  }
}
