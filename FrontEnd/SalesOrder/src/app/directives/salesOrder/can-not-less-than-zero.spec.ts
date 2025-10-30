import { ElementRef } from '@angular/core';
import { CanNotLessThanZero } from './can-not-less-than-zero';

describe('CanNotLessThanZero', () => {
  it('should create an instance', () => {
    const elMock = new ElementRef(document.createElement('input'));
    const directive = new CanNotLessThanZero(elMock);
    expect(directive).toBeTruthy();
  });
});
