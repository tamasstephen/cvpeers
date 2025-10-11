import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidepanelProviderService } from './services/sidepanel-provider/sidepanel-provider.service';
import { CookieConsentComponent } from './shared/components/cookie-consent/cookie-consent.component';
import { PrivacyLinkComponent } from './shared/components/privacy-link/privacy-link.component';
import { ComponentBaseComponent } from './shared/core/component-base/component-base.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidepanelComponent } from './sidepanel/sidepanel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidepanelComponent,
    HeaderComponent,
    PrivacyLinkComponent,
    CookieConsentComponent,
  ],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <app-sidepanel></app-sidepanel>
      <app-privacy-link></app-privacy-link>
      <app-cookie-consent></app-cookie-consent>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends ComponentBaseComponent implements AfterViewInit, OnInit {
  @ViewChild(SidepanelComponent) public sidepanel!: SidepanelComponent;

  protected router = inject(Router);

  protected sidepanelProvider = inject(SidepanelProviderService);

  public ngOnInit(): void {
    this.addSubscription(
      this.router.events.subscribe((event): void => {
        if (event instanceof NavigationEnd && this.router.url.includes('/cv')) {
          this.sidepanelProvider.open();
        }
      })
    );
  }

  public ngAfterViewInit(): void {
    this.sidepanelProvider.setSidepanelComponent(this.sidepanel);
  }
}
