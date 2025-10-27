using MediatR;
using Shipping.Domain.SalesOrders;

namespace Shipping.Application.SalesOrders;

public sealed record CreateSlesOrder(Guid CustomerId, List<CreateSalesOrderItemDto> Items) 
    : IRequest<SalesOrderDto>;

