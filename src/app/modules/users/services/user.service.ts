import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import {
  CreateUser,
  UpdateUser,
  UpdateUserPassword,
  UserResponse,
} from 'app/modules/users/types';
import { User } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #baseUrl = environment.API_URL + '/users';

  #http = inject(HttpClient);

  findAll(): Observable<UserResponse[]> {
    return this.#http.get<UserResponse[]>(this.#baseUrl);
  }

  findUserById(id: number): Observable<UserResponse> {
    return this.#http.get<UserResponse>(`${this.#baseUrl}/${id}`);
  }

  createUser({ id, ...user }: User): Observable<UserResponse> {
    const createUser: CreateUser = user;
    return this.#http.post<UserResponse>(this.#baseUrl, createUser);
  }

  updateUser(id: number, user: UpdateUser): Observable<UserResponse> {
    return this.#http.put<UserResponse>(`${this.#baseUrl}/${id}`, user);
  }

  updateUserPassword(
    id: number,
    password: UpdateUserPassword,
  ): Observable<UserResponse> {
    return this.#http.patch<UserResponse>(`${this.#baseUrl}/${id}`, password);
  }

  deleteUser(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#baseUrl}/${id}`);
  }
}
