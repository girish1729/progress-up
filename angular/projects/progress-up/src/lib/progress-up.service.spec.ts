import { TestBed } from '@angular/core/testing';

import { ProgressUpService } from './progress-up.service';

describe('ProgressUpService', () => {
  let service: ProgressUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
