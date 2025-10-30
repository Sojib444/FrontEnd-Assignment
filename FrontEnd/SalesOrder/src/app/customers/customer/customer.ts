import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../services/customer/customer';
import { Customer as CustomerData } from '../../abstraction/model/customer';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pagination } from "../../pagination/pagination";
import { CustomerUniqueName } from '../../directives/customer/customer-unique-name';
import { noOnlySpacesValidator } from '../../validators/noOnlySpacesValidator';

@Component({
  selector: 'app-customer',
  imports: [ReactiveFormsModule, Pagination,CustomerUniqueName],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class Customer implements OnInit {
  customerService = inject(CustomerService);
  form!: FormGroup;

  //for page listing
  currentPage = signal<number>(1);
  pageSize= 10;
  totalLength = signal<number>(this.customerService.customers().length);
  pagedCustomers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.customerService.customers().slice(start, end);
  });

  hasNameExists: boolean = false; // for showing duplicate name error message

  constructor(private formBuilder: FormBuilder)
  {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required, noOnlySpacesValidator]
    })
  }

  addcustomer()
  {
    console.log(this.form);
    if(this.form.invalid || this.hasNameExists)
      return;

    let newCustomer : CustomerData = {
      Id: this.form.value.Id =crypto.randomUUID(),
      Name: this.form.value.name
    } 
    this.customerService.customers.update(value => [newCustomer,...value])
    this.totalLength.set(this.customerService.customers().length);
    this.form.reset();
  }

  onPageChange($event: number)
  {
    this.currentPage.set($event);
  }

  hasName(event: boolean)
  {
      this.hasNameExists = event;
  }
}
