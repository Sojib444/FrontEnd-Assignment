using Shipping.Application.Customers;

public interface ICustomerUniqueness
{
    Task<bool> IsCustomerExists(string email, string phoneNumber, CancellationToken ct);
}