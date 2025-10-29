namespace Shipping.Application.Products;
using MediatR;

public sealed record GetProductList(string? name) : IRequest<IReadOnlyList<ProductDto>>;
public sealed record GetProductDropDownList(string? name) : IRequest<IReadOnlyList<ProductDropdownDto>>;
public sealed record AddProduct(string name, double unitPrice) : IRequest<ProductDto>;
public sealed record GetProduct(Guid id) : IRequest<ProductDto>;
public sealed record DeleteDto : IRequest;
