

using Shipping.Domain.SalesOrders;

namespace Shipping.Application.SalesOrders;
public sealed record CreateSalesOrderItemDto(Guid ProductId, int Quantity);
public sealed record CreateUpUpdateSalesOrderDto(Guid CustomerId,OrderStatus OrderStatus, List<CreateSalesOrderItemDto> items);
public sealed record SalesOrderDto(Guid Id, string orderNo, OrderStatus OrderStatus, DateTime OrderDate,
    double TotalAmount, Guid CustomerId, List<SalesOrderItemDto> items);
public sealed record SalesOrderItemDto(
    Guid ProductId,
    int Quantity,
    double UnitPrice,
    double Subtotal
);

public sealed record PaginatedSalesOrderRequestDto
(
    int Page = 1,
    int PageSize = 10,
    string SortBy = "orderDate",
    string SortDir = "desc",
    string? Search = null,
    Dictionary<string, string>? Filters = null
);
