import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { User } from '@core/models';
import {
  CreateUser,
  UpdateUser,
  UpdateUserPassword,
  UserResponse,
} from 'app/modules/users/types';

/**
 * Service responsible for user-related operations, providing methods to interact with the backend API for user management.
 * Utilizes Angular's dependency injection system to ensure a single instance throughout the application.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * Base URL for user-related API endpoints, derived from the environment configuration.
   * @private
   */
  #baseUrl = environment.API_URL + '/users';

  /**
   * Injected HttpClient for making HTTP requests.
   * @private
   */
  #http = inject(HttpClient);

  /**
   * Retrieves all users from the backend.
   * @returns An Observable of an array of UserResponse objects.
   */
  findAll(): Observable<UserResponse[]> {
    return this.#http.get<UserResponse[]>(this.#baseUrl);
  }

  /**
   * Retrieves a single user by their ID.
   * @param id The unique identifier of the user.
   * @returns An Observable of a UserResponse object.
   */
  findUserById(id: number): Observable<UserResponse> {
    return this.#http.get<UserResponse>(`${this.#baseUrl}/${id}`);
  }

  /**
   * Creates a new user.
   * @param user The user data to create, excluding the ID.
   * @returns An Observable of the created UserResponse object.
   */
  createUser({ id, ...user }: User): Observable<UserResponse> {
    const createUser: CreateUser = user;
    return this.#http.post<UserResponse>(this.#baseUrl, createUser);
  }

  /**
   * Updates an existing user's information.
   * @param id The unique identifier of the user to update.
   * @param user The updated user data.
   * @returns An Observable of the updated UserResponse object.
   */
  updateUser(id: number, user: UpdateUser): Observable<UserResponse> {
    return this.#http.put<UserResponse>(`${this.#baseUrl}/${id}`, user);
  }

  /**
   * Updates the password of an existing user.
   * @param id The unique identifier of the user whose password is to be updated.
   * @param password The new password data.
   * @returns An Observable of the updated UserResponse object.
   */
  updateUserPassword(
    id: number,
    password: UpdateUserPassword,
  ): Observable<UserResponse> {
    return this.#http.patch<UserResponse>(`${this.#baseUrl}/${id}`, password);
  }

  /**
   * Deletes a user by their ID.
   * @param id The unique identifier of the user to delete.
   * @returns An Observable that completes when the user is deleted.
   */
  deleteUser(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#baseUrl}/${id}`);
  }
}
