import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  firstValueFrom,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

import { ErrorResponse } from '@core/types';
import { EmailValidatorService } from '@core/services/validators';
import { FormGroupDirective } from '@shared/directives';
import { StateService, UserService } from '../../services';
import { UserResponse } from '../../types';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormGroupDirective, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styles: ``,
})
export default class EditUserComponent implements OnInit, OnDestroy {
  editUserForm!: FormGroup;
  formError: string | null = null;
  isLoading = false;
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
    } catch (error: any) {
      const errorResponse = error.error as ErrorResponse;
      this.formError = errorResponse.message;
      setTimeout(() => (this.formError = null), 5000);
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
    this.editUserForm.patchValue(user);
  }
}
