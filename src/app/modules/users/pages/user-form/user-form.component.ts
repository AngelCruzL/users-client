import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { User } from '@core/models';
import {
  EmailValidatorService,
  PasswordValidatorService,
} from '@core/services/validators';
import { CustomError } from '@core/types';
import { FormGroupDirective } from '@shared/directives';
import { AlertComponent } from '@shared/components';
import { CreateUserForm } from '../../types';
import { StateService, UserService } from '../../services';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormGroupDirective, AlertComponent],
  templateUrl: './user-form.component.html',
  styles: ``,
})
export default class UserFormComponent implements OnInit {
  userForm!: FormGroup<CreateUserForm>;
  isLoading = false;
  formError: string | null = null;
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #passwordValidatorService = inject(PasswordValidatorService);
  #emailValidatorService = inject(EmailValidatorService);
  #userService = inject(UserService);
  #state = inject(StateService);

  get disableSubmit(): boolean {
    return this.userForm.invalid || this.isLoading || !!this.formError;
  }

  ngOnInit(): void {
    this.#createForm();
  }

  async onSubmit(): Promise<void> {
    if (this.disableSubmit) return;
    this.isLoading = true;
    const { passwordConfirmation: _, ...userFormValue } = this.userForm.value;
    const user = new User(userFormValue as User);

    try {
      const newUser = await firstValueFrom(this.#userService.createUser(user));
      this.#state.addUser(newUser);
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
    this.userForm = this.#fb.group(
      {
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
        password: [
          '',
          [
            Validators.required,
            this.#passwordValidatorService.passwordPatternValidator(
              new RegExp(PasswordValidatorService.passwordPattern),
            ),
          ],
        ],
        passwordConfirmation: ['', [Validators.required]],
      },
      {
        validators: [
          this.#passwordValidatorService.passwordsMatchValidator(
            'password',
            'passwordConfirmation',
          ),
        ],
      },
    );
  }
}
