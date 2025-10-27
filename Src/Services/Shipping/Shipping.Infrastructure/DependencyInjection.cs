
using Microsoft.Extensions.DependencyInjection;
using Shipping.Application.Abstraction;
using Shipping.Application.Customers;
using Shipping.Application.Products;
using Shipping.Application.SalesOrders;
using Shipping.Infrastructure.Persistence.Customers;
using Shipping.Infrastructure.Persistence.Products;
using Shipping.Infrastructure.Persistence.SalesOrders;

namespace Shipping.Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddCustomerInfrastructure(this IServiceCollection services)
    {
        // Application abstractions -> EF Core implementations
        services.AddScoped<ICustomerWriter, CustomerWriter>();
        services.AddScoped<ICustomerReader, CustomerReader>();
        services.AddScoped<ICustomerUniqueness, CustomerUniqueness>();
        services.AddScoped<IProductWriter, ProductWriter>();
        services.AddScoped<IProductReader, ProductReader>();
        services.AddScoped<IProductUniqueness, ProductUniqueness>();
        services.AddScoped<ISalesOrderWriter, SalesOrderWriter>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<ShippingDbContext>();
        return services;
    }
}
