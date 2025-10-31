import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { SalesOrder as SalesOrderData} from '../../abstraction/model/SalesOrder';
import { url } from '../../configuration/url';
import { Customer as CustomerData } from '../../abstraction/model/customer';
import { Product as ProductData } from '../../abstraction/model/product';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {

  salesOrders = signal<SalesOrderData[]>([]);
  customers = signal<CustomerData[]>([]);
  products = signal<ProductData[]>([]);

  constructor(private httpClient : HttpClient)
  {
  }

  loadSalesOrders()
  {
      return this.httpClient.get<SalesOrderData[]>(url+ 'salesorders');
  }

  loadProducts()
  {
     return this.httpClient.get<ProductData[]>(url+ 'products');
  }

  loadcustomers()
  {
      return this.httpClient.get<CustomerData[]>(url+ 'customers');
  }
}
