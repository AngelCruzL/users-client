import { UserResponse, UserResponsePaginated } from '../types';

export function userAdapter(
  userWithPagination: UserResponsePaginated,
): UserResponse[] {
  return userWithPagination.content;
}
