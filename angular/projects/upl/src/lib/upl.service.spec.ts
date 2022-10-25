import { TestBed } from '@angular/core/testing';

import { UplService } from './upl.service';

describe('UplService', () => {
  let service: UplService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UplService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
