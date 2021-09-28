import { Component, ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MovableAreaDirective } from './movable-area.directive';
import { MovableDirective } from './movable.directive';

@Component({
  template: `<div id ="fName" appMovableArea></div>`
})
class TestComponent {
}

class MockElementRef extends ElementRef {
  constructor() { super(undefined); }
  nativeElement = {
    style: {
      left: 0,
      top: 0
    },
    children: [{ innerHTML: {} }, { innerHTML: {} }, { innerHTML: {} }, { innerHTML: {} }],
    parentElement: {
      getBoundingClientRect: () => {
        return {
          left: 10,
          right: 20,
          bottom: 30,
          top: 40
        };
      }
    },
    getBoundingClientRect: () => {
      return {
        left: 20,
        right: 30,
        bottom: 40,
        top: 50
      };
    }
  };
}

describe('MovableAreaDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let des;
  let elRef;
  let movable;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, MovableAreaDirective],
      providers: [
        MovableAreaDirective,
        { provide: ElementRef, useClass: MockElementRef },
        MovableDirective
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    des = TestBed.inject(MovableAreaDirective);
    elRef = TestBed.inject(ElementRef);
    movable = TestBed.inject(MovableDirective);
  }));


  it('should create an instance', () => {
    expect(des).toBeTruthy();
  });

  it('measureBoundaries: should set movableWidthPercentage and movableHeightPercentage', () => {
    movable.element = elRef;
    des.element = elRef;
    des.measureBoundaries(movable);

    expect(des.movableWidthPercentage).toEqual(NaN);
    expect(des.movableHeightPercentage).toEqual(NaN);
  });

  it('maintainBoundaries: should call methods from movable directive part#1', () => {
    const spy = spyOn(movable, 'updatePosition').and.returnValue({ x: 10, y: 20 });
    movable.element = elRef;
    des.element = elRef;
    des.maintainBoundaries(movable);

    expect(movable.updatePosition).toHaveBeenCalled();
  });

  it('maintainBoundaries: should call methods from movable directive part#2', () => {
    const spy = spyOn(movable, 'updatePosition').and.returnValue({ x: 10, y: 20 });
    movable.element = elRef;
    des.element = elRef;
    movable.position.x = 10;
    des.movableWidthPercentage = 20;
    des.boundaries.max = 10;
    des.maintainBoundaries(movable);

    expect(movable.updatePosition).toHaveBeenCalled();
  });

  it('maintainBoundaries: should call methods from movable directive part#2', () => {
    const spy = spyOn(movable, 'updatePosition').and.returnValue({ x: 10, y: 20 });
    movable.element = elRef;
    des.element = elRef;
    movable.position.y = 10;
    des.movableHeightPercentage = 20;
    des.boundaries.max = 10;
    des.maintainBoundaries(movable);

    expect(movable.updatePosition).toHaveBeenCalled();
  });
});
