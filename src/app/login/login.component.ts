import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  authService = inject(AuthService);

  login() {
    if (!this.form.value.email || !this.form.value.password) {
      return;
    }
    const req = this.authService
      .login(this.form.value.email, this.form.value.password)
      .subscribe({
        next: (res) => {
          console.log('Successfully logged in', res);
          this.authService.setLoggedIn(true);
          this.router.navigate(['cv']);
        },
        error: (err) => {
          console.log('Error logging in', err);
        },
      });
    this.destroyRef.onDestroy(() => {
      req.unsubscribe();
    });
  }
}
