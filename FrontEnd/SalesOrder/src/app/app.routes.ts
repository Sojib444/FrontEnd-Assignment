import { Routes } from '@angular/router';
import { Customer } from './customers/customer/customer';
import { Product } from './products/product/product';
import { SalesOrder } from './salesOrders/sales-order/sales-order';
import { SalesOrderList } from './salesOrders/sales-order-list/sales-order-list';

export const routes: Routes = [
    { path: 'customer', component: Customer },
    { path: 'product', component: Product },
    { path: 'orders/new', component: SalesOrder },
    { path: 'orders', component: SalesOrderList }
];
