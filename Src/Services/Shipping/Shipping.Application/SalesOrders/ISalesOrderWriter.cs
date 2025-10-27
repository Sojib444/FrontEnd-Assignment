using Shipping.Domain.SalesOrders;

namespace Shipping.Application.SalesOrders;

public interface ISalesOrderWriter
{
    Task<SalesOrderDto> AddSalesOrderAsync(Guid customerId, List<CreateSalesOrderItemDto> items, CancellationToken ct);
} 