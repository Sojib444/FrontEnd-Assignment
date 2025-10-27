
using Shipping.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Shipping.Application.Products;

namespace Shipping.Infrastructure.Persistence.Products;
public class ProductUniqueness : IProductUniqueness
{
    private readonly ShippingDbContext _db;
    public ProductUniqueness(ShippingDbContext shippingDbContext) => _db = shippingDbContext;
    public async Task<bool> IsProductExists(string name, CancellationToken ct) =>
         await _db.Products.AnyAsync(x => x.Name == name);

}