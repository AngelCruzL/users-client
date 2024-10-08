import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  catchError,
  firstValueFrom,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

import { CustomError } from '@core/types';
import { EmailValidatorService } from '@core/services/validators';
import { FormGroupDirective } from '@shared/directives';
import { AlertComponent } from '@shared/components';
import { StateService, UserService } from '../../services';
import { UserResponse } from '../../types';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    FormGroupDirective,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    RouterLink,
  ],
  templateUrl: './edit-user.component.html',
  styles: ``,
})
export default class EditUserComponent implements OnInit, OnDestroy {
  editUserForm!: FormGroup;
  formError: string | null = null;
  isLoading = false;
  userId = 0;
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #userService = inject(UserService);
  #state = inject(StateService);
  #unsubscribeAll$ = new Subject<void>();
  #emailValidatorService = inject(EmailValidatorService);

  get disableSubmit(): boolean {
    return this.editUserForm.invalid || this.isLoading || !!this.formError;
  }

  ngOnInit(): void {
    this.#createForm();
    this.#route.params
      .pipe(
        takeUntil(this.#unsubscribeAll$),
        switchMap(({ id }) => this.#userService.findUserById(id)),
        catchError(() => this.#router.navigate(['/users'])),
      )
      .subscribe(user => this.#loadFormValues(user as UserResponse));
  }

  ngOnDestroy(): void {
    this.#unsubscribeAll$.next();
    this.#unsubscribeAll$.complete();
  }

  async onSubmit(): Promise<void> {
    if (this.disableSubmit) return;
    this.isLoading = true;

    try {
      const { id, ...user } = this.editUserForm.value;
      const updatedUser = await firstValueFrom(
        this.#userService.updateUser(id, user),
      );
      this.#state.updateUser(updatedUser);
      this.#router.navigate(['/users']);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'error' in error) {
        const errorResponse = (error as CustomError).error;
        this.formError = errorResponse.message;
        setTimeout(() => (this.formError = null), 5000);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      this.isLoading = false;
    }
  }

  #createForm(): void {
    this.editUserForm = this.#fb.group({
      id: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          this.#emailValidatorService.emailPatternValidator(
            new RegExp(EmailValidatorService.emailPattern),
          ),
        ],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12),
        ],
      ],
    });
  }

  #loadFormValues(user: UserResponse): void {
    this.userId = user.id;
    this.editUserForm.patchValue(user);
  }
}
