import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { GraphService } from './graph.service';

describe('GraphService', () => {
  let service: GraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphService]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(GraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setData: should set data', fakeAsync(() => {
    const data = { dummy: 'dummy' };
    const sub = service.graphDataSubject.subscribe(resp => {
      expect(resp).toEqual(data);
    });

    service.setData(data);
    tick();
  }));

  it('getData: should return data', fakeAsync(() => {
    const data = ['dummy'];
    service.setData(data);
    tick();

    expect(service.getData()).toBeTruthy();
  }));

  it('resetGraphData: should clear everything', () => {
    service.resetGraphData();

    expect(service.graphDataCollection).toEqual([]);
    expect(service.graphDataServiceSubjectCollection).toEqual([]);
    expect(service.graphPointsUnitsCollection.size).toEqual(0);
    expect(service.graphPointsEnumCollection.size).toEqual(0);
  });
});
