import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';

import { User } from '@core/models';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'users-table',
  standalone: true,
  imports: [],
  templateUrl: './users-table.component.html',
  styles: ``,
})
export default class UsersTableComponent implements OnInit, OnDestroy {
  $users: WritableSignal<User[]> = signal([]);
  #sharedDataService = inject(SharedDataService);
  #router = inject(Router);
  #usersService = inject(UserService);
  #unsubscribeAll$ = new Subject<void>();

  ngOnInit(): void {
    const users = this.#router.getCurrentNavigation()?.extras.state!['users'];
    if (users) {
      this.$users.set(users);
    } else {
      this.#usersService
        .findAll()
        .pipe(takeUntil(this.#unsubscribeAll$))
        .subscribe(users => this.$users.set(users));
    }
  }

  ngOnDestroy(): void {
    this.#unsubscribeAll$.next();
    this.#unsubscribeAll$.complete();
  }

  onRemoveUser(userId: number) {
    const confirm = window.confirm(
      'Are you sure you want to remove this user?',
    );
    if (confirm) this.#sharedDataService.$idUser().emit(userId);
  }

  onEditUser(user: User) {
    this.#sharedDataService.$user().emit(user);
  }
}
