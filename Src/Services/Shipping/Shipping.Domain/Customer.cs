using Shipping.Domain.SalesOrders;

namespace Shipping.Domain;

public sealed class Customer
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Name { get; private set; } = default!;
    public string Email { get; private set; } = default!;
    public string PhoneNumber { get; private set; } = default!;
    public string Address { get; private set; } = default!;
    public string Gender { get; private set; } = default!;
    public int CustomerTypeId { get; private set; }
    public string? HobbiesJson { get; private set;  }
    public string? CountriesJson { get; private set; }
        // Navigation property
    public List<SalesOrder> SalesOrders { get; private set; } = new();


    public Customer() { }
    public Customer(string name, string email, string phoneNumber,
        string address, string gender, int customerTypeId, string hobbiesJson, string countriesJson)
    {
        Name = name;
        Email = email;
        PhoneNumber = phoneNumber;
        Address = address;
        Gender = gender;
        CustomerTypeId = customerTypeId;
        HobbiesJson = hobbiesJson;
        CountriesJson = countriesJson;
    }
}
