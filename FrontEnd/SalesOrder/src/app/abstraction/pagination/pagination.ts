export interface PaginatedResult<T>
{
  Items: T[];
  Page: number;
  PageSize: number;
  TotalCount: number;
}
