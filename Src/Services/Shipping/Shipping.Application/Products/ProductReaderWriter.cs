namespace Shipping.Application.Products;
public interface IProductWriter
{
    Task<ProductDto> AddProductAsync(string name, double unitPrice, CancellationToken ct);
}


public interface IProductReader
{
    Task<ProductDto> GetProductAsync(Guid id);
    Task<IReadOnlyList<ProductDto>> GetProductListAsync(string? name, CancellationToken ct);
    Task<IReadOnlyList<ProductDropdownDto>> GetProductDropdownListAsync(string? name, CancellationToken ct);
}