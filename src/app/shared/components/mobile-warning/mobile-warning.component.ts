import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-mobile-warning',
  standalone: true,
  imports: [ButtonModule, RouterLink],
  template: `
    <div class="mobile-warning">
      <div class="warning-content">
        <h1>💻 Desktop Only Feature</h1>
        <p>
          We apologize, but the CV generator is only available on desktop devices to ensure the best
          possible experience.
        </p>
        <p>Please visit us on your desktop computer to create your CV.</p>
        <p-button label="Go to Home" routerLink="/" styleClass="p-button-primary"></p-button>
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
        background-color: var(--surface-ground);
      }

      .warning-content {
        text-align: center;
        background-color: var(--surface-card);
        padding: 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--card-shadow);
        max-width: 400px;
        width: 100%;

        h1 {
          margin: 0 0 1.5rem;
          font-size: 1.5rem;
          color: var(--primary-color);
        }

        p {
          margin: 0 0 1rem;
          line-height: 1.5;
          color: var(--text-color);

          &:last-of-type {
            margin-bottom: 1.5rem;
          }
        }
      }
    `,
  ],
})
export class MobileWarningComponent {}
