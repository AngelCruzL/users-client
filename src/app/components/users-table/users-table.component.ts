import { Component, input, output } from '@angular/core';

import { User } from '@core/models';

@Component({
  selector: 'users-table',
  standalone: true,
  imports: [],
  templateUrl: './users-table.component.html',
  styles: ``,
})
export class UsersTableComponent {
  $users = input.required<User[]>();
  $onRemoveUser = output<number>();

  onRemoveUser(userId: number) {
    const confirm = window.confirm(
      'Are you sure you want to remove this user?',
    );
    if (confirm) this.$onRemoveUser.emit(userId);
  }
}
