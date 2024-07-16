import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { User } from '@core/models';
import { UserService } from '../../services/user.service';
import { UsersTableComponent } from '../users-table/users-table.component';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [UsersTableComponent, UserFormComponent],
  templateUrl: './user-app.component.html',
  styles: ``,
})
export default class UserAppComponent implements OnInit, OnDestroy {
  users: User[] = [];
  #unsubscribeAll$ = new Subject<void>();
  #userService = inject(UserService);

  ngOnInit(): void {
    this.#userService
      .findAll()
      .pipe(takeUntil(this.#unsubscribeAll$))
      .subscribe(users => (this.users = users));
  }

  ngOnDestroy(): void {
    this.#unsubscribeAll$.next();
    this.#unsubscribeAll$.complete();
  }

  addUser(user: User): void {
    console.log({ user });
    this.users = [...this.users, { ...user }];
  }

  removeUser(userId: number): void {
    this.users = this.users.filter(user => user.id !== userId);
  }
}
