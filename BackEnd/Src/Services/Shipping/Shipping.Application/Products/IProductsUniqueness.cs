namespace Shipping.Application.Products;
public interface IProductUniqueness
{
    Task<bool> IsProductExists(string name, CancellationToken ct);
}