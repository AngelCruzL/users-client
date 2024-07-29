import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import {
  LoginCredentials,
  LoginResponse,
  TokenPayload,
} from '../../modules/auth/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #apiUrl = environment.LOGIN_URL;
  #http = inject(HttpClient);
  #token = signal<string | null>(null);
  $token = computed(() => this.#token());
  $isAuthenticated = computed(() => !!this.#token());
  #tokenPayload = signal<TokenPayload | null>(null);
  $tokenPayload = computed(() => this.#tokenPayload());

  setToken(token: string): void {
    this.#token.set(token);
  }

  setTokenPayload(tokenPayload: TokenPayload): void {
    this.#tokenPayload.set(tokenPayload);
  }

  handleLogin(loginCredentials: LoginCredentials): Observable<LoginResponse> {
    return this.#http.post<LoginResponse>(this.#apiUrl, loginCredentials);
  }

  handleLogout(): void {
    this.#token.set(null);
    this.#tokenPayload.set(null);
  }
}
