import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setData: should set data', fakeAsync(() => {
    const sub = service.getData();
    const data = 'hello';
    service.setData(data);
    tick();
    sub.subscribe(resp => {
      expect(resp).toEqual(data);
    });
  }));

  it('setId: should set id', fakeAsync(() => {
    const sub = service.getId();
    const data = 'hello';
    service.setId(data);
    tick();
    sub.subscribe(resp => {
      expect(resp).toEqual(data);
    });
  }));

  it('clearData: should return null', fakeAsync(() => {
    const sub = service.getId();
    service.clearData();
    tick();
    sub.subscribe(resp => {
      expect(resp).toEqual(null);
    });
  }));
});
