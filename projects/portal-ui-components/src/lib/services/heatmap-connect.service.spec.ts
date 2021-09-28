import { TestBed } from '@angular/core/testing';

import { HeatmapConnectService } from './heatmap-connect.service';

describe('HeatmapConnectService', () => {
  let service: HeatmapConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeatmapConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
