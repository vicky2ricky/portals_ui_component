import { ResizableDirective } from './resizable.directive';
import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';

@Component({
  template: `<div id ="fName" resize></div>`
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
    appendChild: () => { }
  };
}

describe('ResizableDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let des;
  let elRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ResizableDirective],
      providers: [
        ResizableDirective,
        { provide: ElementRef, useClass: MockElementRef }
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    des = TestBed.inject(ResizableDirective);
    elRef = TestBed.inject(ElementRef);
    des.element = elRef;
  }));

  it('should create an instance', () => {
    expect(des).toBeTruthy();
  });

  it('onResize: should return undefined for allowResize false', () => {
    const event = new PointerEvent('resize', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    des.allowResize = false;
    expect(des.onResize(event)).toEqual(undefined);
  });

  it('onResize: should set properties for direction top', () => {
    const event = new PointerEvent('resize', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    des.data = {
      x: 5,
      y: 5,
      rect: {
        height: 10,
        width: 20,
        top: 30,
        left: 40
      },
      direction: 'top'
    };

    des.dropzone = {
      height: 10,
      width: 20,
      top: 30,
      left: 40
    };

    des.allowResize = true;
    des.onResize(event);

    expect(des.initialResize).toEqual(false);
  });

  it('onResize: should set properties for direction top-left', () => {
    const event = new PointerEvent('resize', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    des.data = {
      x: 5,
      y: 5,
      rect: {
        height: 10,
        width: 20,
        top: 30,
        left: 40
      },
      direction: 'top-left'
    };

    des.dropzone = {
      height: 10,
      width: 20,
      top: 30,
      left: 40
    };

    des.allowResize = true;
    des.onResize(event);

    expect(des.initialResize).toEqual(false);
  });

  it('onResize: should set properties for direction top-right', () => {
    const event = new PointerEvent('resize', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    des.data = {
      x: 5,
      y: 5,
      rect: {
        height: 10,
        width: 20,
        top: 30,
        left: 40
      },
      direction: 'top-right'
    };

    des.dropzone = {
      height: 10,
      width: 20,
      top: 30,
      left: 40
    };

    des.allowResize = true;
    des.onResize(event);

    expect(des.initialResize).toEqual(false);
  });

  it('onResize: should set properties for direction bottom', () => {
    const event = new PointerEvent('resize', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    des.data = {
      x: 5,
      y: 5,
      rect: {
        height: 10,
        width: 20,
        top: 30,
        left: 40
      },
      direction: 'bottom'
    };

    des.dropzone = {
      height: 10,
      width: 20,
      top: 30,
      left: 40
    };

    des.allowResize = true;
    des.onResize(event);

    expect(des.initialResize).toEqual(false);
  });

  it('onResize: should set properties for direction bottom-left', () => {
    const event = new PointerEvent('resize', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    des.data = {
      x: 5,
      y: 5,
      rect: {
        height: 10,
        width: 20,
        top: 30,
        left: 40
      },
      direction: 'bottom-left'
    };

    des.dropzone = {
      height: 10,
      width: 20,
      top: 30,
      left: 40
    };

    des.allowResize = true;
    des.onResize(event);

    expect(des.initialResize).toEqual(false);
  });

  it('onResize: should set properties for direction bottom-right', () => {
    const event = new PointerEvent('resize', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    des.data = {
      x: 5,
      y: 5,
      rect: {
        height: 10,
        width: 20,
        top: 30,
        left: 40
      },
      direction: 'bottom-right'
    };

    des.dropzone = {
      height: 10,
      width: 20,
      top: 30,
      left: 40
    };

    des.allowResize = true;
    des.onResize(event);

    expect(des.initialResize).toEqual(false);
  });

  it('onResize: should set properties for direction left', () => {
    const event = new PointerEvent('resize', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    des.data = {
      x: 5,
      y: 5,
      rect: {
        height: 10,
        width: 20,
        top: 30,
        left: 40
      },
      direction: 'left'
    };

    des.dropzone = {
      height: 10,
      width: 20,
      top: 30,
      left: 40
    };

    des.allowResize = true;
    des.onResize(event);

    expect(des.initialResize).toEqual(false);
  });

  it('onResize: should set properties for direction right', () => {
    const event = new PointerEvent('resize', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);
    des.data = {
      x: 5,
      y: 5,
      rect: {
        height: 10,
        width: 20,
        top: 30,
        left: 40
      },
      direction: 'right'
    };

    des.dropzone = {
      height: 10,
      width: 20,
      top: 30,
      left: 40
    };

    des.allowResize = true;
    des.onResize(event);

    expect(des.initialResize).toEqual(false);
  });

  it('onDragEnd: should allowResize to false', () => {
    const event = new PointerEvent('resize', { clientX: 10, clientY: 30 });
    event.initEvent('PointerEvent', false, false);

    des.onDragEnd(event);

    expect(des.allowResize).toEqual(false);
  });

  it('createNode: should create node', () => {
    des.nodes = [];
    des.createNode('left');

    expect(des.nodes.length).toEqual(1);
  });

  it('calculatePercentage: shouldreturn percentage', () => {
    expect(des.calculatePercentage(20, 100)).toEqual(20);
  });
});
