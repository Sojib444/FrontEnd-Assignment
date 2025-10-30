import { TestBed } from '@angular/core/testing';

import { SalesOrderServices } from './sales-order';

describe('SalesOrder', () => {
  let service: SalesOrderServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesOrderServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
