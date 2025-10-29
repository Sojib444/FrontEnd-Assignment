using Shipping.Application.Abstraction;
using Shipping.Infrastructure;

namespace Shipping.Infrastructure;
public sealed class UnitOfWork : IUnitOfWork
{
    private readonly ShippingDbContext _db;
    public UnitOfWork(ShippingDbContext db) => _db = db;

    public Task<int> SaveChangesAsync(CancellationToken ct = default) =>
        _db.SaveChangesAsync(ct);
}
