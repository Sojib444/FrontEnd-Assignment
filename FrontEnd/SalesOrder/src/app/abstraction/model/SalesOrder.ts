export interface SalesOrder
{
    Id: string;
    OrderNo: string;
    OrderDate: Date;
    TotalAmount: number;
    CustomerId: string;
    OrderSatus: OrderStatus;
    SalesOderItems: SalesOrderItem[];
}

export interface SalesOrderItem
{
    Id: string;
    SalesOrderId: string;
    ProductId: string;
    Quantity: number;
    UnitPrice: number;
    SubTotal: number;
}

export enum OrderStatus
{
    Pending =1,
    InProgress,
    Deliverd,
    Complete
}