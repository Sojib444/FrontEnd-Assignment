import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { SalesOrder as SalesOrderData} from '../../abstraction/model/SalesOrder';
import { url } from '../../configuration/url';
import { Customer as CustomerData } from '../../abstraction/model/customer';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {

  salesOrders = signal<SalesOrderData[]>([]);
  customers = signal<CustomerData[]>([]);
  serverUrl: string = url + 'salesorders';

  constructor(private httpClient : HttpClient)
  {
  }

  loadData()
  {
     this.httpClient.get<SalesOrderData[]>(url+ 'salesorders').subscribe(data => {
      this.salesOrders.set(data);
     })

      this.httpClient.get<CustomerData[]>(url+ 'customers').subscribe(data => {
      this.customers.set(data);
     })
  }    
}
