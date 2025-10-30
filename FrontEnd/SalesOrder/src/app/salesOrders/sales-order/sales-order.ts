import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { OrderNumberUniqueness } from '../../directives/salesOrder/order-number-uniqueness';
import { SalesOrderService } from '../../services/salesOrders/sales-orderService';
import { CanNotLessThanZero } from '../../directives/salesOrder/can-not-less-than-zero';

@Component({
  selector: 'app-sales-order',
  imports: [ReactiveFormsModule,OrderNumberUniqueness, CanNotLessThanZero],
  templateUrl: './sales-order.html',
  styleUrl: './sales-order.css',
  standalone: true,
})
export class SalesOrder {
  hasOrderNoExists: boolean = false;
  vatError: boolean = false;
  discountError: boolean = false;
  form!: FormGroup;
  salesOrderService = inject(SalesOrderService)
  selectedCustomerType: string = "existing"

  constructor(private formBuilder: FormBuilder)
  {
    this.salesOrderService.loadData();

    this.form = new FormGroup({
      orderNo: new FormControl('', Validators.required),
      orderDate: new FormControl(this.getToday(), Validators.required),
      customerType : new FormControl("existing"),
      customerExist: new FormControl(null),
      customerNew: new FormControl(),
      orderStatus: new FormControl(null, Validators.required),
      vat: new FormControl(0),
      discount: new FormControl(0)
    })
  }

  getToday(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // "2025-10-31"
  }

  onSeletedCustomerType(event : Event)
  {
    console.log(event);
  }

  hasOrderNo(event: boolean)
  {
      this.hasOrderNoExists = event;
  }

  hasVatError(event : boolean)
  {
    this.vatError = event;
  }

  hasDiscountError(event : boolean)
  {
    this.discountError = event;
  }
}
