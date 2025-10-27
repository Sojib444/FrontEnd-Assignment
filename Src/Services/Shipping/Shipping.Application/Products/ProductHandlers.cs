namespace Shipping.Application.Products;
using MediatR;



public class AddProductHandler : IRequestHandler<AddProduct, ProductDto>
{
    IProductWriter _writer;
    public AddProductHandler(IProductWriter writer) => _writer = writer;

    public Task<ProductDto> Handle(AddProduct request, CancellationToken ct)
    {
        return _writer.AddProductAsync(request.name, request.unitPrice, ct);
    }
}


public class GetProductHandler : IRequestHandler<GetProduct, ProductDto>
{
    IProductReader _reader;
    public GetProductHandler(IProductReader reader) => _reader = reader;
    public async Task<ProductDto> Handle(GetProduct request, CancellationToken cancellationToken)
    {
        return await _reader.GetProductAsync(request.id);
    }
}

public class getProductListHandler : IRequestHandler<GetProductList, IReadOnlyList<ProductDto>>
{
    IProductReader _reader;
    public getProductListHandler(IProductReader reader) => _reader = reader;

    public async Task<IReadOnlyList<ProductDto>> Handle(GetProductList request, CancellationToken ct)
    {
        return await _reader.GetProductListAsync(request.name,ct);
    }
}

public class getProductDropDownListHandler : IRequestHandler<GetProductDropDownList, IReadOnlyList<ProductDropdownDto>>
{
    IProductReader _reader;
    public getProductDropDownListHandler(IProductReader reader) => _reader = reader;

    public async Task<IReadOnlyList<ProductDropdownDto>> Handle(GetProductDropDownList request, CancellationToken ct)
    {
        return await _reader.GetProductDropdownListAsync(request.name,ct);
    }
}