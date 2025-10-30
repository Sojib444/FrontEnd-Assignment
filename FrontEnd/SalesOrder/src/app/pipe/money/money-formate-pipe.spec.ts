import { MoneyFormatePipe } from './money-formate-pipe';

describe('MoneyFormatePipe', () => {
  it('create an instance', () => {
    const pipe = new MoneyFormatePipe();
    expect(pipe).toBeTruthy();
  });
});
