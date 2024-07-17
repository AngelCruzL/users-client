import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { StateService, UserService } from './services';
import { NavbarComponent, UserFormComponent } from './components';
import UsersTableComponent from './pages/users-table/users-table.component';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [
    UsersTableComponent,
    UserFormComponent,
    RouterOutlet,
    NavbarComponent,
  ],
  templateUrl: './user-app.component.html',
  styles: ``,
})
export default class UserAppComponent implements OnInit, OnDestroy {
  title = 'Users App';
  #usersService = inject(UserService);
  #state = inject(StateService);
  #unsubscribeAll$ = new Subject<void>();

  ngOnInit(): void {
    this.#usersService
      .findAll()
      .pipe(takeUntil(this.#unsubscribeAll$))
      .subscribe(users => this.#state.setUsers(users));
  }

  ngOnDestroy(): void {
    this.#unsubscribeAll$.next();
    this.#unsubscribeAll$.complete();
  }
}
