import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy-link',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="footer">
      <a routerLink="/privacy" class="privacy-link">Privacy Policy</a>
    </footer>
  `,
  styles: [
    `
      .footer {
        background: var(--color-bg);
        padding: 1rem 2rem;
        display: flex;
        justify-content: flex-end;
        margin-top: auto;
      }

      .privacy-link {
        color: var(--color-muted);
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.2s ease;

        &:hover {
          color: var(--color-text);
        }
      }
    `,
  ],
})
export class PrivacyLinkComponent {}
