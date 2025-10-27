using MediatR;

namespace Shipping.Application.Customers;

public class GetCustomerByIdHandler : IRequestHandler<GetCustomerById, CustomerDto?>
{
    public readonly ICustomerReader _reader;
    public GetCustomerByIdHandler(ICustomerReader reader) => _reader = reader;
    public Task<CustomerDto?> Handle(GetCustomerById request, CancellationToken ct) =>
        _reader.GetByIdAsync(request.Id, ct);
}

public class ListCustomersHandler: IRequestHandler<ListCustomers, IReadOnlyList<CustomerDto>>
{
    public readonly ICustomerReader _reader;
    public ListCustomersHandler(ICustomerReader reader) => _reader = reader;
    public Task<IReadOnlyList<CustomerDto>> Handle(ListCustomers request, CancellationToken ct) =>
        _reader.GetAllAsync(request.Skip, request.Take, ct);
}

public class CreateCustomerHandler: IRequestHandler<CreateCustomer, Guid>
{
    public readonly ICustomerWriter _writer;
    public CreateCustomerHandler(ICustomerWriter writer) => _writer = writer;
    public Task<Guid> Handle(CreateCustomer request, CancellationToken ct) =>
        _writer.AddAsync(request.Name, request.Email, request.PhoneNumber, request.Address,
            request.gender, request.customerTypeId, request.Hobbies, request.CountryCodes, ct);
}

public class UpdateCustomerHandler : IRequestHandler<UpdateCustomer>
{
    public readonly ICustomerWriter _writer;
    public UpdateCustomerHandler(ICustomerWriter writer) => _writer = writer;
    public async Task Handle(UpdateCustomer request, CancellationToken ct) =>
        await _writer.UpdateAsync(request.Id, request.Name, request.Email, request.PhoneNumber, request.Address,
                        request.gender, request.customerTypeId, request.Hobbies, request.CountryCodes, ct);
}

public class DeleteCustomerHandler : IRequestHandler<DeleteCustomer>
{
    public readonly ICustomerWriter _writer;
    public DeleteCustomerHandler(ICustomerWriter writer) => _writer = writer;
    public async Task Handle(DeleteCustomer request, CancellationToken ct) =>
        await _writer.DeleteAsync(request.Id, ct);
}

public class CustomerDropDownListHandler : IRequestHandler<CustomerDropDownList, IReadOnlyList<CustomerDropdownListDto>>
{
    public readonly ICustomerReader _reader;
    public CustomerDropDownListHandler(ICustomerReader reader) => _reader = reader;
    public async Task<IReadOnlyList<CustomerDropdownListDto>> Handle(CustomerDropDownList request, CancellationToken cancellationToken)
    {
        return await _reader.GetCustomerDropDownListAsync(request.queryName,cancellationToken);
    }
}
