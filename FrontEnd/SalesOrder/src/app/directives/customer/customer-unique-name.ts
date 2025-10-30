import { Directive, ElementRef, inject, output, Output, Renderer2 } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, fromEvent, map, of, switchMap } from 'rxjs';
import { CustomerService } from '../../services/customer/customer';

@Directive({
  selector: '[customerUniqueName]'
})
export class CustomerUniqueName {

  duplicateCheck = output<boolean>();
  customerService = inject(CustomerService);

  constructor(private el: ElementRef) {
    this.initListener();
  }

  private initListener() {
    fromEvent(this.el.nativeElement, 'input')
      .pipe(
        debounceTime(200),
        map((e: any) => e.target.value.trim()),
        map(value => {
          if (!value) return false;
          let customer = this.customerService.customers().find(x => x.Name == value);
          if (customer)
            return true;
          return false;
        })
      )
      .subscribe(res => {
        this.duplicateCheck.emit(res);
      });
  }
}
