import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CustomError } from '@core/types';
import { StateService, UserService } from '../../services';
import { IconComponent } from '@shared/components/icon/icon.component';
import { Icon } from '@shared/utils/constants';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './users-table.component.html',
  styles: ``,
})
export default class UsersTableComponent {
  protected readonly Icon = Icon;
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
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'error' in error) {
        const errorResponse = (error as CustomError).error;
        console.error(errorResponse.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }
}
