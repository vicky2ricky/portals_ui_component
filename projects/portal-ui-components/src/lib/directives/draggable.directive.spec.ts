import { DraggableDirective } from './draggable.directive';
import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';

@Component({
  template: `<div id ="fName" appDraggable></div>`
})
class TestComponent {
}

class MockElementRef extends ElementRef {
  constructor() { super(undefined); }
  // nativeElement = {};
}

describe('DraggableDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let des;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, DraggableDirective],
      providers: [
        DraggableDirective,
        { provide: ElementRef, useClass: MockElementRef }
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    des = TestBed.inject(DraggableDirective);
  }));

  it('should create an instance', () => {
    expect(des).toBeTruthy();
  });

  it('onPointerDown: should emit dragStart', fakeAsync(() => {
    const event = new PointerEvent('pointerdown');
    event.initEvent('PointerEvent', false, false);

    const dragStartEvent = des.dragStart.subscribe(res => {
      expect(res).toBeTruthy();
    });
    tick();
    des.onPointerDown(event);
  }));

  it('onPointerMove: should emit dragMove and resize', fakeAsync(() => {
    const event = new PointerEvent('pointermove');
    event.initEvent('PointerEvent', false, false);

    const dragMoveEvent = des.dragMove.subscribe(res => {
      expect(res).toBeTruthy();
    });

    const resizeEvent = des.resize.subscribe(res => {
      expect(res).toBeTruthy();
    });

    tick();
    des.onPointerMove(event);
  }));

  it('onPointerMove: should emit dragMove and resize for dragging event', fakeAsync(() => {
    const event = new PointerEvent('pointermove');
    event.initEvent('PointerEvent', false, false);
    des.pointerId = event.pointerId;
    des.dragging = true;

    const dragMoveEvent = des.dragMove.subscribe(res => {
      expect(res).toBeTruthy();
    });

    const resizeEvent = des.resize.subscribe(res => {
      expect(res).toBeTruthy();
    });

    tick();
    des.onPointerMove(event);
  }));

  it('onPointerUp: should emit dragEnd', fakeAsync(() => {
    const event = new PointerEvent('pointercancel');
    event.initEvent('PointerEvent', false, false);

    const dragEndEvent = des.dragEnd.subscribe(res => {
      expect(res).toBeTruthy();
    });
    tick();
    des.onPointerUp(event);
  }));

  it('onPointerUp: should emit dragEnd for pointer cancel/up', fakeAsync(() => {
    const event = new PointerEvent('pointercancel');
    event.initEvent('PointerEvent', false, false);
    des.pointerId = event.pointerId;
    des.dragging = true;

    const dragEndEvent = des.dragEnd.subscribe(res => {
      expect(res).toBeTruthy();
    });
    tick();
    des.onPointerUp(event);
  }));

});
