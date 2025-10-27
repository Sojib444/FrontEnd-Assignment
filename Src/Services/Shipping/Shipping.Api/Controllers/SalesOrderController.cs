using MediatR;
using Microsoft.AspNetCore.Mvc;
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
            var salesOrderDto = await _mediator.Send(new CreateSlesOrder(cmd.CustomerId, cmd.items), ct);
            return Ok(salesOrderDto);
        }
        catch (ArgumentException ex)
        {
            return ValidationProblem(title: "Invalid  data", detail: ex.Message, statusCode: StatusCodes.Status400BadRequest);
        }
    }
}