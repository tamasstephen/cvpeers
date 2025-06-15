import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  private readonly CONSENT_KEY = 'storage_consent';

  private consentSubject = new BehaviorSubject<boolean>(this.hasStoredConsent());

  public consent$ = this.consentSubject.asObservable();

  private hasStoredConsent(): boolean {
    return localStorage.getItem(this.CONSENT_KEY) === 'true';
  }

  public giveConsent(): void {
    localStorage.setItem(this.CONSENT_KEY, 'true');
    this.consentSubject.next(true);
  }

  public withdrawConsent(): void {
    localStorage.removeItem(this.CONSENT_KEY);
    this.consentSubject.next(false);
  }

  public hasConsent(): boolean {
    return this.consentSubject.value;
  }
}
