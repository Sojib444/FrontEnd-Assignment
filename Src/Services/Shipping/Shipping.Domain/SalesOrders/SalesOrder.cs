using System.Data.Common;
using Shipping.Domain.Products;

namespace Shipping.Domain.SalesOrders;

public class SalesOrder
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string OrderNo { get; private set; } = default!;
    public DateTime OrderDate { get; private set; }
    public double TotalAmount { get; private set; } 
    public Guid CustomerId { get; private set; } = default!;
    public Customer Customer { get; private set; } = default!;
    public List<SalesOrderItem> Items { get; private set; } = new();

    public SalesOrder() { }

    public SalesOrder(string orderNo, Guid customerId, List<SalesOrderItem> items)
    {
        OrderNo = orderNo;
        CustomerId = customerId;
        Items = items;
        TotalAmount = items.Sum(i => i.Subtotal);
        OrderDate = DateTime.UtcNow;
    }
}