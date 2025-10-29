using BuildingBlocks.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Shipping.Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddCustomerPersistence(
        this IServiceCollection services, IConfiguration cfg)
    {
        var db = new DbOptions();
        cfg.GetSection("Database").Bind(db); 

        services.AddDbContext<ShippingDbContext>(opt =>
            opt.UseNpgsql(db.ConnectionString, npg =>
                npg.MigrationsHistoryTable("__EFMigrationsHistory", db.Schema)));

        return services;
    }
}
