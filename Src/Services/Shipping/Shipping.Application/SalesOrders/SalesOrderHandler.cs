using MediatR;
using Shipping.Domain.SalesOrders;

namespace Shipping.Application.SalesOrders;

public class CreateSalesOrderHandler : IRequestHandler<CreateSlesOrder, SalesOrderDto>
{
    private ISalesOrderWriter _writer;
    public CreateSalesOrderHandler(ISalesOrderWriter writer)
    {
        _writer = writer;
    }
    public async Task<SalesOrderDto> Handle(CreateSlesOrder request, CancellationToken ct)
    {
        return await _writer.AddSalesOrderAsync(request.CustomerId, request.Items, ct);
    }
}