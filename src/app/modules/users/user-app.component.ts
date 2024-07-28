import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { PaginationComponent } from '@shared/components';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from '@shared/utils/constants';
import { StateService, UserService } from './services';
import { NavbarComponent } from './components';
import UsersTableComponent from './pages/users-table/users-table.component';

@Component({
  selector: 'app-user-app',
  standalone: true,
  imports: [
    UsersTableComponent,
    RouterOutlet,
    NavbarComponent,
    PaginationComponent,
  ],
  template: `
    <header class="text-center container">
      <app-navbar />

      <h3 class="my-2">{{ title }}</h3>
    </header>

    <main class="container">
      <router-outlet />

      <app-pagination
        [currentPage]="pageNumber"
        [lastPage]="lastPage"
        [pageSize]="pageSize"
        (pageChange)="onPageChange($event)"
        (pageSizeChange)="onPageSizeChange($event)"
      />
    </main>
  `,
  styles: ``,
})
export default class UserAppComponent implements OnInit, OnDestroy {
  title = 'Users App';
  pageNumber = DEFAULT_PAGE_NUMBER;
  pageSize = DEFAULT_PAGE_SIZE;
  lastPage = 0;
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #usersService = inject(UserService);
  #state = inject(StateService);
  #unsubscribeAll$ = new Subject<void>();

  ngOnInit(): void {
    this.#route.queryParams
      .pipe(takeUntil(this.#unsubscribeAll$))
      .subscribe(params => {
        this.pageNumber = params['page'] || DEFAULT_PAGE_NUMBER;
        this.pageSize = params['size'] || DEFAULT_PAGE_SIZE;
      });

    this.#usersService
      .findAll(this.pageNumber, this.pageSize)
      .pipe(takeUntil(this.#unsubscribeAll$))
      .subscribe(pageable => {
        this.#state.setUsers(pageable.content);
        this.lastPage = pageable.totalPages;
      });
  }

  ngOnDestroy(): void {
    this.#unsubscribeAll$.next();
    this.#unsubscribeAll$.complete();
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
