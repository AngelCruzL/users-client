import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { CustomError } from '@core/types';
import { IconComponent, PaginatorComponent } from '@shared/components';
import { StateService, UserService } from '../../services';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  Icon,
} from '@shared/utils/constants';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [RouterLink, IconComponent, PaginatorComponent],
  templateUrl: './users-table.component.html',
  styles: ``,
})
export default class UsersTableComponent {
  isAdmin = inject(AuthService).$tokenPayload()!.isAdmin;
  pageSize = DEFAULT_PAGE_SIZE;
  pageNumber = DEFAULT_PAGE_NUMBER;
  lastPage = 0;
  protected readonly Icon = Icon;
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #usersService = inject(UserService);
  #state = inject(StateService);
  $users = this.#state.$users;
  #unsubscribeAll$ = new Subject<void>();

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

  onPageChange(newPage: number): void {
    this.pageNumber = newPage;
    this.updateUserList();
  }

  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.pageNumber = DEFAULT_PAGE_NUMBER;
    this.updateUserList();
  }

  private updateUserList() {
    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: { page: this.pageNumber, size: this.pageSize },
      queryParamsHandling: 'merge',
    });
    this.#usersService
      .findAll(this.pageNumber, this.pageSize)
      .pipe(takeUntil(this.#unsubscribeAll$))
      .subscribe(pageable => {
        this.#state.setUsers(pageable.content);
        this.lastPage = pageable.totalPages;
      });
  }
}
