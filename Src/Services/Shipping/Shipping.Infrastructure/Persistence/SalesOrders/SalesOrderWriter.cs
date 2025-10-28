using Microsoft.EntityFrameworkCore;
using Shipping.Application.Abstraction;
using Shipping.Application.SalesOrders;
using Shipping.Domain.SalesOrders;
using System;

namespace Shipping.Infrastructure.Persistence.SalesOrders;

public class SalesOrderWriter : ISalesOrderWriter
{
    private ShippingDbContext _db;
    private IUnitOfWork _unitOfWork;
    public SalesOrderWriter(ShippingDbContext db, IUnitOfWork unitOfWork)
    {
        _db = db;
        _unitOfWork = unitOfWork;
    }

    public async Task<SalesOrderDto> AddSalesOrderAsync(Guid customerId, OrderStatus orderStatus,
        List<CreateSalesOrderItemDto> items, CancellationToken ct)
    {
        var readyItems = new List<SalesOrderItem>();

        foreach (var x in items)
        {
            var unitPrice = await ProductUnitPrice(x.ProductId);
            readyItems.Add(new SalesOrderItem(x.ProductId, x.Quantity, unitPrice));
        }

        var total = await _db.SalesOrders.CountAsync();
        var salesOrder = new SalesOrder("SalesOrder" + total, orderStatus, customerId, readyItems);
        await _db.SalesOrders.AddAsync(salesOrder);
        await _unitOfWork.SaveChangesAsync(ct);

        return new SalesOrderDto(salesOrder.Id, salesOrder.OrderNo, salesOrder.OrderStatus, salesOrder.OrderDate,
            salesOrder.TotalAmount,
            salesOrder.CustomerId,
            salesOrder.Items.Select(x =>
            new SalesOrderItemDto(x.ProductId, x.Quantity, x.UnitPrice, x.Subtotal)).ToList());
    }

    public async Task<SalesOrderDto> UpdateSalesOrderAsync(Guid salesOrderId, Guid customerId, OrderStatus orderStatus,
         List<CreateSalesOrderItemDto> items, CancellationToken ct)
    {
        var salesOrder = await _db.SalesOrders.Where(x => x.Id == salesOrderId)
            .Include(x => x.Items).FirstOrDefaultAsync(ct);

        if (salesOrder is null)
            throw new Exception("Sales order not found");

        salesOrder.GetType().GetProperty("CustomerId")!.SetValue(salesOrder, customerId);
        salesOrder.GetType().GetProperty("OrderStatus")!.SetValue(salesOrder, orderStatus);
        salesOrder.Items.Clear();

        // Add new ones
        foreach (var item in items)
        {
            salesOrder.Items.Add(new SalesOrderItem(item.ProductId, item.Quantity,
                 await ProductUnitPrice(item.ProductId)));
        }

        await _unitOfWork.SaveChangesAsync(ct);
        
        return new SalesOrderDto(salesOrder.Id, salesOrder.OrderNo, salesOrder.OrderStatus, salesOrder.OrderDate,
            salesOrder.TotalAmount,
            salesOrder.CustomerId,
            salesOrder.Items.Select(x =>
            new SalesOrderItemDto(x.ProductId, x.Quantity, x.UnitPrice, x.Subtotal)).ToList());
    }

    private async Task<double> ProductUnitPrice(Guid productId)
    {
        var product = await _db.Products.FirstOrDefaultAsync(x => x.Id == productId);
        return product!.UniPrice;

    }
}