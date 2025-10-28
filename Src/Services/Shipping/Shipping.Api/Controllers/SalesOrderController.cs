using MediatR;
using Microsoft.AspNetCore.Mvc;
using Shipping.Application.Paginations;
using Shipping.Application.SalesOrders;

namespace Shipping.Api.Controllers;

[ApiController]
[Route("v1/salesorders")]
public class SalesOrderController : ControllerBase
{
    private IMediator _mediator;
    public SalesOrderController(IMediator mediator)
    {
        _mediator = mediator;
    }


    [HttpPost]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create([FromBody] CreateUpUpdateSalesOrderDto cmd, CancellationToken ct)
    {
        try
        {
            var salesOrderDto = await _mediator.Send(new CreateSlesOrder(cmd.CustomerId, cmd.OrderStatus, cmd.items), ct);
            return Ok(salesOrderDto);
        }
        catch (ArgumentException ex)
        {
            return ValidationProblem(title: "Invalid  data", detail: ex.Message, statusCode: StatusCodes.Status400BadRequest);
        }
    }

    [HttpGet("list")]
    [ProducesResponseType(typeof(PaginatedResult<SalesOrderDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PaginatedResult<SalesOrderDto>>> List(
        [FromQuery] PaginatedSalesOrderRequestDto searchRequest,
        CancellationToken ct = default)
    {
        var list = await _mediator.Send(new GetSalesOrders(searchRequest));
        return Ok(list);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(SalesOrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SalesOrderDto>> GetById(Guid id, CancellationToken ct)
    {
        var dto = await _mediator.Send(new GetSalesOrder(id), ct);
        if (dto is null) return NotFound();
        return Ok(dto);
    }
}