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

  isCustomerSelected: boolean = true;
  isOrderStatusSelected: boolean = true;
  vatLessThanZero: boolean = true;
  discountLessThanZero: boolean = true;
  hasCustomerName: boolean = true;

  constructor(private formBuilder: FormBuilder) {
    this.salesOrderService.loadcustomers().subscribe(data => {
      this.salesOrderService.customers.set(data);
    })

    this.salesOrderService.loadProducts().subscribe(data => {
      this.salesOrderService.products.set(data);
    })

    this.salesOrderService.loadSalesOrders().subscribe(data => {
      this.salesOrderService.salesOrders.set(data);
    })

    this.form = new FormGroup({
      id: new FormControl(''),
      orderNo: new FormControl({value: this.orderNo, disabled: true}),
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

  get orderNo(): string
  {
    const lentgth = this.salesOrderService.salesOrders().length;
    return 'SO-X' + Math.round(Math.random()*10000);
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
      subtotal: unitPrice * quantity,
    });

    this.form.patchValue({
      totalAmount: this.getTotalAmount()
    })
    this.form.patchValue({
      totalAmount: (this.getTotalAmount()) + (this.vatAmount - this.discountAmount)
    })
  }

  getTotalAmount(): number {
    return this.orderItems.controls.reduce((sum, itemGroup) => {
      const subtotal = itemGroup.getRawValue().subtotal || 0;
      return (sum + subtotal);
    }, 0);
  }

  get discountAmount(): number {
    const discountPercent = this.form.value.discount ?? 0 ;
    const totalAmount = this.form.getRawValue().totalAmount ?? 0;
    var result = (totalAmount * (discountPercent / 100));
    return result;
  }

  get vatAmount(): number {
    const vatPercent = this.form.value.vat ?? 0 ;
    const totalAmount = this.form.getRawValue().totalAmount ?? 0;
    var result = (totalAmount * (vatPercent / 100));
    return result;
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
      totalAmount: this.getTotalAmount() + this.vatAmount - this.discountAmount
    })
  }

  onSalesOrderSubmit() {
    if(this.form.value.customerType == 'existing' && this.form.value.customerExist == null)
    {
      this.isCustomerSelected = false;
      this.form.setErrors({ invalid: true });
    }

    if(this.form.value.orderStatus == null)
    {
      this.isOrderStatusSelected = false;
      this.form.setErrors({ invalid: true });
    }

    if(this.form.value.customerType == 'new' && this.form.value.customerNew == null )
    {
      this.hasCustomerName = false;
      this.form.setErrors({ invalid: true });
    }


    if (this.form.invalid) {      
      return;
    }

    const guid = crypto.randomUUID();
    this.form.patchValue({id: guid});

    if (this.form.value.customerType == 'existing') {
      this.salesOrderService.addSalesOrder(this.form.getRawValue()).subscribe(data => {
         this.resetForm();
      })
    }
    else if (this.form.value.customerType == 'new') {
      const customer: CustomerData = {
        Id: crypto.randomUUID(),
        Name: this.form.value.customerNew
      }
      this.salesOrderService.addCustomer(customer).subscribe((data) => {
        this.salesOrderService.customers.update((old)=> [customer,...old])
        this.form.patchValue({
          customerType: 'existing',
          customerExist: customer.Id,
          customerNew: null
        })
        this.salesOrderService.addSalesOrder(this.form.getRawValue()).subscribe(data => {
          this.resetForm();
        })
      })
    }
    else {
      this.form.patchValue({
        customerExist: null
      })
      this.salesOrderService.addSalesOrder(this.form.value).subscribe(data => {
        this.resetForm();
      })
    }
  }

  resetForm()
  {
    this.form.reset({
      orderNo: this.orderNo + 1,
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
    
  }

  onSelectedCustomer()
  {
    this.isCustomerSelected = true;
  }

  onOrderStatusSelected()
  {
    this.isOrderStatusSelected = true;
  }

  onCustomerName()
  {
    this.hasCustomerName = true;
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
