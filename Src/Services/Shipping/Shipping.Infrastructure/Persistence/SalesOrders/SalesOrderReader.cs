using Microsoft.EntityFrameworkCore;
using Shipping.Application.Paginations;
using Shipping.Application.SalesOrders;
using Shipping.Domain.SalesOrders;

namespace Shipping.Infrastructure.Persistence.SalesOrders;

public class SalesOrderReader : ISalesOrderReader
{
    private ShippingDbContext _db;
    public SalesOrderReader(ShippingDbContext db)
    {
        _db = db;
    }

    public async Task<SalesOrderDto> GetSalesOrderAsync(Guid id, CancellationToken ct)
    {
        var salesOrder =  await _db.SalesOrders.Where(x => x.Id == id).Include(o => o.Items).FirstOrDefaultAsync(ct);

        if (salesOrder is null)
        {
            throw new Exception("Sales order not found");
        }

        return new SalesOrderDto(
            salesOrder.Id,
            salesOrder.OrderNo,
            salesOrder.OrderStatus,
            salesOrder.OrderDate,
            salesOrder.TotalAmount,
            salesOrder.CustomerId,
            salesOrder.Items.Select(x => new SalesOrderItemDto(
                        x.ProductId,
                        x.Quantity,
                        x.UnitPrice,
                        x.Subtotal)).ToList()
        );
    }

    public async Task<PaginatedResult<SalesOrderDto>> GetSalesOrdersAsync(PaginatedSalesOrderRequestDto request,
        CancellationToken ct)
    {
        var query = _db.SalesOrders.Include(o => o.Items).AsNoTracking();

        // Search
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchLower = request.Search.ToLower();
            query = query.Where(o => o.OrderNo.ToLower().Contains(searchLower));
        }

        // Filters
        if (request.Filters != null)
        {
            foreach (var filter in request.Filters)
            {
                if (filter.Key.ToLower() == "orderstatus")
                    query = query.Where(o => o.OrderStatus.ToString() == filter.Value);

                if (filter.Key.ToLower() == "customer")
                    query = query.Where(o => o.Customer.Id.ToString() == filter.Value);
            }
        }

        // Sorting
        query = (request.SortBy?.ToLower(), request.SortDir?.ToLower()) switch
        {
            ("orderdate", "asc") => query.OrderBy(o => o.OrderDate),
            ("orderdate", "desc") => query.OrderByDescending(o => o.OrderDate),
            ("totalamount", "asc") => query.OrderBy(o => o.TotalAmount),
            ("totalamount", "desc") => query.OrderByDescending(o => o.TotalAmount),
            _ => query.OrderByDescending(o => o.OrderDate)
        };

        // Pagination
        var totalItems = await query.CountAsync(ct);

        var salesOrders = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        var resultItems = salesOrders.Select(o => new SalesOrderDto(
            o.Id,
            o.OrderNo,
            o.OrderStatus,
            o.OrderDate,
            o.TotalAmount,
            o.CustomerId,
            o.Items.Select(i => new SalesOrderItemDto(
                i.ProductId,
                i.Quantity,
                i.UnitPrice,
                i.Subtotal
            )).ToList()
        )).ToList();

        return new PaginatedResult<SalesOrderDto>(
            resultItems,
            request.Page,
            request.PageSize,
            totalItems
        );
    }
}
