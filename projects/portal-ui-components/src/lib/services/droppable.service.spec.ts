import { TestBed, async, tick, fakeAsync } from '@angular/core/testing';

import { DroppableService } from './droppable.service';

describe('DroppableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DroppableService = TestBed.inject(DroppableService);
    expect(service).toBeTruthy();
  });

  it('onDragStart: should do a next on dragStartSubject from self', fakeAsync(() => {
    const service: DroppableService = TestBed.inject(DroppableService);
    const event = new PointerEvent('drag');
    event.initEvent('PointerEvent', false, false);

    const sub = service.dragStart$.subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    service.onDragStart(event);
    tick();

  }));

  it('onDragStart: should do a next on dragStartSubject from self and parent', fakeAsync(() => {
    const parent: DroppableService = TestBed.inject(DroppableService);
    const service: DroppableService = new DroppableService(parent);
    const event = new PointerEvent('drag');
    event.initEvent('PointerEvent', false, false);

    const selfSub = service.dragStart$.subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    const parfSub = parent.dragStart$.subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    service.onDragStart(event);
    tick();

  }));

  it('onDragMove: should do a next on dragMoveSubject from self', fakeAsync(() => {
    const service: DroppableService = TestBed.inject(DroppableService);
    const event = new PointerEvent('drag');
    event.initEvent('PointerEvent', false, false);

    const sub = service.dragMove$.subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    service.onDragMove(event);
    tick();

  }));

  it('onDragMove: should do a next on dragMoveSubject from self and parent', fakeAsync(() => {
    const parent: DroppableService = TestBed.inject(DroppableService);
    const service: DroppableService = new DroppableService(parent);
    const event = new PointerEvent('drag');
    event.initEvent('PointerEvent', false, false);

    const selfSub = service.dragMove$.subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    const parfSub = parent.dragMove$.subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    service.onDragMove(event);
    tick();

  }));

  it('onDragEnd: should do a next on dragEndSubject from self', fakeAsync(() => {
    const service: DroppableService = TestBed.inject(DroppableService);
    const event = new PointerEvent('drag');
    event.initEvent('PointerEvent', false, false);

    const sub = service.dragEnd$.subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    service.onDragEnd(event);
    tick();

  }));

  it('onDragEnd: should do a next on dragEndSubject from self and parent', fakeAsync(() => {
    const parent: DroppableService = TestBed.inject(DroppableService);
    const service: DroppableService = new DroppableService(parent);
    const event = new PointerEvent('drag');
    event.initEvent('PointerEvent', false, false);

    const selfSub = service.dragEnd$.subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    const parfSub = parent.dragEnd$.subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    service.onDragEnd(event);
    tick();

  }));

  it('onResize: should do a next on resizeSubject from self', fakeAsync(() => {
    const service: DroppableService = TestBed.inject(DroppableService);
    const event = new PointerEvent('resize');
    event.initEvent('PointerEvent', false, false);

    const sub = service.resize$.subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    service.onResize(event);
    tick();

  }));

  it('onResize: should do a next on resizeSubject from self and parent', fakeAsync(() => {
    const parent: DroppableService = TestBed.inject(DroppableService);
    const service: DroppableService = new DroppableService(parent);
    const event = new PointerEvent('resize');
    event.initEvent('PointerEvent', false, false);

    const selfSub = service.resize$.subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    const parfSub = parent.resize$.subscribe(resp => {
      expect(resp).toBeTruthy();
    });

    service.onResize(event);
    tick();

  }));
});
