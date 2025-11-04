import { Component, computed, inject, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { SalesOrderService } from '../../services/salesOrders/sales-orderService';
import { SalesOrder as SaleOrderData} from '../../abstraction/model/SalesOrder';
import { Pagination } from "../../pagination/pagination";
import { DatePipe, NgClass } from '@angular/common';
import { CustomerNamePipe } from '../../pipe/salesOrder/customer-name-pipe';
import { OrderStatusPipe } from '../../pipe/salesOrder/order-status-pipe';
import { MoneyPipe } from '../../pipe/salesOrder/money-pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { end } from '@popperjs/core';

@Component({
  selector: 'app-sales-order-list',
  imports: [Pagination, DatePipe, CustomerNamePipe, OrderStatusPipe, NgClass, MoneyPipe, FormsModule],
  templateUrl: './sales-order-list.html',
  styleUrl: './sales-order-list.css',
  standalone: true
})
export class SalesOrderList implements OnInit{
  salesOrderService = inject(SalesOrderService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  searchTerm = signal<string>('');
  selectedStatus = signal<string>('');   
  selectedCustomer = signal<string>('');
  selectedDate = signal<string>('');
  sortKey = signal<keyof SaleOrderData>('orderDate'); 
  sortDir = signal<'asc' | 'desc'>('asc');


  currentPage = signal<number>(1);  
  
  pageSize = 10

  filteredOrders = computed(() => {
    let data = this.salesOrderService.salesOrders();
    const search = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    const customer = this.selectedCustomer();
    const date = this.selectedDate();    

    if (search) data = data.filter(o => o.orderNo?.toLowerCase().includes(search));
    if (status) data = data.filter(o => o.orderStatus == +status);
    if (customer) data = data.filter(o => o.customerExist == customer); 
    if (date) data = data.filter(o => o.orderDate == date);


    const key = this.sortKey();
    const dir = this.sortDir();

    if (key) {
      data = [...data].sort((a, b) => {
        const valA = (a as SaleOrderData)[key];
        const valB = (b as SaleOrderData)[key];
        if (valA == null || valB == null) return 0;
        const result = valA > valB ? 1 : valA < valB ? -1 : 0;
        return dir === 'asc' ? result : -result;
      });
    }
      return data;
  });

  pagedSalesOrders = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredOrders().slice(start, end);
  });

  countPageNumbers = computed(() => {
    let start = (this.currentPage() - 1) * this.pageSize;
    let end = start + this.pageSize;

    if(end > this.filteredOrders().length){
      end = this.filteredOrders().length;
    }
    return `Total: ${start+1}-${end} out of ${this.filteredOrders().length}`;
  });

  toggleSort(key: keyof SaleOrderData) {
  if (this.sortKey() === key) {
    this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
  } else {
    this.sortKey.set(key);
    this.sortDir.set('asc');
  }
}

  applyFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchTerm() || null,
        status: this.selectedStatus() || null,
        customer: this.selectedCustomer() || null,
        date: this.selectedDate() || null,
        sortKey: this.sortKey() || null,
        sortDir: this.sortDir() || null,
        currentPage: this.currentPage() || null,
        orderNo: this.searchTerm() || null
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

      if(params.get('currentPage'))
      {
        this.currentPage.set(Number(params.get('currentPage')));
      } else {
        this.currentPage.set(1);
      }
      const dir = params.get('sortDir');
      if (dir === 'asc' || dir === 'desc') {
        this.sortDir.set(dir);
      } else {
        this.sortDir.set('asc'); 
      }
      });
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedStatus.set('');
    this.selectedCustomer.set('');
    this.selectedDate.set('');
    this.sortKey.set('orderDate');
    this.sortDir.set('asc');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }
  
  onPageChange(event: number)
  {
    this.currentPage.set(event);
    this.applyFilters();
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
