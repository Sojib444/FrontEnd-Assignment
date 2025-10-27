using Shipping.Application.Paginations;

namespace Shipping.Application.SalesOrders;

public interface ISalesOrderReader
{
    Task<PaginatedResult<SalesOrderDto>> GetSalesOrdersAsync(PaginatedSalesOrderRequestDto request, CancellationToken ct);
}