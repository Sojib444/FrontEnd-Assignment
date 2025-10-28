using Shipping.Domain.SalesOrders;

namespace Shipping.Application.SalesOrders;

public interface ISalesOrderWriter
{
    Task<SalesOrderDto> AddSalesOrderAsync(Guid customerId, OrderStatus orderStatus,
        List<CreateSalesOrderItemDto> items, CancellationToken ct);
} 