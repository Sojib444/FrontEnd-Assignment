import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product/product-service';
import { Product as ProductData } from '../../abstraction/model/product';
import { Pagination } from '../../pagination/pagination';
import { MoneyFormatePipe } from "../../pipe/money/money-formate-pipe";

@Component({
  selector: 'app-product',
  imports: [ReactiveFormsModule, Pagination, MoneyFormatePipe],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  ProductService = inject(ProductService);
  form!: FormGroup;
  currentPage = signal<number>(1);
  pageSize= 10;
  totalLength = signal<number>(this.ProductService.products().length);

  pagedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.ProductService.products().slice(start, end);
  });

  constructor(private formBuilder: FormBuilder)
  {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      unitPrice:['',Validators.required]
    })
  }

  addProduct()
  {
    if(this.form.invalid)
    {
      return;
    }

    let newProduct : ProductData = {
      Id: this.form.value.Id =crypto.randomUUID(),
      Name: this.form.value.name,
      UnitPrice: this.form.value.unitPrice
    } 
    this.ProductService.products.update(value => [newProduct,...value])
    this.totalLength.set(this.ProductService.products().length);
    this.form.reset();
  }

  onPageChange($event: number)
  {
    this.currentPage.set($event);
  }
}
