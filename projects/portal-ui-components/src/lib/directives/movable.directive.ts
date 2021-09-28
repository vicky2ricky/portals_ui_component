import { Directive, OnInit, HostBinding, Input, ElementRef, SimpleChanges, HostListener, OnChanges } from '@angular/core';
import { DraggableDirective } from './draggable.directive';


interface Position {
  x: number;
  y: number;
}

@Directive({
  selector: '[appMovable]'
})
export class MovableDirective extends DraggableDirective implements OnInit, OnChanges {
  @HostBinding('class.movable') movable = true;

  position: Position = { x: 0, y: 0 };
  size;
  allowDrag = false;
  private startPosition: Position;

  @Input('appMovableReset') reset = false;
  @Input() setPosition: Position;
  @Input() setSize;

  constructor(public element: ElementRef) {
    super(element);
  }

  ngOnInit() {
    const dropzone = this.element.nativeElement.parentElement.getBoundingClientRect();
    const rect = this.element.nativeElement.getBoundingClientRect();
    this.updateHeight(rect.height / dropzone.height * 100);
    this.updateWidth(rect.width / dropzone.width * 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.setPosition && changes.setPosition.currentValue) {
      const pos = changes.setPosition.currentValue;
      this.position = changes.setPosition.currentValue;

      // Only calculate this if the box is dragged from the top
      if (changes.setPosition.currentValue.set) {
        const rect = this.element.nativeElement.getBoundingClientRect();
        const width = rect.right - rect.left;
        const height = rect.bottom - rect.top;

        const dropzone = this.element.nativeElement.parentElement.getBoundingClientRect();
        const dWidth = dropzone.right - dropzone.left;
        const dHeight = dropzone.bottom - dropzone.top;

        let x = pos.x - (width / dWidth * 100) / 2;
        let y = pos.y - (height / dHeight * 100) / 2;

        x = x + (width / dWidth * 100) > 100 ? 100 - width / dWidth * 100 : x;
        y = y + (height / dHeight * 100) > 100 ? 100 - height / dHeight * 100 : y;
        x = x < 0 ? 0 : x;
        y = y < 0 ? 0 : y;

        this.position = { x, y };
        this.element.nativeElement.children[1].innerHTML = this.position.x;
        this.element.nativeElement.children[2].innerHTML = this.position.y;
      }


      this.updatePosition({ x: this.position.x, y: this.position.y });
    }

    if (changes.setSize && changes.setSize.currentValue) {
      this.updateWidth(changes.setSize.currentValue.width);
      this.updateHeight(changes.setSize.currentValue.height);
    }
  }

  updatePosition(position: Position) {
    this.position = position;

    this.setLeft(position.x + '%');
    this.setTop(position.y + '%');
  }

  updateWidth(width: number) {
    let height;
    if (this.size) {
      height = this.size.height;
    } else {
      height = 0;
    }

    this.size = { width, height };
    this.element.nativeElement.style.width = width + '%';
    this.element.nativeElement.children[4].innerHTML = this.size.width;
  }

  updateHeight(height: number) {
    let width;
    if (this.size) {
      width = this.size.width;
    } else {
      width = 0;
    }

    this.size = { width, height };
    this.element.nativeElement.style.height = height + '%';
    this.element.nativeElement.children[3].innerHTML = this.size.height;
  }

  setLeft(left: string) {
    this.element.nativeElement.style.left = left;
  }

  setTop(top: string) {
    this.element.nativeElement.style.top = top;
  }

  @HostListener('dragStart', ['$event'])
  onDragStart(event: PointerEvent) {
    const target = event.target as HTMLElement;
    if (target && target.classList && target.classList.contains('box')) {
      this.allowDrag = true;
    }

    this.startPosition = {
      x: event.clientX - this.position.x,
      y: event.clientY - this.position.y
    };
  }

  @HostListener('dragMove', ['$event'])
  onDragMove(event: PointerEvent) {
    if (!this.allowDrag) {
      return;
    }

    const dropzone = this.element.nativeElement.parentElement.getBoundingClientRect();
    const dropzoneWidth = dropzone.right - dropzone.left;
    const dropzoneHeight = dropzone.bottom - dropzone.top;

    const rect = this.element.nativeElement.getBoundingClientRect();
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;

    const left = this.calculatePercentage(event.clientX - dropzone.left - (width / 2), dropzoneWidth);
    const top = this.calculatePercentage(event.clientY - dropzone.top - (height / 2), dropzoneHeight);

    this.updatePosition({ x: left, y: top });
  }

  @HostListener('dragEnd', ['$event'])
  onDragEnd(event: PointerEvent) {
    this.allowDrag = false;
    if (this.reset) {
      this.position = { x: 0, y: 0 };
    }
  }

  calculatePercentage(box: number, zone: number): number {
    // return Math.floor(box / zone * 100 * 100) / 100
    return box / zone * 100;
  }
}

