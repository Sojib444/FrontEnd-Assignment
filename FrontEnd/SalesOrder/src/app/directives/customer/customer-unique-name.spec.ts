import { ElementRef } from '@angular/core';
import { CustomerUniqueName } from './customer-unique-name';

describe('CustomerUniqueName', () => {
  it('should create an instance', () => {
    const elMock = new ElementRef(document.createElement('input'));
    const directive = new CustomerUniqueName(elMock);
    expect(directive).toBeTruthy();
  });
});
