import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mobile-warning',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  template: `
    <div class="mobile-warning">
      <div class="warning-content">
        <h1>💻 Desktop Only Feature</h1>
        <p>
          We apologize, but the CV generator is only available on desktop devices to ensure the best
          possible experience.
        </p>
        <p>Please visit us on your desktop computer to create your CV.</p>
        <button mat-flat-button color="primary" routerLink="/">Go to Home</button>
      </div>
    </div>
  `,
  styles: [
    `
      .mobile-warning {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 1rem;
        background-color: #f5f5f5;
      }

      .warning-content {
        text-align: center;
        background-color: #ffffff;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.12);
        max-width: 400px;
        width: 100%;

        h1 {
          margin: 0 0 1.5rem;
          font-size: 1.5rem;
          color: #1976d2;
        }

        p {
          margin: 0 0 1rem;
          line-height: 1.5;
          color: #424242;

          &:last-of-type {
            margin-bottom: 1.5rem;
          }
        }

        button {
          margin-top: 0.5rem;
        }
      }
    `,
  ],
})
export class MobileWarningComponent {
  protected readonly title = 'Desktop Only Feature';
}
