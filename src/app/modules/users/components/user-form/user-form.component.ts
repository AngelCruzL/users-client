import { Component, inject, input, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { User } from '@core/models';
import {
  EmailValidatorService,
  PasswordValidatorService,
} from '@core/services/validators';
import { FormGroupDirective } from '@shared/directives';
import { ErrorResponse } from '@core/types';
import { UserForm } from '../../types';
import { StateService, UserService } from '../../services';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, FormGroupDirective],
  templateUrl: './user-form.component.html',
  styles: ``,
})
export class UserFormComponent implements OnInit {
  $user = input<User | null>(null);
  userForm!: FormGroup<UserForm>;
  isLoading = false;
  formError: string | null = null;
  #fb = inject(FormBuilder);
  #passwordValidatorService = inject(PasswordValidatorService);
  #emailValidatorService = inject(EmailValidatorService);
  #userService = inject(UserService);
  #state = inject(StateService);

  get disableSubmit(): boolean {
    return this.userForm.invalid || this.isLoading || !!this.formError;
  }

  ngOnInit(): void {
    this.userForm = this.#fb.group(
      {
        id: [null],
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

  async onSubmit(): Promise<void> {
    if (this.disableSubmit) return;
    this.isLoading = true;
    const { passwordConfirmation, ...userFormValue } = this.userForm.value;
    const user = new User(userFormValue as User);

    try {
      user.id ? await this.#updateUser(user) : await this.#createUser(user);
    } catch (error: any) {
      const errorResponse = error.error as ErrorResponse;
      this.formError = errorResponse.message;
    } finally {
      this.isLoading = false;
    }
  }

  async #createUser(user: User): Promise<void> {
    const newUser = await firstValueFrom(this.#userService.createUser(user));
    this.#state.addUser(newUser);
  }

  async #updateUser(user: User): Promise<void> {
    const updatedUser = await firstValueFrom(
      this.#userService.updateUser(user),
    );
    this.#state.updateUser(updatedUser);
  }
}
