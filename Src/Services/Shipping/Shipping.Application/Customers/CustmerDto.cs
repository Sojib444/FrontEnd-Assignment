namespace Shipping.Application.Customers;

public record CustomerDto(Guid Id, string Name, string Email, string PhoneNumber, string Address,
    string gender, int customerTypeId, List<string> Hobbies, List<string> CountryCodes);

public record CustomerDropdownListDto(Guid Id, string? Name);