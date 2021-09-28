import { TestBed } from '@angular/core/testing';

import { ZoneSettingsService } from './zone-settings.service';

describe('ZoneSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ZoneSettingsService = TestBed.inject(ZoneSettingsService);
    expect(service).toBeTruthy();
  });
});
