// export interface SalesOrder
// {
//     id: string;
//     orderNo: string;
//     OrderDate: Date;
//     totalAmount: number;
//     customerId: string;
//     orderStatus: OrderStatus;
//     vat: number;
//     discount: number;
//     orderItems: SalesOrderItem[];
// }

// export interface SalesOrderItem
// {
//     Id: string;
//     SalesOrderId: string;
//     ProductId: string;
//     Quantity: number;
//     UnitPrice: number;
//     SubTotal: number;
// }

export enum OrderStatus
{
    Pending =1,
    Processing,
    Shipped,
    Completed,
    Cancelled
}


export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SalesOrder {
  id: string;
  orderNo: string;
  orderDate: string; // or Date if you convert it after fetching
  customerType: 'existing' | 'new';
  customerExist?: string | null;
  customerNew?: string | null;
  orderStatus: OrderStatus; // you can change to enum if you have OrderStatus enum
  vat: number;
  discount: number;
  orderItems: OrderItem[];
  totalAmount: number;
}