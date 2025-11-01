import { Directive, ElementRef, inject, output } from '@angular/core';
import { debounceTime, fromEvent, map } from 'rxjs';
import { SalesOrderService } from '../../services/salesOrders/sales-orderService';

@Directive({
  selector: '[OrderNumberUniqueness]',
})
export class OrderNumberUniqueness {

 duplicateCheck = output<boolean>();
 salesOrderService = inject(SalesOrderService);

  constructor(private el: ElementRef) {
    this.initListener();
    this.salesOrderService.loadSalesOrders().subscribe(data => {
      this.salesOrderService.salesOrders.set(data);
    });
  }

  private initListener() {
    fromEvent(this.el.nativeElement, 'input')
      .pipe(
        debounceTime(200),
        map((e: any) => e.target.value.trim()),
        map(value => {
          if (!value)
            return false;
          let salesOrder = this.salesOrderService.salesOrders().find(x => x.orderNo == value);
          if (salesOrder)
            return true;
          return false;
        })
      )
      .subscribe(res => {
        this.duplicateCheck.emit(res);
      });
  }
}
