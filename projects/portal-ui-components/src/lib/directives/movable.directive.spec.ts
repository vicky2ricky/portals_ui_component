import { MovableDirective } from './movable.directive';
import { Component, ElementRef, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';

@Component({
  template: `<div id ="fName" appMovable></div>`
})
class TestComponent {
}

interface Position {
  x: number;
  y: number;
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

describe('MovableDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let des;
  let elRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, MovableDirective],
      providers: [
        MovableDirective,
        { provide: ElementRef, useClass: MockElementRef }
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    des = TestBed.inject(MovableDirective);
    elRef = TestBed.inject(ElementRef);
  }));

  it('should create an instance', () => {
    expect(des).toBeTruthy();
  });

  it('updatePosition: should update positions', () => {
    const pos: Position = { x: 1, y: 2 };
    des.element = elRef;
    const slSpy = spyOn(des, 'setLeft').and.callFake(() => { });
    const stSpy = spyOn(des, 'setTop').and.callFake(() => { });

    des.updatePosition(pos);

    expect(des.position).toEqual(pos);
  });

  it('updateWidth: should update width when size is defined', () => {
    des.size = { width: 1, height: 2 };
    des.element = elRef;

    des.updateWidth(20);

    expect(des.size).toEqual({ width: 20, height: 2 });
  });

  it('updateWidth: should update width when size is undefined', () => {
    des.size = undefined;
    des.element = elRef;

    des.updateWidth(20);

    expect(des.size).toEqual({ width: 20, height: 0 });
  });

  it('updateHeight: should update height when size is defined', () => {
    des.size = { width: 1, height: 2 };
    des.element = elRef;

    des.updateHeight(20);

    expect(des.size).toEqual({ width: 1, height: 20 });
  });

  it('updateHeight: should update height when size is undefined', () => {
    des.size = undefined;
    des.element = elRef;

    des.updateHeight(20);

    expect(des.size).toEqual({ width: 0, height: 20 });
  });

  it('setLeft: should update left', () => {
    const left = '2';
    des.element = elRef;
    des.setLeft(left);

    expect(des.element.nativeElement.style.left).toEqual(left);
  });

  it('setTop: should update top', () => {
    const top = '2';
    des.element = elRef;
    des.setTop(top);

    expect(des.element.nativeElement.style.top).toEqual(top);
  });

  it('onDragStart: should call set startPosiiton', fakeAsync(() => {
    const event = new PointerEvent('dragStart', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    des.onDragStart(event);
    tick();
    expect(des.startPosition).toEqual({ x: 10, y: 30 });
  }));

  it('onDragMove: should return undefined for allowDrag false', () => {
    const event = new PointerEvent('dragmove', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    des.allowDrag = false;
    expect(des.onDragMove(event)).toEqual(undefined);
  });

  it('onDragMove: should set position', () => {
    const event = new PointerEvent('dragmove', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    des.allowDrag = true;

    des.onDragMove(event);

    expect(des.position).toEqual({ x: -50, y: 50 });
  });

  it('onDragEnd: should reset position', fakeAsync(() => {
    const event = new PointerEvent('dragStart', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    des.reset = true;

    des.onDragEnd(event);
    tick();
    expect(des.position).toEqual({ x: 0, y: 0 });
  }));

  it('calculatePercentage: shouldreturn percentage', () => {
    expect(des.calculatePercentage(20, 100)).toEqual(20);
  });

  it('ngOnInit: should call updateHeight and updateWidth', () => {
    const spy1 = spyOn(des, 'updateHeight').and.returnValue({});
    const spy2 = spyOn(des, 'updateWidth').and.returnValue({});
    des.ngOnInit();
    expect(des.updateHeight).toHaveBeenCalled();
    expect(des.updateWidth).toHaveBeenCalled();
  });

  it('ngOnChanges: should call updateHeight and updateWidth', () => {
    const spy = spyOn(des, 'updatePosition').and.returnValue({});

    des.ngOnChanges({
      setPosition: new SimpleChange(10, { get: 10, set: 10 }, false)
    });

    expect(des.updatePosition).toHaveBeenCalled();
  });
});
