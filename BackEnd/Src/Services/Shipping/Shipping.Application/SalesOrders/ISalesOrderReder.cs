using Shipping.Application.Paginations;

namespace Shipping.Application.SalesOrders;

public interface ISalesOrderReader
{
    Task<PaginatedResult<SalesOrderDto>> GetSalesOrdersAsync(PaginatedSalesOrderRequestDto request, CancellationToken ct);
    Task<SalesOrderDto> GetSalesOrderAsync(Guid id, CancellationToken ct);
}