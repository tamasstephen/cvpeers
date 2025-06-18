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
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss'],
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
