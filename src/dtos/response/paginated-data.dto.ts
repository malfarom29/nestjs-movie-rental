export class PaginatedDataDto<T> {
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
}
