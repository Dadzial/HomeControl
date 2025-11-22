import { TestBed } from '@angular/core/testing';

import { Co2ServiceService } from './co2-service.service';

describe('Co2ServiceService', () => {
  let service: Co2ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Co2ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
