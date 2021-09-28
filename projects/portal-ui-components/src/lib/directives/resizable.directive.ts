import { Directive, OnInit, Inject, ElementRef, Input, HostListener, OnDestroy } from '@angular/core';
import { MovableDirective } from './movable.directive';


@Directive({
  selector: '[resize]' // Attribute selector
})

export class ResizableDirective extends MovableDirective implements OnInit, OnDestroy {

  private nodes = [];
  private limit = 12.5;
  private edgeLimits = { left: 0.10, top: 0.10 };
  private data: { x: number, y: number, rect: ClientRect, direction: string };

  private dropzone;
  private allowResize = false;
  private initialResize = true;

  constructor(@Inject(ElementRef) element: ElementRef) {
    super(element);
  }

  @Input()
  public resizeToggle = true;

  @HostListener('resize', ['$event'])
  onResize(event: PointerEvent) {
    if (!this.allowResize) {
      return;
    }

    const { height, width, top, left } = this.data.rect;
    const offset_y = this.data.y - event.clientY;
    const offset_x = this.data.x - event.clientX;
    const set: { [key: string]: number } = {};

    switch (this.data.direction) {
      case 'top':
        set.height = this.calculatePercentage(height + offset_y, this.dropzone.height);
        set.top = this.calculatePercentage(event.clientY - this.dropzone.top, this.dropzone.height);
        break;

      case 'top-left':
        set.top = this.calculatePercentage(event.clientY - this.dropzone.top, this.dropzone.height);
        set.left = this.calculatePercentage(event.clientX - this.dropzone.left, this.dropzone.width);
        set.height = this.calculatePercentage(height + offset_y, this.dropzone.height);
        set.width = this.calculatePercentage(width + offset_x, this.dropzone.width);

        break;
      case 'top-right':
        set.height = this.calculatePercentage(height + offset_y, this.dropzone.height);
        set.top = this.calculatePercentage(event.clientY - this.dropzone.top, this.dropzone.height);
        set.width = this.calculatePercentage(width - offset_x, this.dropzone.width);

        break;

      case 'bottom':
        set.height = this.calculatePercentage(height - offset_y, this.dropzone.height);

        break;
      case 'bottom-left':
        set.height = this.calculatePercentage(height - offset_y, this.dropzone.height);
        set.width = this.calculatePercentage(width + offset_x, this.dropzone.width);
        set.left = this.calculatePercentage(event.clientX - this.dropzone.left, this.dropzone.width);

        break;
      case 'bottom-right':
        set.height = this.calculatePercentage(height - offset_y, this.dropzone.height);
        set.width = this.calculatePercentage(width - offset_x, this.dropzone.width);

        break;

      case 'left':
        set.width = this.calculatePercentage(width + offset_x, this.dropzone.width);
        set.left = this.calculatePercentage(event.clientX - this.dropzone.left, this.dropzone.width);

        break;

      case 'right':
        set.width = this.calculatePercentage(width - offset_x, this.dropzone.width);
        break;
    }

    this.initialResize = false;

    if (set.width < this.limit) {
      delete set.width;
      delete set.left;
    }

    if (set.height < this.limit) {
      delete set.height;
      delete set.top;
    }

    if (set.left) {
      if (this.edgeLimitReached('left', set.left)) {
        return;
      }

      this.updatePosition({
        x: set.left,
        y: this.calculatePercentage(this.data.rect.top - this.dropzone.top, this.dropzone.height)
      });
    }

    if (set.top) {
      if (this.edgeLimitReached('top', set.top)) {
        return;
      }

      this.updatePosition({
        x: set.left ? set.left : this.calculatePercentage(this.data.rect.left - this.dropzone.left, this.dropzone.width),
        y: set.top
      });
    }

    if (set.height && this.eventIsInside(event)) {
      this.updateHeight(set.height);
    }

    if (set.width && this.eventIsInside(event)) {
      this.updateWidth(set.width);
    }
  }

  onDragStart(event: PointerEvent) {
    const el = event.target as HTMLElement;
    if (el.classList.contains('border')) {
      this.allowResize = true;
      this.initialResize = true;

      const rect = this.element.nativeElement.getBoundingClientRect();
      this.data = {
        x: event.clientX,
        y: event.clientY,
        rect,
        direction: el.className.match(/border-([^ ]+)/)[1]
      };
    }
    super.onDragStart(event);
  }

  onDragEnd(event: PointerEvent) {
    this.allowResize = false;
    super.onDragEnd(event);
  }

  createNode(side) {
    const node = document.createElement('div');
    node.classList.add('border-' + side, 'border');
    this.element.nativeElement.appendChild(node);
    this.nodes.push(node);
  }

  ngOnInit() {
    ['top', 'top-left', 'top-right', 'left', 'right', 'bottom', 'bottom-left', 'bottom-right'].forEach(this.createNode.bind(this));
    this.dropzone = this.element.nativeElement.closest('.dropzone').getBoundingClientRect();
  }

  ngOnDestroy() {
    this.nodes.forEach(n => n.remove());
  }

  private edgeLimitReached(edge, percent) {
    const style = this.element.nativeElement.style;

    if (edge === 'top') {
      return percent < this.edgeLimits.top;
    }

    if (edge === 'left') {
      return percent < this.edgeLimits.left;
    }
  }

  private eventIsInside(event: PointerEvent) {
    return event.clientX <= this.dropzone.right && event.clientY <= this.dropzone.bottom;
  }
}
