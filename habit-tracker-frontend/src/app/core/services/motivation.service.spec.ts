import { TestBed } from '@angular/core/testing';

import { MotivationService } from './motivation.service';

describe('MotivationService', () => {
  let service: MotivationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotivationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
