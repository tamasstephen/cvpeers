import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { SidepanelComponent } from './sidepanel/sidepanel.component';
import { SidepanelProviderService } from './services/sidepanel-provider/sidepanel-provider.service';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidepanelComponent, HeaderComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <app-sidepanel></app-sidepanel>
    </div>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        position: relative;
      }

      main {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
    `,
  ],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(SidepanelComponent) sidepanel!: SidepanelComponent;

  constructor(
    private primeng: PrimeNG,
    private sidepanelProvider: SidepanelProviderService
  ) {}

  ngOnInit(): void {
    this.primeng.ripple.set(true);
  }

  ngAfterViewInit() {
    this.sidepanelProvider.setSidepanelComponent(this.sidepanel);
  }
}
