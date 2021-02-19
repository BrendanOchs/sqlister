import { TestBed } from '@angular/core/testing';

import { HybridGuardService } from './hybrid-guard.service';

describe('HybridGuardService', () => {
  let service: HybridGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HybridGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
