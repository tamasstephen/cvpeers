import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { ConsentService } from '../../services/consent/consent.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss'],
})
export class CookieConsentComponent implements OnInit, OnDestroy {
  protected hasConsent = false;

  protected isPrivacyPage = false;

  readonly #consentService = inject(ConsentService);

  readonly #router = inject(Router);

  readonly #snackBar = inject(MatSnackBar);

  readonly #subscriptions: Array<() => void> = [];

  public ngOnInit(): void {
    this.hasConsent = this.#consentService.hasConsent();

    const routerSubscription = this.#router.events.subscribe((): void => {
      this.isPrivacyPage = this.#router.url === '/privacy';
    });
    this.#subscriptions.push((): void => routerSubscription.unsubscribe());

    const consentSubscription = this.#consentService.consent$.subscribe(
      (hasConsent: boolean): void => {
        this.hasConsent = hasConsent;
      }
    );
    this.#subscriptions.push((): void => consentSubscription.unsubscribe());
  }

  public ngOnDestroy(): void {
    while (this.#subscriptions.length) {
      const unsubscribe = this.#subscriptions.pop();
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }

  protected acceptConsent(): void {
    this.#consentService.giveConsent();
    this.#snackBar.open('Cookie preferences saved', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
