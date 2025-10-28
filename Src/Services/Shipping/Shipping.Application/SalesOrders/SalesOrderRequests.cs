using MediatR;
using Shipping.Application.Paginations;
using Shipping.Domain.SalesOrders;

namespace Shipping.Application.SalesOrders;

public sealed record CreateSlesOrder(Guid CustomerId,OrderStatus OrderStatus, List<CreateSalesOrderItemDto> Items) 
    : IRequest<SalesOrderDto>;
public sealed record GetSalesOrders(PaginatedSalesOrderRequestDto SearchRequest) 
    : IRequest<PaginatedResult<SalesOrderDto>>;



