import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #users: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test',
      username: 'john.doe',
      password: 'password',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'test',
      username: 'jane.doe',
      password: 'password',
    },
  ];

  /**
   * Retrieves all users from the service.
   *
   * This method returns an `Observable` of an array of `User` objects. It provides
   * a way to asynchronously access the list of users stored within the service.
   * The users are returned as they are stored, without any modification or filtering.
   *
   * @returns {Observable<User[]>} An Observable that emits the array of users.
   */
  findAll(): Observable<User[]> {
    return of(this.#users);
  }
}
