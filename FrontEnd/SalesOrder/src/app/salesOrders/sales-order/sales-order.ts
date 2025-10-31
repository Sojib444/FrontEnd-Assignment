import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { OrderNumberUniqueness } from '../../directives/salesOrder/order-number-uniqueness';
import { SalesOrderService } from '../../services/salesOrders/sales-orderService';
import { CanNotLessThanZero } from '../../directives/salesOrder/can-not-less-than-zero';

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
      productId: new FormControl('', Validators.required),
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
    const totalAmount = this.form.get('totalAmount')?.value || 0;
    console.log("total amount ", totalAmount)
    console.log("total vat on amount ", totalAmount * (discountPercent /100));
    return (totalAmount * (discountPercent /100));
  }

  get vatAmount(): number {
    const vatPercent = this.form.get('vat')?.value || 0;
    const totalAmount = this.form.get('totalAmount')?.value || 0
    return (totalAmount * (vatPercent /100));
  }

  onVatChange()
  {
    // console.log(this.getTotalAmount());
    // console.log(this.vatAmount);
    // console.log(this.discountAmount);

    this.form.patchValue({
      totalAmount: this.getTotalAmount() + this.vatAmount - this.discountAmount
    })
  }

  onDiscountChange()
  {
    // console.log(this.getTotalAmount());
    // console.log(this.vatAmount);
    // console.log(this.discountAmount);

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
