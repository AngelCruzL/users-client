import { Component, input } from '@angular/core';

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
}
