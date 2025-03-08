import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reg',
  template: '<div>Mock Registration Component</div>',
})
class MockRegistrationComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideRouter([
          { path: 'registration', component: MockRegistrationComponent },
        ]),
        provideHttpClientTesting(),
        AuthService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form', () => {
    const form = fixture.debugElement.query(By.css('form'));
    expect(form).toBeTruthy();
  });

  it('should have a email input', () => {
    const emailInput = fixture.debugElement.query(
      By.css('input[formControlName="email"]')
    );
    expect(emailInput).toBeTruthy();
  });

  it('should allow user inputs', () => {
    const emailInput = fixture.debugElement.query(
      By.css('input[formControlName="email"]')
    );
    emailInput.nativeElement.value = 'test@test.com';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(emailInput.nativeElement.value).toBe('test@test.com');
  });

  it('should show error message when email is invalid', () => {
    const emailInput = fixture.debugElement.query(
      By.css('input[formControlName="email"]')
    );
    emailInput.nativeElement.value = 'invalid-email';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(emailInput.nativeElement.classList.contains('ng-invalid')).toBe(
      true
    );
  });

  it('should have a password input', () => {
    const passwordInput = fixture.debugElement.query(
      By.css('input[formControlName="password"]')
    );
    expect(passwordInput).toBeTruthy();
  });

  it('should allow user inputs', () => {
    const passwordInput = fixture.debugElement.query(
      By.css('input[formControlName="password"]')
    );
    passwordInput.nativeElement.value = 'password';
    passwordInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(passwordInput.nativeElement.value).toBe('password');
  });

  it('should show error message when password is invalid', () => {
    const passwordInput = fixture.debugElement.query(
      By.css('input[formControlName="password"]')
    );
    passwordInput.nativeElement.value = '';
    passwordInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(passwordInput.nativeElement.classList.contains('ng-invalid')).toBe(
      true
    );
  });

  it('should have a submit button', () => {
    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    );
    expect(submitButton).toBeTruthy();
  });

  it('should have a router link to registration', () => {
    const routerLink = fixture.debugElement.query(By.css('a'));
    expect(routerLink).toBeTruthy();
    expect(routerLink.attributes['routerLink']).toBe('/registration');
  });

  it('should call authService.login when form is submitted', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    const loginSpy = spyOn(authService, 'login');
    const emailInput = fixture.debugElement.query(
      By.css('input[formControlName="email"]')
    );
    emailInput.nativeElement.value = 'test@test.com';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const passwordInput = fixture.debugElement.query(
      By.css('input[formControlName="password"]')
    );
    passwordInput.nativeElement.value = 'password';
    passwordInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    );
    submitButton.nativeElement.click();
    fixture.detectChanges();
    expect(loginSpy).toHaveBeenCalled();
  });

  it('should not call authService.login when form is invalid', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    const loginSpy = spyOn(authService, 'login');
    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    );
    submitButton.nativeElement.click();
    fixture.detectChanges();
    expect(loginSpy).not.toHaveBeenCalled();
  });

  it('should navigate to registration when router link is clicked', async () => {
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    const routerLink = fixture.debugElement.query(By.css('a'));
    routerLink.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(location.path()).toBe('/registration');
  });
});
