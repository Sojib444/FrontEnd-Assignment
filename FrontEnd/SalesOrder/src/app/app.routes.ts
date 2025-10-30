import { Routes } from '@angular/router';
import { Customer } from './customers/customer/customer';
import { Product } from './products/product/product';

export const routes: Routes = [
    { path: 'customer', component: Customer },
    { path: 'product', component: Product }
];
