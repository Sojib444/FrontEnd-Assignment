using MediatR;
using Microsoft.AspNetCore.Mvc;
using Shipping.Application.Customers;
using Shipping.Application.Products;

[ApiController]
[Route("v1/products")]
public class ProductController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> GetById(Guid id, CancellationToken ct)
    {
        var dto = await _mediator.Send(new GetProduct(id), ct);
        if (dto is null) return NotFound();
        return Ok(dto);
    }

    [HttpPost]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create([FromBody] ProductDto cmd, CancellationToken ct)
    {
        try
        {
            var productDto = await _mediator.Send(new AddProduct(cmd.name, cmd.unitPrice), ct);
            return Ok(productDto);
        }
        catch (ArgumentException ex)
        {
            return ValidationProblem(title: "Invalid product data", detail: ex.Message, statusCode: StatusCodes.Status400BadRequest);
        }
    }

    [HttpGet("list")]
    [ProducesResponseType(typeof(IReadOnlyList<ProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ProductDto>>> List([FromQuery] string? name, CancellationToken ct = default)
    {
        var list = await _mediator.Send(new GetProductList(name), ct);
        return Ok(list);
    }

    [HttpGet("dropdown")]
    [ProducesResponseType(typeof(IReadOnlyList<ProductDropdownDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ProductDropdownDto>>> DropDownList(
    [FromQuery] string? name,
    CancellationToken ct = default)
    {
        var list = await _mediator.Send(new GetProductDropDownList(name), ct);
        return Ok(list);
    }
}