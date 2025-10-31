import { computed, inject, Pipe, PipeTransform } from '@angular/core';
import { SalesOrderService } from '../../services/salesOrders/sales-orderService';

@Pipe({
  name: 'customerName'
})
export class CustomerNamePipe implements PipeTransform {

  salesOrderService = inject(SalesOrderService);

  customers = computed(()=>
  {
    return this.salesOrderService.customers();
  })
  transform(id: string): string {
    if(!id)
       return `Guest Customer`;
    const customer = this.salesOrderService.customers().find(x => x.Id == id )
    if(customer)
      return customer.Name
    return `Guest Customer`;
  }

}
