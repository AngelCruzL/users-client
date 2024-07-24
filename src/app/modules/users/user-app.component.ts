import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { StateService, UserService } from './services';
import { NavbarComponent } from './components';
import UsersTableComponent from './pages/users-table/users-table.component';

@Component({
  selector: 'app-user-app',
  standalone: true,
  imports: [UsersTableComponent, RouterOutlet, NavbarComponent],
  template: `
    <header class="text-center container">
      <app-navbar />

      <h3 class="my-2">{{ title }}</h3>
    </header>

    <main class="container">
      <router-outlet />
    </main>
  `,
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
      .subscribe(({ content }) => this.#state.setUsers(content));
  }

  ngOnDestroy(): void {
    this.#unsubscribeAll$.next();
    this.#unsubscribeAll$.complete();
  }
}
