import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneyFormate'
})
export class MoneyFormatePipe implements PipeTransform {

  transform(value: number): string {
    return `৳ ${Math.round(value)}`
  }

}
