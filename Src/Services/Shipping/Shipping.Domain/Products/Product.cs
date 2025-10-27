using Shipping.Domain.SalesOrders;

namespace Shipping.Domain.Products;
public class Product
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Name { get; private set; } = default!;
    public double UniPrice { get; private set; }
    public List<SalesOrderItem> OrderItems { get; private set; } = new();


    public Product() {}

    public Product(string name, double unitPrice)
    {
        Id = Guid.NewGuid();
        Name = name;
        UniPrice = unitPrice;
    }
}