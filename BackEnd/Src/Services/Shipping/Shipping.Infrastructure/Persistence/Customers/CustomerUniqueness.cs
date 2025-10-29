
using Microsoft.EntityFrameworkCore;

namespace Shipping.Infrastructure.Persistence.Customers;

public class CustomerUniqueness : ICustomerUniqueness
{
    private readonly ShippingDbContext _db;
    public CustomerUniqueness(ShippingDbContext shippingDbContext) =>  _db = shippingDbContext;

    public Task<bool> IsCustomerExists(string email, string phoneNumber, CancellationToken ct) =>
      _db.Customers.AnyAsync(c => c.Email == email || c.PhoneNumber == phoneNumber, ct);

}