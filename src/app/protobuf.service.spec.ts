import { TestBed } from '@angular/core/testing';

import { ProtobufService } from './protobuf.service';

describe('ProtobufService', () => {
  let service: ProtobufService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtobufService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
