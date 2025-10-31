import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { OrderNumberUniqueness } from '../../directives/salesOrder/order-number-uniqueness';
import { SalesOrderService } from '../../services/salesOrders/sales-orderService';
import { CanNotLessThanZero } from '../../directives/salesOrder/can-not-less-than-zero';
import { from } from 'rxjs';
import { Customer as CustomerData } from '../../abstraction/model/customer';

@Component({
  selector: 'app-sales-order',
  imports: [ReactiveFormsModule, OrderNumberUniqueness, CanNotLessThanZero],
  templateUrl: './sales-order.html',
  styleUrl: './sales-order.css',
  standalone: true,
})
export class SalesOrder {
  hasOrderNoExists: boolean = false;
  vatError: boolean = false;
  discountError: boolean = false;
  quantityError: boolean = false;
  form!: FormGroup;
  salesOrderService = inject(SalesOrderService)
  selectedCustomerType: string = "existing"

  constructor(private formBuilder: FormBuilder) {
    this.salesOrderService.loadcustomers().subscribe(data => {
      this.salesOrderService.customers.set(data);
    })

    this.salesOrderService.loadProducts().subscribe(data => {
      this.salesOrderService.products.set(data);
    })

    this.form = new FormGroup({
      id: new FormControl(''),
      orderNo: new FormControl('', Validators.required),
      orderDate: new FormControl(this.getToday(), Validators.required),
      customerType: new FormControl("existing"),
      customerExist: new FormControl(null),
      customerNew: new FormControl(),
      orderStatus: new FormControl(null, Validators.required),
      vat: new FormControl(0),
      discount: new FormControl(0),
      orderItems: new FormArray([]),
      totalAmount: new FormControl({ value: 0, disabled: true })
    })

    console.log(this.orderItems);
  }

  createOrderItem(): FormGroup {
    return new FormGroup({
      productId: new FormControl(null, Validators.required),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
      unitPrice: new FormControl({ value: 0, disabled: true }),
      subtotal: new FormControl({ value: 0, disabled: true })
    });
  }

  get orderItems(): FormArray {
    return this.form.get('orderItems') as FormArray;
  }

  SelectedProdut(i: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedId = select.value;
    const selectedProduct = this.salesOrderService.products().find(p => p.Id === selectedId);

    if (!selectedProduct) return;

    const itemGroup = this.orderItems.at(i) as FormGroup;
    const quantity = itemGroup.get('quantity')?.value || 1;
    const unitPrice = selectedProduct.UnitPrice ?? 0;

    itemGroup.patchValue({
      unitPrice,
      subtotal: unitPrice * quantity
    });
    this.form.patchValue({
      totalAmount: this.getTotalAmount() + this.vatAmount - this.discountAmount
    })
  }

  getTotalAmount(): number {
    return this.orderItems.controls.reduce((sum, itemGroup) => {
      const subtotal = itemGroup.get('subtotal')?.value || 0;
      return (sum + subtotal);
    }, 0);
  }

  get discountAmount(): number {
    const discountPercent = this.form.get('discount')?.value || 0;
    const totalAmount = this.form.get('totalAmount')?.value || 0
    return (totalAmount * (discountPercent / 100));
  }

  get vatAmount(): number {
    const vatPercent = this.form.get('vat')?.value || 0;
    const totalAmount = this.form.get('totalAmount')?.value || 0
    return (totalAmount * (vatPercent / 100));
  }

  onVatChange() {
    this.form.patchValue({
      totalAmount: this.getTotalAmount() + this.vatAmount - this.discountAmount
    })
  }

  onDiscountChange() {
    this.form.patchValue({
      totalAmount: this.getTotalAmount() + this.vatAmount - this.discountAmount
    })
  }

  addItem() {
    this.orderItems.push(this.createOrderItem());
  }

  removeItem(index: number) {
    this.orderItems.removeAt(index);
    this.form.patchValue({
      totalAmount: this.getTotalAmount()
    })
  }

  calcSubtotal(index: number) {
    const item = this.orderItems.at(index) as FormGroup;
    const qty = item.get('quantity')?.value || 0;
    const price = item.get('unitPrice')?.value || 0;
    item.get('subtotal')?.setValue(qty * price);

    this.form.patchValue({
      totalAmount: this.getTotalAmount()
    })
  }

  onSalesOrderSubmit() {
    if (this.form.invalid) {
      return;
    }

    const guid = crypto.randomUUID();
    this.form.value.id = guid;

    if (this.form.value.customerType == 'existing') {
      this.salesOrderService.addSalesOrder(this.form.value).subscribe(data => {
        console.log(data);
      })
    }
    else if (this.form.value.customerType == 'new') {
      const customer: CustomerData = {
        Id: crypto.randomUUID(),
        Name: this.form.value.customerNew
      }
      this.salesOrderService.addCustomer(customer).subscribe((data) => {
        this.form.value.customerType = 'existing',
          this.form.value.customer.customerExist = customer.Id,
          console.log(data);

        this.salesOrderService.addSalesOrder(this.form.value).subscribe(data => {
          console.log(data);
        })
      })
    }
    else {
      this.salesOrderService.addSalesOrder(this.form.value).subscribe(data => {
        console.log(data);
      })
    }

    this.form.reset({
      orderNo: '',
      orderDate: this.getToday(),
      customerType: 'existing',
      vat: 0,
      discount: 0,
      orderItems: []  // clears form array
    });
    this.orderItems.clear();
  }

  getToday(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // "2025-10-31"
  }

  onSeletedCustomerType(event: Event) {
    console.log(event);
  }

  hasOrderNo(event: boolean) {
    this.hasOrderNoExists = event;
  }

  hasVatError(event: boolean) {
    this.vatError = event;
  }

  hasDiscountError(event: boolean) {
    this.discountError = event;
  }

  hasQuantityError(event: boolean) {
    this.quantityError = event;
  }
}
