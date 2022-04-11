import { TestBed } from '@angular/core/testing';

import { LocalLinksDataBrokerService } from './local-links-data-broker.service';

describe('LocalLinksDataBrokerService', () => {
  let service: LocalLinksDataBrokerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalLinksDataBrokerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
