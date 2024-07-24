import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { PasswordValidatorService } from '@core/services/validators';
import { FormGroupDirective } from '@shared/directives';
import { UpdatePasswordForm, UpdateUserPassword } from '../../types';
import { UserService } from '../../services';
import { ErrorResponse } from '@core/types';
import { AlertComponent } from '@shared/components';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [FormGroupDirective, ReactiveFormsModule, AlertComponent],
  templateUrl: './update-password.component.html',
  styles: ``,
})
export default class UpdatePasswordComponent implements OnInit, OnDestroy {
  passwordForm!: FormGroup<UpdatePasswordForm>;
  isLoading = false;
  formError: string | null = null;
  #userId = 0;
  #fb = inject(FormBuilder);
  #route = inject(ActivatedRoute);
  #passwordValidatorService = inject(PasswordValidatorService);
  #userService = inject(UserService);
  #router = inject(Router);
  #unsubscribeAll$ = new Subject<void>();

  get disableSubmit(): boolean {
    return this.passwordForm.invalid || this.isLoading || !!this.formError;
  }

  ngOnInit(): void {
    this.#createForm();
    this.#route.params
      .pipe(takeUntil(this.#unsubscribeAll$))
      .subscribe(({ id }) => (this.#userId = id));
  }

  ngOnDestroy(): void {
    this.#unsubscribeAll$.next();
    this.#unsubscribeAll$.complete();
  }

  async onSubmit(): Promise<void> {
    if (this.disableSubmit) return;
    this.isLoading = true;
    const { passwordConfirmation: _, ...pass } = this.passwordForm.value;

    try {
      await firstValueFrom(
        this.#userService.updateUserPassword(
          this.#userId,
          pass as UpdateUserPassword,
        ),
      );
      this.#router.navigate(['/users']);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'error' in error) {
        const errorResponse = (error as { error: ErrorResponse }).error;
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
    this.passwordForm = this.#fb.group(
      {
        currentPassword: [
          '',
          [
            Validators.required,
            this.#passwordValidatorService.passwordPatternValidator(
              new RegExp(PasswordValidatorService.passwordPattern),
            ),
          ],
        ],
        newPassword: [
          '',
          [
            Validators.required,
            this.#passwordValidatorService.passwordPatternValidator(
              new RegExp(PasswordValidatorService.passwordPattern),
            ),
          ],
        ],
        newPasswordConfirmation: ['', [Validators.required]],
      },
      {
        validators: [
          this.#passwordValidatorService.passwordsMatchValidator(
            'newPassword',
            'newPasswordConfirmation',
          ),
        ],
      },
    );
  }
}
