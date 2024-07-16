import { Component, inject, OnInit, output } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { User } from '@core/models';
import { UserForm } from '@core/types';
import {
  EmailValidatorService,
  PasswordValidatorService,
} from '@core/services/validators';
import { FormGroupDirective } from '@shared/directives';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, FormGroupDirective],
  templateUrl: './user-form.component.html',
  styles: ``,
})
export class UserFormComponent implements OnInit {
  user!: User;
  $newUser = output<User>();
  userForm!: FormGroup<UserForm>;
  isLoading = false;
  #fb = inject(FormBuilder);
  #passwordValidatorService = inject(PasswordValidatorService);
  #emailValidatorService = inject(EmailValidatorService);

  get disableSubmit(): boolean {
    return this.userForm.invalid || this.isLoading;
  }

  ngOnInit(): void {
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

  onSubmit(): void {
    if (this.disableSubmit) return;

    this.$newUser.emit(this.user);
  }
}
