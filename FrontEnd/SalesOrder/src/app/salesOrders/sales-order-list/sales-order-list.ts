import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SalesOrderService } from '../../services/salesOrders/sales-orderService';
import { SalesOrder as SaleOrderData} from '../../abstraction/model/SalesOrder';
import { SalesOrder } from '../sales-order/sales-order';
import { Pagination } from "../../pagination/pagination";
import { DatePipe, NgClass } from '@angular/common';
import { CustomerNamePipe } from '../../pipe/salesOrder/customer-name-pipe';
import { OrderStatusPipe } from '../../pipe/salesOrder/order-status-pipe';
import { MoneyPipe } from '../../pipe/salesOrder/money-pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { NgbAccordionItem } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-sales-order-list',
  imports: [Pagination, DatePipe, CustomerNamePipe, OrderStatusPipe, NgClass, MoneyPipe, FormsModule],
  templateUrl: './sales-order-list.html',
  styleUrl: './sales-order-list.css',
  standalone: true
})
export class SalesOrderList {
  salesOrderService = inject(SalesOrderService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  searchTerm = signal<string>('');
  selectedStatus = signal<string>('');   
  selectedCustomer = signal<string>('');
  selectedDate = signal<string>('');

  currentPage = signal<number>(1);
  pageSize = 7

  filteredOrders = computed(() => {
    let data = this.salesOrderService.salesOrders();
    const search = this.searchTerm().toLowerCase();
    const status = this.selectedStatus();
    const customer = this.selectedCustomer();
    const date = this.selectedDate();

    if (search) data = data.filter(o => o.orderNo?.toLowerCase().includes(search));
    if (status) data = data.filter(o => o.orderStatus == +status);
    if (customer) data = data.filter(o => o.customerExist == customer); 
    if (date) data = data.filter(o => o.orderDate == date);

    return data;
  });

  pagedSalesOrders = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredOrders().slice(start, end);
  });

  applyFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchTerm() || null,
        status: this.selectedStatus() || null,
        customer: this.selectedCustomer() || null,
        date: this.selectedDate() || null,
      },
      queryParamsHandling: 'merge', 
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.searchTerm.set(params.get('search') || '');
      this.selectedStatus.set(params.get('status') || '');
      this.selectedCustomer.set(params.get('customer') || '');
      this.selectedDate.set(params.get('date') || '');
    });
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedStatus.set('');
    this.selectedCustomer.set('');
    this.selectedDate.set('');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }
  
  onPageChange(event: number)
  {
    this.currentPage.set(event);
  }

  editOrder(orderId: string) {
  this.router.navigate(['/orders', orderId,'edit']);
  }

  deleteOrder(orderId: string) {
  if (!confirm('Are you sure you want to delete this order?')) {
    return;
  }

  this.salesOrderService.deleteSalesOrder(orderId)
    .subscribe(() => {
      const updatedOrders = this.salesOrderService.salesOrders().filter(o => o.id !== orderId);
      this.salesOrderService.salesOrders.set(updatedOrders);
    });
}
}
