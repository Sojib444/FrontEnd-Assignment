import { Injectable, signal } from '@angular/core';
import { Product } from '../../abstraction/model/product';
import { product } from '../DemoData/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products = signal<Product[]>([]);

  constructor() {
    this.products.set(product);
  }
}
