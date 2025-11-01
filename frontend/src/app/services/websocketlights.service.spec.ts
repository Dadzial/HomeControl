import { TestBed } from '@angular/core/testing';

import { WebsocketlightsService } from './websocketlights.service';

describe('WebsocketlightsService', () => {
  let service: WebsocketlightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketlightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
