import { TestBed } from '@angular/core/testing';

import { CustomAppInitService } from './custom-app-init.service';

describe('CustomAppInitService', () => {
  let service: CustomAppInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomAppInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
