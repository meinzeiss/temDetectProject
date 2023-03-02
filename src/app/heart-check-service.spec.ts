import { TestBed } from '@angular/core/testing';

import { HeartCheckService } from './heart-check-service';

describe('HeartCheckServiceService', () => {
  let service: HeartCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeartCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
