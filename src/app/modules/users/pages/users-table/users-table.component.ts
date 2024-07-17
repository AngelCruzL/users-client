import { Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ErrorResponse } from '@core/types';
import { StateService, UserService } from '../../services';

@Component({
  selector: 'users-table',
  standalone: true,
  imports: [],
  templateUrl: './users-table.component.html',
  styles: ``,
})
export default class UsersTableComponent {
  #state = inject(StateService);
  $users = this.#state.$users;
  #usersService = inject(UserService);

  async onRemoveUser(userId: number) {
    const confirm = window.confirm(
      'Are you sure you want to remove this user?',
    );
    if (!confirm) return;

    try {
      await firstValueFrom(this.#usersService.deleteUser(userId));
      this.#state.removeUser(userId);
    } catch (error: any) {
      const errorResponse = error.error as ErrorResponse;
      console.error(errorResponse.message);
    }
  }

  onEditUser(user: any) {
    // this.#sharedDataService.$user().emit(user);
  }
}
