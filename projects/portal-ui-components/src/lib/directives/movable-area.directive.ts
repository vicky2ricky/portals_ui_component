import { AfterContentInit, ContentChildren, Directive, ElementRef, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { MovableDirective } from './movable.directive';
import { ResizableDirective } from './resizable.directive';

interface Boundaries {
  min: number;
  max: number;
}

@Directive({
  selector: '[appMovableArea]'
})
export class MovableAreaDirective implements AfterContentInit {
  @ContentChildren(MovableDirective) movables: QueryList<MovableDirective>;
  @ContentChildren(ResizableDirective) resizables: QueryList<ResizableDirective>;

  private boundaries: Boundaries = { min: 0, max: 100 };
  private subscriptions: Subscription[] = [];
  private rect: ClientRect;
  private movableRect: ClientRect;

  movableWidthPercentage: number;
  movableHeightPercentage: number;

  constructor(private element: ElementRef) {
    this.rect = this.element.nativeElement.getBoundingClientRect();
  }

  ngAfterContentInit(): void {
    this.movables.changes.subscribe(() => {
      this.subscriptions.forEach(s => s.unsubscribe());
      this.movables.forEach(movable => {
        this.subscriptions.push(movable.dragStart.subscribe(() => {
          this.measureBoundaries(movable);
        }));

        this.subscriptions.push(movable.dragMove.subscribe(() => {
          this.maintainBoundaries(movable);
        }));
      });
    });

    this.resizables.changes.subscribe(() => {
      this.subscriptions.forEach(s => s.unsubscribe());

      this.resizables.forEach(resizable => {
        this.subscriptions.push(resizable.dragStart.subscribe(() => {
          this.measureBoundaries(resizable);
        }));

        this.subscriptions.push(resizable.resize.subscribe(() => {
          this.measureBoundaries(resizable);
          this.maintainBoundaries(resizable);
        }));
      });
    });

    this.movables.notifyOnChanges();
    this.resizables.notifyOnChanges();
  }

  private measureBoundaries(movable: MovableDirective) {
    this.rect = this.element.nativeElement.getBoundingClientRect();
    this.movableRect = movable.element.nativeElement.getBoundingClientRect();

    this.movableWidthPercentage = this.movableRect.width / this.rect.width * 100;
    this.movableHeightPercentage = this.movableRect.height / this.rect.height * 100;
  }

  private maintainBoundaries(movable: MovableDirective) {
    if (movable.position.x + this.movableWidthPercentage >= this.boundaries.max) {
      movable.updatePosition({ x: this.boundaries.max - this.movableWidthPercentage, y: movable.position.y });
    }

    if (movable.position.y + this.movableHeightPercentage >= this.boundaries.max) {
      movable.updatePosition({ x: movable.position.x, y: this.boundaries.max - this.movableHeightPercentage });
    }

    if (movable.position.x <= this.boundaries.min) {
      movable.updatePosition({ x: this.boundaries.min, y: movable.position.y });
    }

    if (movable.position.y <= this.boundaries.min) {
      movable.updatePosition({ x: movable.position.x, y: this.boundaries.min });
    }

    if (this.movableWidthPercentage >= this.boundaries.max) {
      movable.updateWidth(this.boundaries.max);
    }

    if (this.movableHeightPercentage >= this.boundaries.max) {
      movable.updateHeight(this.boundaries.max);
    }

  }
}
