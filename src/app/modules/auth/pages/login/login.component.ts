import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@core/services';
import { FormGroupDirective } from '@shared/directives';
import { LoginForm } from '../../types';
import { tokenPayloadAdapter } from '../../adapters/token-payload.adapter';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormGroupDirective, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: `
    form {
      display: flex;
      flex-direction: column;
      margin-inline: auto;
      max-inline-size: 25rem;
    }
  `,
})
export default class LoginComponent implements OnInit {
  loginForm!: FormGroup<LoginForm>;
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #authService = inject(AuthService);

  get disableSubmit(): boolean {
    return this.loginForm.invalid;
  }

  ngOnInit(): void {
    this.loginForm = this.#fb.nonNullable.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  handleSubmit(): void {
    if (this.disableSubmit) return;

    const { username, password } = this.loginForm.value;
    this.#authService
      .handleLogin({ username: username!, password: password! })
      .subscribe({
        next: response => {
          const token = response.token;
          const tokenPayload = tokenPayloadAdapter(token.split('.')[1]);
          this.#authService.setToken(token);
          this.#authService.setTokenPayload(tokenPayload);

          this.#router.navigate(['/users']);
        },
        error: error => {
          console.warn(error);
          console.warn(error.error.error);
          console.warn(error.error.message);
        },
      });
  }
}
