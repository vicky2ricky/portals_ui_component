import { ClickService } from './click.service';
import { TestBed } from '@angular/core/testing';

describe('ConnectService', () => {
  let service: ClickService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClickService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
