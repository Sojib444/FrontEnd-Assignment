using MediatR;
using Shipping.Application.Paginations;
using Shipping.Domain.SalesOrders;

namespace Shipping.Application.SalesOrders;

public sealed record CreateSlesOrder(Guid CustomerId, List<CreateSalesOrderItemDto> Items) 
    : IRequest<SalesOrderDto>;
public sealed record GetSalesOrders(PaginatedSalesOrderRequestDto request) 
    : IRequest<IReadOnlyList<PaginatedResult<SalesOrderDto>>>;



