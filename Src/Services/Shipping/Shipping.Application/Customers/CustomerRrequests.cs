using MediatR;

namespace Shipping.Application.Customers;

public sealed record GetCustomerById(Guid Id) : IRequest<CustomerDto?>;
public sealed record ListCustomers(int Skip, int Take) : IRequest<IReadOnlyList<CustomerDto>>;
public sealed record CreateCustomer(string Name, string Email, string PhoneNumber, string Address,
    string gender, int customerTypeId, List<string> Hobbies, List<string> CountryCodes ) : IRequest<Guid>;
public sealed record UpdateCustomer(Guid Id, string Name, string Email, string PhoneNumber, string Address,
     string gender, int customerTypeId, List<string> Hobbies, List<string> CountryCodes, CancellationToken ct) : IRequest;
public sealed record DeleteCustomer(Guid Id) : IRequest;

public sealed record CustomerDropDownList(string? queryName) : IRequest<IReadOnlyList<CustomerDropdownListDto>>;