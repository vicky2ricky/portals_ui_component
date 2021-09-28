import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('openSidebar: should emit isExpanded', fakeAsync(() => {
    const sub = service.getMessage().subscribe(resp => {
      expect(resp).toEqual({ isExpanded: true });
    });
    service.openSidebar(true);
    tick();
  }));

  it('showSidebar: should emit isShow', fakeAsync(() => {
    const sub = service.getMessage().subscribe(resp => {
      expect(resp).toEqual({ isShow: true });
    });
    service.showSidebar(true);
    tick();
  }));

  it('isTruePrompt: should emit isTrue', fakeAsync(() => {
    const sub = service.getMessage().subscribe(resp => {
      expect(resp).toEqual({ isTrue: true });
    });
    service.isTruePrompt(true);
    tick();
  }));

  it('closeSidebar: should emit undefined', fakeAsync(() => {
    const sub = service.getMessage().subscribe(resp => {
      expect(resp).toEqual(undefined);
    });
    service.closeSidebar();
    tick();
  }));
});
