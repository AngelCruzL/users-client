export type UserResponse = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};

export type UserResponsePaginated = {
  totalPages: number;
  totalElements: number;
  content: UserResponse[];
  size: number;
  first: boolean;
  last: boolean;
  number: number;
  sort: Sort;
  pageable: Pageable;
  numberOfElements: number;
  empty: boolean;
};

export type Pageable = {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

export type Sort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};
