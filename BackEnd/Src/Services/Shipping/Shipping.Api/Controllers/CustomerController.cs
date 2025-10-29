using MediatR;
using Microsoft.AspNetCore.Mvc;
using Shipping.Application.Customers;

namespace Shipping.Api.Controllers;

[ApiController]
[Route("v1/customers")]
public class CustomerController : ControllerBase
{
    private readonly IMediator _mediator;

    public CustomerController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(CustomerDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerDto>> GetById(Guid id, CancellationToken ct)
    {
        var dto = await _mediator.Send(new GetCustomerById(id), ct);
        if (dto is null) return NotFound();
        return Ok(dto);
    }

    /// <summary>Create a new Customer.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create([FromBody] CreateCustomer cmd, CancellationToken ct)
    {
        try
        {
            var id = await _mediator.Send(cmd, ct);
            return Created($"/v1/customers/{id}", new { id });
        }
        catch (ArgumentException ex)
        {
            return ValidationProblem(title: "Invalid data", detail: ex.Message, statusCode: StatusCodes.Status400BadRequest);
        }
    }

    [HttpGet("list")]
    [ProducesResponseType(typeof(IReadOnlyList<CustomerDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<CustomerDto>>> List(
        [FromQuery] int skip = 0,
        [FromQuery] int take = 100,
        CancellationToken ct = default)
    {
        if (take <= 0 || take > 1000) take = 100;
        var list = await _mediator.Send(new ListCustomers(skip, take), ct);
        return Ok(list);
    }

    [HttpGet("dropdown")]
    [ProducesResponseType(typeof(IReadOnlyList<CustomerDropdownListDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<CustomerDto>>> DropDownList(
        [FromQuery] string? name,
        CancellationToken ct = default)
    {
        var list = await _mediator.Send(new CustomerDropDownList(name), ct);
        return Ok(list);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCustomer cmd, CancellationToken ct)
    {
        if (id != cmd.Id) return BadRequest();
        try
        {
            await _mediator.Send(cmd, ct);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }
    
    
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        try
        {
            await _mediator.Send(new DeleteCustomer(id), ct);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }
}