import { Directive, HostBinding, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDraggable],[appDroppable]'
})
export class DraggableDirective {
  @HostBinding('class.draggable') draggable = true;

  pointerId?: number;

  @HostBinding('attr.touch-action') touchAction = 'none';

  @Output() dragStart = new EventEmitter<PointerEvent>();
  @Output() dragMove = new EventEmitter<PointerEvent>();
  @Output() dragEnd = new EventEmitter<PointerEvent>();
  // tslint:disable-next-line
  @Output() resize = new EventEmitter<PointerEvent>();

  @HostBinding('class.dragging') dragging = false;

  constructor(public element: ElementRef) { }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) {
      return;
    }

    this.pointerId = event.pointerId;

    this.dragging = true;
    this.dragStart.emit(event);
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.dragging || event.pointerId !== this.pointerId) {
      return;
    }

    this.dragMove.emit(event);
    this.resize.emit(event);
  }

  @HostListener('document:pointercancel', ['$event'])
  @HostListener('document:pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (!this.dragging || event.pointerId !== this.pointerId) {
      return;
    }

    this.dragging = false;
    this.dragEnd.emit(event);
  }
}

