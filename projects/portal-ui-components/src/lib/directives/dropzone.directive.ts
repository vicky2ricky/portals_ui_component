import { Directive, OnInit, HostBinding, Output, EventEmitter, SkipSelf, ElementRef } from '@angular/core';
import { DroppableService } from '../services/droppable.service';

@Directive({
  selector: '[appDropzone]',
  providers: [DroppableService]
})
export class DropzoneDirective implements OnInit {
  @HostBinding('class.dropzone-activated') activated = false;
  @HostBinding('class.dropzone-entered') entered = false;
  // tslint:disable-next-line
  @Output() drop = new EventEmitter<{}>();
  @Output() remove = new EventEmitter<PointerEvent>();

  private clientRect: ClientRect;

  constructor(@SkipSelf() private allDroppableService: DroppableService,
              private innerDroppableService: DroppableService,
              private element: ElementRef) { }

  ngOnInit(): void {
    this.allDroppableService.dragStart$.subscribe(() => this.onDragStart());
    this.allDroppableService.dragEnd$.subscribe(event => this.onDragEnd(event));

    this.allDroppableService.dragMove$.subscribe(event => {
      if (this.isEventInside(event)) {
        this.onPointerEnter();
      } else {
        this.onPointerLeave();
      }
    });

    this.innerDroppableService.dragStart$.subscribe(() => this.onInnerDragStart());
    this.innerDroppableService.dragEnd$.subscribe(event => this.onInnerDragEnd(event));
  }

  private onPointerEnter(): void {
    if (!this.activated) {
      return;
    }

    this.entered = true;
  }

  private onPointerLeave(): void {
    if (!this.activated) {
      return;
    }

    this.entered = false;
  }

  private onDragStart(): void {
    this.clientRect = this.element.nativeElement.getBoundingClientRect();

    this.activated = true;
  }

  private onDragEnd(event: PointerEvent): void {
    if (!this.activated) {
      return;
    }

    if (this.entered) {
      const width = this.clientRect.width;
      const height = this.clientRect.height;

      // calculate position of mouse relative to dropzone
      const x = (event.clientX - this.clientRect.left) / width * 100;
      const y = (event.clientY - this.clientRect.top) / height * 100;
      this.drop.emit({ event, x, y });
    }

    this.activated = false;
    this.entered = false;
  }

  private onInnerDragStart() {
    this.activated = true;
    this.entered = true;
  }

  private onInnerDragEnd(event: PointerEvent) {
    if (!this.entered) {
      this.remove.emit(event);
    }

    this.activated = false;
    this.entered = false;
  }

  private isEventInside(event: PointerEvent) {
    return event.clientX >= this.clientRect.left &&
      event.clientX <= this.clientRect.right &&
      event.clientY >= this.clientRect.top &&
      event.clientY <= this.clientRect.bottom;
  }
}

