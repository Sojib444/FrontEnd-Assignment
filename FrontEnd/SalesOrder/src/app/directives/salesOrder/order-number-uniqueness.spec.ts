import { ElementRef } from '@angular/core';
import { OrderNumberUniqueness } from './order-number-uniqueness';

describe('OrderNumberUniqueness', () => {
  it('should create an instance', () => {
    const elMock = new ElementRef(document.createElement('input'));
    const directive = new OrderNumberUniqueness(elMock);
    expect(directive).toBeTruthy();
  });
});
