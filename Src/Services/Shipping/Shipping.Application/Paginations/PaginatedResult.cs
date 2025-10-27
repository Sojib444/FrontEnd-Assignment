namespace Shipping.Application.Paginations;

public sealed record PaginatedResult<T>(
    List<T> Items,
    int Page,
    int PageSize,
    int TotalCount
);
