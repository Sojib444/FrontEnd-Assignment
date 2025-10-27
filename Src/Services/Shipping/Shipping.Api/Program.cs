using Shipping.Application.Customers;
using Shipping.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
// Register infrastructure services (single extension method)

builder.Services.AddCustomerPersistence(builder.Configuration);
builder.Services.AddCustomerInfrastructure();

// Add MediatR for Application layer
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<CreateCustomer>());
builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetSection("Database")["ConnectionString"]!);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.MapHealthChecks("/healthz");

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();
