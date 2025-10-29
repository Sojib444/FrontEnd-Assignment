import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer/customer';
import { Customer as CustomerData } from '../../model/customer';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer',
  imports: [ReactiveFormsModule],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class Customer implements OnInit {
  customerService = inject(CustomerService);
  form!: FormGroup;

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
    this.form.value.id = crypto.randomUUID();
    this.customerService.customers.update(value => [...value, newCustomer])
    console.log(this.customerService.customers());
    this.form.reset();
  }
}
