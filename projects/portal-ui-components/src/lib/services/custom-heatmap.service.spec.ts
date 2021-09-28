import { TestBed } from '@angular/core/testing';

import { CustomHeatmapService } from './custom-heatmap.service';

describe('CustomHeatmapService', () => {
  let service: CustomHeatmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomHeatmapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
