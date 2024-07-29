import { FormControl } from '@angular/forms';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  username: string;
}

export interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

export interface LoginErrorResponse {
  message: string;
  error: string;
}
