import { DroppableDirective } from './droppable.directive';
import { Component } from '@angular/core';
import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DroppableService } from '../services/droppable.service';

@Component({
  template: `<div id ="fName" appDroppable></div>`
})
class TestComponent {
}

describe('DroppableDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let service: DroppableService;
  let des;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, DroppableDirective],
      providers: [DroppableService, DroppableDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    des = TestBed.inject(DroppableDirective);
    service = TestBed.inject(DroppableService);
  }));

  it('should create an instance', () => {
    expect(des).toBeTruthy();
  });

  it('onDragStart: should call onDragStart from DroppableService', fakeAsync(() => {
    const spy = spyOn(service, 'onDragStart').and.callFake(() => { });
    const event = new PointerEvent('drag');
    event.initEvent('PointerEvent', false, false);

    des.onDragStart(event);
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('onDragMove: should call onDragMove from DroppableService', fakeAsync(() => {
    const spy = spyOn(service, 'onDragMove').and.callFake(() => { });
    const event = new PointerEvent('drag');
    event.initEvent('PointerEvent', false, false);

    des.onDragMove(event);
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('onDragEnd: should call onDragEnd from DroppableService', fakeAsync(() => {
    const spy = spyOn(service, 'onDragEnd').and.callFake(() => { });
    const event = new PointerEvent('drag');
    event.initEvent('PointerEvent', false, false);

    des.onDragEnd(event);
    tick();
    expect(spy).toHaveBeenCalled();
  }));
});
