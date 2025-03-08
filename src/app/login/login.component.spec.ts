import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
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

  it('should have a password input', () => {
    const passwordInput = fixture.debugElement.query(
      By.css('input[formControlName="password"]')
    );
    expect(passwordInput).toBeTruthy();
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
});
