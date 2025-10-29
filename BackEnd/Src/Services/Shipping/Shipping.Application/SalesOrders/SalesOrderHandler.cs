using MediatR;
using Shipping.Application.Paginations;
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
        return await _writer.AddSalesOrderAsync(request.CustomerId, request.OrderStatus, request.Items, ct);
    }
}

public class GetSalesOrdersHandler : IRequestHandler<GetSalesOrders, PaginatedResult<SalesOrderDto>>
{
    private ISalesOrderReader _reader;
    public GetSalesOrdersHandler(ISalesOrderReader reader)
    {
        _reader = reader;
    }

    public async Task<PaginatedResult<SalesOrderDto>> Handle(GetSalesOrders request, CancellationToken cancellationToken)
    {
        return await _reader.GetSalesOrdersAsync(request.SearchRequest, cancellationToken);
    }
}

public class GetSalesOrderHandler : IRequestHandler<GetSalesOrder, SalesOrderDto>
{
    private ISalesOrderReader _reader;
    public GetSalesOrderHandler(ISalesOrderReader reader)
    {
        _reader = reader;
    }
    public async Task<SalesOrderDto> Handle(GetSalesOrder request, CancellationToken cancellationToken)
    {
        return await _reader.GetSalesOrderAsync(request.id, cancellationToken);
    }
}

public class UpdateSalesOrderHandler : IRequestHandler<UpdateSalesOrder, SalesOrderDto>
{
    private ISalesOrderWriter _writer;
    public UpdateSalesOrderHandler(ISalesOrderWriter writer)
    {
        _writer = writer;
    }
    public async Task<SalesOrderDto> Handle(UpdateSalesOrder request, CancellationToken ct)
    {
        return await _writer.UpdateSalesOrderAsync(request.SalesOrderId, request.CustomerId, request.OrderStatus, request.Items,ct);
    }
}