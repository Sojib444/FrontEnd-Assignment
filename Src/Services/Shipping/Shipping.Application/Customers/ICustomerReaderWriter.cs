namespace  Shipping.Application.Customers;

public interface ICustomerReader
{
    Task<CustomerDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<IReadOnlyList<CustomerDto>> GetAllAsync(int skip, int take, CancellationToken ct);
    Task<IReadOnlyList<CustomerDropdownListDto>> GetCustomerDropDownListAsync(string? queryName,CancellationToken ct);
}


public interface ICustomerWriter
{
    Task<Guid> AddAsync(string name, string email, string phoneNumber, string address, string gender,
        int customerTypeId, List<string> Hobbies, List<string> CountryCodes, CancellationToken ct);
     Task UpdateAsync(Guid id, string name, string email, string phoneNumber, string address,
        string gender, int customerTypeId, List<string> Hobbies, List<string> CountryCodes, CancellationToken ct);
    Task DeleteAsync(Guid id, CancellationToken ct);
}
