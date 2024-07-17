import { computed, Injectable, signal } from '@angular/core';

import { UserResponse } from '../types';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  #$users = signal<UserResponse[]>([]);
  $users = computed(() => this.#$users());

  setUsers(users: UserResponse[]): void {
    this.#$users.set(users);
  }

  addUser(user: UserResponse): void {
    this.#$users.set([...this.$users(), user]);
  }

  removeUser(userId: number): void {
    this.#$users.set(this.$users().filter(user => user.id !== userId));
  }

  updateUser(user: UserResponse): void {
    this.#$users.set(this.$users().map(u => (u.id === user.id ? user : u)));
  }
}
