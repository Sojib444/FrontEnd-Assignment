using Shipping.Domain.Products;

namespace Shipping.Domain.SalesOrders;

public class SalesOrderItem
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid SalesOrderId { get; private set; }
    public SalesOrder SalesOrder { get; private set; } = default!;

    public Guid ProductId { get; private set; }
    public Product Product { get; private set; } = default!;

    public int Quantity { get; private set; }
    public double UnitPrice { get; private set; }
    public double Subtotal => Quantity * UnitPrice;

    private SalesOrderItem() { }

    public SalesOrderItem(Guid productId, int quantity, double unitPrice)
    {
        ProductId = productId;
        Quantity = quantity;
        UnitPrice = unitPrice;
    }
}