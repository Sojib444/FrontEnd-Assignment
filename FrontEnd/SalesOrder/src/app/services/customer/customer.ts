import { Injectable, signal } from '@angular/core';
import { customer } from '../DemoData/customer';
import { Customer as CustomerData } from '../../abstraction/model/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  customers = signal<CustomerData[]>([]);

  constructor() {
      this.customers.set(customer);
  }
}
