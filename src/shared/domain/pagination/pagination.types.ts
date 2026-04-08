export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type PaginatedResult<T> = {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
