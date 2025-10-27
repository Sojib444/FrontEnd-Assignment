
namespace Shipping.Infrastructure.Persistence.Products;
using Microsoft.EntityFrameworkCore;
using Shipping.Application.Abstraction;
using Shipping.Application.Products;
using Shipping.Domain.Products;
using Shipping.Infrastructure;

public class ProductWriter : IProductWriter
{
    private ShippingDbContext _db;
    private IUnitOfWork _unitOfWork;
    private IProductUniqueness _productuniqueness;
    public ProductWriter(ShippingDbContext db, IUnitOfWork unitofWork, IProductUniqueness productUniqueness)
    {
        _unitOfWork = unitofWork;
        _db = db;
        _productuniqueness = productUniqueness;
        
    }

    public async Task<ProductDto> AddProductAsync(string name, double unitPrice, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new Exception("Product Name Can't be null or whitespace");
        }
        var IsProductExists = await _productuniqueness.IsProductExists(name,ct);
        if (IsProductExists) throw new Exception("Product Already Exixts");

        var product = new Product(name, unitPrice);
        await _db.Products.AddAsync(product, ct);
        await _unitOfWork.SaveChangesAsync();

        return new ProductDto(product.Name, product.UniPrice);
    }
}