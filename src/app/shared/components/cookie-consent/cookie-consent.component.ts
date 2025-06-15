import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConsentService } from '../../services/consent/consent.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, RouterLink],
  template: `
    <p-dialog
      [visible]="!hasConsent && !isPrivacyPage"
      [modal]="true"
      [closable]="false"
      [draggable]="false"
      [resizable]="false"
      styleClass="consent-dialog"
      position="bottom">
      <div class="consent-content">
        <h2 class="title">🍪 We value your privacy</h2>
        <p>
          We use strictly necessary local storage to make the CV generator work. Read our
          <a routerLink="/privacy">Privacy Policy</a> for more details.
        </p>
        <div class="consent-actions">
          <p-button label="Accept" (onClick)="acceptConsent()" severity="primary"></p-button>
        </div>
      </div>
    </p-dialog>
  `,
  styles: [
    `
      :host ::ng-deep {
        .consent-dialog {
          max-width: 600px !important;
          margin: 1rem;

          .p-dialog-content {
            padding: 1.5rem;
          }
        }

        .p-dialog-mask {
          background-color: rgba(0, 0, 0, 0.4);
        }
      }

      .consent-content {
        .title {
          margin: 0 0 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
        }

        p {
          margin: 0 0 1rem;
          line-height: 1.5;
        }

        a {
          color: var(--primary-color);
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .consent-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
      }
    `,
  ],
})
export class CookieConsentComponent implements OnInit {
  protected hasConsent = false;

  protected isPrivacyPage = false;

  readonly #consentService = inject(ConsentService);

  readonly #router = inject(Router);

  public ngOnInit(): void {
    this.hasConsent = this.#consentService.hasConsent();

    // Subscribe to route changes to check if we're on the privacy page
    this.#router.events.subscribe((): void => {
      this.isPrivacyPage = this.#router.url === '/privacy';
    });

    this.#consentService.consent$.subscribe((hasConsent: boolean): void => {
      this.hasConsent = hasConsent;
    });
  }

  protected acceptConsent(): void {
    this.#consentService.giveConsent();
  }
}
