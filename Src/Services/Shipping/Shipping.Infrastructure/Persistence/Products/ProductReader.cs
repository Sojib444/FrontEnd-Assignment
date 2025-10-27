
using Microsoft.EntityFrameworkCore;
using Shipping.Application.Products;
using Shipping.Infrastructure;

namespace Shipping.Infrastructure.Persistence.Products;
public class ProductReader : IProductReader
{
    private ShippingDbContext _db;
    public ProductReader(ShippingDbContext db) => _db = db;
    public async Task<ProductDto> GetProductAsync(Guid id)
    {
        var product = await _db.Products.
            Where(x => x.Id == id)
            .Select(x => new ProductDto(x.Name, x.UniPrice))
            .FirstOrDefaultAsync();

        if (product is null)
        {
            throw new Exception("ProductNotFound");
        }

        return product;
    }

    public async Task<IReadOnlyList<ProductDto>> GetProductListAsync(string? name, CancellationToken ct)
    {
        if (!string.IsNullOrWhiteSpace(name))
        {
            return await _db.Products
                .Where(x => x.Name.Contains(name))
                .OrderBy(x => x.Name)
                .Select(x => new ProductDto(x.Name, x.UniPrice)).ToListAsync(ct);
        }
        return await _db.Products
                .OrderBy(x => x.Name)
                .Select(x => new ProductDto(x.Name, x.UniPrice)).ToListAsync(ct);

    }

    public async Task<IReadOnlyList<ProductDropdownDto>> GetProductDropdownListAsync(string? name, CancellationToken ct)
    {
        if (!string.IsNullOrWhiteSpace(name))
        {
            return await _db.Products
                .Where(x => x.Name.Contains(name))
                .OrderBy(x => x.Name)
                .Select(x => new ProductDropdownDto(x.Id, x.Name)).ToListAsync(ct);
        }
        return await _db.Products
                .OrderBy(x => x.Name)
                .Select(x => new ProductDropdownDto(x.Id, x.Name)).ToListAsync(ct);
    }
}