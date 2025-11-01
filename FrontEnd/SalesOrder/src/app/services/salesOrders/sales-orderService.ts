import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { SalesOrder as SalesOrderData} from '../../abstraction/model/SalesOrder';
import { url } from '../../configuration/url';
import { Customer as CustomerData } from '../../abstraction/model/customer';
import { Product as ProductData } from '../../abstraction/model/product';
import { SalesOrder } from '../../salesOrders/sales-order/sales-order';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {

  salesOrders = signal<SalesOrderData[]>([]);
  customers = signal<CustomerData[]>([]);
  products = signal<ProductData[]>([]);

  constructor(private httpClient : HttpClient)
  {
    this.loadcustomers().subscribe(data => {
      this.customers.set(data);
    })

    this.loadSalesOrders().subscribe(data => {
      this.salesOrders.set(data);
    })
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

  addSalesOrder(salesOrder: SalesOrderData)
  {
    return this.httpClient.post<SalesOrderData>(url+"salesorders",salesOrder)
  }

  addCustomer(customer: CustomerData)
  {
    return this.httpClient.post(url+ 'customers',customer)
  }

  updateSalesOrder(id: string, salesOrder: SalesOrderData)
  {
    return this.httpClient.patch<SalesOrderData>(`${url}salesorders/${id}`,salesOrder);
  }

  deleteSalesOrder(id: string)
  {
    return this.httpClient.delete(`${url}salesorders/${id}`);
  }
}
