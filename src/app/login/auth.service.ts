import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  // TODO: update with real data
  private isLoggedIn = signal(true);
  private router = inject(Router);

  login(email: string, password: string) {
    return this.http.post('http://localhost:3000/api/v1/login', {
      email,
      password,
    });
  }

  register(email: string, password: string, name: string) {
    return this.http.post('http://localhost:3000/api/v1/users', {
      email,
      password,
      name,
    });
  }

  setLoggedIn(value: boolean) {
    this.isLoggedIn.set(value);
  }

  geIstLoggedIn() {
    return this.isLoggedIn();
  }

  constructor() {}
}
