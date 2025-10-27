

using Shipping.Domain.SalesOrders;

namespace Shipping.Application.SalesOrders;
public sealed record CreateSalesOrderItemDto(Guid ProductId, int Quantity);
public sealed record CreateUpUpdateSalesOrderDto(Guid CustomerId, List<CreateSalesOrderItemDto> items);
public sealed record SalesOrderDto(Guid Id, string orderNo, DateTime OrderDate,
    double TotalAmount, Guid CustomerId, List<SalesOrderItemDto> items);
public sealed record SalesOrderItemDto(
    Guid ProductId,
    int Quantity,
    double UnitPrice,
    double Subtotal
);

