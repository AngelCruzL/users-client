import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

import { UserResponse } from '../types';

/**
 * Service responsible for managing the state of users within the application.
 * Utilizes Angular's dependency injection to provide a singleton instance across the application.
 *
 * @Injectable Marks a class as available to be provided and injected as a dependency.
 * @providedIn 'root' Specifies that the service is available throughout the application.
 */
@Injectable({
  providedIn: 'root',
})
export class StateService {
  /**
   * Private signal for user data, not directly accessible outside the service.
   * Utilizes a writable signal to allow updates to the user data.
   *
   * @type {WritableSignal<UserResponse[]>} A writable signal containing an array of UserResponse objects.
   * @private
   */
  #$users: WritableSignal<UserResponse[]> = signal<UserResponse[]>([]);

  /**
   * Public computed observable for user data, providing a reactive interface to the private users signal.
   * Allows external components to reactively access the user data without being able to modify it directly.
   *
   * @type {Signal<UserResponse[]>} A computed signal containing an array of UserResponse objects.
   */
  $users: Signal<UserResponse[]> = computed(() => this.#$users());

  /**
   * Sets the entire list of users.
   * Replaces the current user data with a new array of UserResponse objects.
   *
   * @param {UserResponse[]} users An array of UserResponse objects to set as the current users.
   */
  setUsers(users: UserResponse[]): void {
    this.#$users.set(users);
  }

  /**
   * Adds a single user to the current list of users.
   * Appends a UserResponse object to the current array of users.
   *
   * @param {UserResponse} user The UserResponse object to be added.
   */
  addUser(user: UserResponse): void {
    this.#$users.set([...this.$users(), user]);
  }

  /**
   * Removes a user from the current list by their ID.
   * Filters out the UserResponse object with the matching ID from the current array of users.
   *
   * @param {number} userId The ID of the user to be removed.
   */
  removeUser(userId: number): void {
    this.#$users.set(this.$users().filter(user => user.id !== userId));
  }

  /**
   * Updates the details of an existing user.
   * Finds the UserResponse object with the matching ID and updates it with the provided user details.
   *
   * @param {UserResponse} user The updated UserResponse object. Must include the ID of the user to update.
   */
  updateUser(user: UserResponse): void {
    this.#$users.set(this.$users().map(u => (u.id === user.id ? user : u)));
  }
}
