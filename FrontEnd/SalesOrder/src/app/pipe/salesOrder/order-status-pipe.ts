import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '../../abstraction/model/SalesOrder';

@Pipe({
  name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {

  transform(value: string | number | OrderStatus): string {
    const statusNumber = Number(value);
    return OrderStatus[statusNumber] ?? 'Unknown';
  }

}
