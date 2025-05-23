import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="header">
      <div class="header-content">
        <a routerLink="/" class="logo">
          <span class="logo-text">CV</span>
          <span class="logo-dot">.</span>
        </a>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        height: 60px;
        background: white;
      }

      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        height: 100%;
        display: flex;
        align-items: center;
      }

      .logo {
        display: flex;
        align-items: center;
        text-decoration: none;
        font-family: 'Geist', sans-serif;
        font-weight: 700;
        font-size: 1.25rem;
        color: #000000;
        transition: all 0.2s ease;
        padding: 0.5rem;
        margin: -0.5rem;
        border-radius: 8px;

        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      }

      .logo-text {
        letter-spacing: -0.02em;
      }

      .logo-dot {
        color: #000000;
        margin-left: -0.1em;
      }

      @media (max-width: 768px) {
        .header-content {
          padding: 0 1rem;
        }
      }
    `,
  ],
})
export class HeaderComponent {}
