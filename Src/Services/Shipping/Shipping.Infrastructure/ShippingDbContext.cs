using Microsoft.EntityFrameworkCore;
using Shipping.Domain;
using Shipping.Domain.Products;
using Shipping.Domain.SalesOrders;

namespace Shipping.Infrastructure;

public sealed class ShippingDbContext : DbContext
{
    private readonly string _schema;
    public ShippingDbContext(DbContextOptions<ShippingDbContext> options) : base(options)
    {
        _schema = (options.FindExtension<
            Microsoft.EntityFrameworkCore.Infrastructure.RelationalOptionsExtension>()?
            .MigrationsHistoryTableSchema) ?? "shipping";
    }

    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(_schema);

        modelBuilder.Entity<Customer>(b =>
        {
            b.ToTable("customer");
            b.HasKey(x => x.Id);
            b.Property(x => x.Name).HasMaxLength(256).IsRequired();
            b.Property(x => x.Email).HasMaxLength(256).IsRequired();
            b.Property(x => x.PhoneNumber).HasMaxLength(20).IsRequired();
            b.Property(x => x.Address).HasMaxLength(512).IsRequired();
            b.Property(x => x.CustomerTypeId).HasMaxLength(512).IsRequired();
            b.Property(x => x.Gender).HasMaxLength(512).IsRequired();
            b.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<Product>(b =>
        {
            b.ToTable("product");
            b.HasKey(x => x.Id);
            b.Property(x => x.Name).HasMaxLength(256).IsRequired();
            b.Property(x => x.UniPrice).IsRequired();
        });

        modelBuilder.Entity<SalesOrder>()
            .HasOne(s => s.Customer)
            .WithMany(c => c.SalesOrders)
            .HasForeignKey(s => s.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<SalesOrderItem>()
            .HasOne(i => i.SalesOrder)
            .WithMany(o => o.Items)
            .HasForeignKey(i => i.SalesOrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SalesOrderItem>()
           .HasOne(i => i.Product)
           .WithMany(p => p.OrderItems)
           .HasForeignKey(i => i.ProductId)
           .OnDelete(DeleteBehavior.Restrict);
            

        modelBuilder.Entity<SalesOrder>()
            .Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<SalesOrderItem>()
            .Property(i => i.UnitPrice)
            .HasPrecision(18, 2);
    }
}