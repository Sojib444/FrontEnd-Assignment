import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../services/customer/customer';
import { Customer as CustomerData } from '../../abstraction/model/customer';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pagination } from "../../pagination/pagination";

@Component({
  selector: 'app-customer',
  imports: [ReactiveFormsModule, Pagination],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class Customer implements OnInit {
  customerService = inject(CustomerService);
  form!: FormGroup;
  currentPage = signal<number>(1);
  pageSize= 10;
  totalLength = this.customerService.customers().length;

  pagedCustomers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.customerService.customers().slice(start, end);
  });

  constructor(private formBuilder: FormBuilder)
  {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    })
  }

  addcustomer()
  {
    if(this.form.invalid)
    {
      return;
    }

    let newCustomer : CustomerData = {
      Id: this.form.value.Id =crypto.randomUUID(),
      Name: this.form.value.name
    } 
    this.customerService.customers.update(value => [newCustomer,...value])
    console.log(this.customerService.customers());
    this.form.reset();
  }

  onPageChange($event: number)
  {
    this.currentPage.set($event);
  }
}
