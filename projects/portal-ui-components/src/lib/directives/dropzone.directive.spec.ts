import { DropzoneDirective } from './dropzone.directive';
import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DroppableService } from '../services/droppable.service';

@Component({
  template: `<div id ="fName" appDropzone></div>`
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
    appendChild: () => { },
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

describe('DropzoneDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let service: DroppableService;
  let innerDS: DroppableService;
  let des;
  let elRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, DropzoneDirective],
      providers: [
        DroppableService,
        DropzoneDirective,
        { provide: ElementRef, useClass: MockElementRef }]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(DroppableService);
    innerDS = TestBed.inject(DroppableService);
    elRef = TestBed.inject(ElementRef);
    des = new DropzoneDirective(service, innerDS, elRef);
  }));

  it('should create an instance', () => {
    expect(des).toBeTruthy();
  });

  it('onPointerEnter: should set enterd to true', () => {
    des.activated = true;
    des.onPointerEnter();
    expect(des.entered).toBeTruthy();
  });

  it('onPointerEnter: should return enterd as false for activated false', () => {
    des.activated = false;
    des.onPointerEnter();
    expect(des.entered).toBeFalsy();
  });

  it('onPointerLeave: should set enterd to true', () => {
    des.activated = true;
    des.onPointerLeave();
    expect(des.entered).toBeFalsy();
  });

  it('onPointerLeave: should return enterd as false for activated false', () => {
    des.activated = false;
    des.onPointerLeave();
    expect(des.entered).toBeFalsy();
  });

  it('onDragStart: should set activated as true', () => {
    des.onDragStart();
    expect(des.activated).toBeTruthy();
  });

  it('onDragEnd: should set activated and entered as fasle', () => {
    des.activated = false;
    des.onDragEnd();
    expect(des.activated).toBeFalsy();
    expect(des.entered).toBeFalsy();
  });

  it('onDragEnd: should emit from drop', () => {
    des.entered = true;
    des.activated = true;
    des.clientRect = {
      left: 40,
      top: 20,
      width: 30,
      height: 40
    };
    const event = new PointerEvent('onDragEnd', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);

    const drop = des.drop.subscribe(resp => {
      expect(resp).toEqual({ event, x: -100, y: 25 });
    });

    des.onDragEnd(event);
    expect(des.activated).toBeFalsy();
    expect(des.entered).toBeFalsy();
  });

  it('onInnerDragStart: should set activated and entered as true', () => {
    des.onInnerDragStart();
    expect(des.activated).toBeTruthy();
    expect(des.entered).toBeTruthy();
  });

  it('onInnerDragEnd: should emit from remove if entered is false', () => {
    des.enetered = false;
    const event = new PointerEvent('onInnerDragEnd', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    des.onInnerDragEnd(event);
    expect(des.activated).toBeFalsy();
    expect(des.entered).toBeFalsy();
  });

  it('isEventInside: should return true or false', () => {
    des.clientRect = {
      left: 40,
      top: 30,
      bottom: 50,
      right: 60
    };
    const event = new PointerEvent('onInnerDragEnd', { clientX: 50, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    expect(des.isEventInside(event)).toBeTruthy();
  });
});
