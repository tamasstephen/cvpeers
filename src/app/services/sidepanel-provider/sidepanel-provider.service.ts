import { Injectable, OnDestroy, Type, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentBaseComponent } from '../../shared/core/component-base/component-base.component';
import { SidepanelComponent } from '../../sidepanel/sidepanel.component';

export interface SidepanelConfig<T = unknown> {
  component: Type<T>;
  data?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class SidepanelProviderService extends ComponentBaseComponent implements OnDestroy {
  #sidepanelComponent?: SidepanelComponent;

  #currentConfig?: SidepanelConfig;

  #router = inject(Router);

  public openSidepanel<T>(config: SidepanelConfig<T>): void {
    if (!this.#sidepanelComponent) {
      console.warn('Sidepanel component not set');
      return;
    }
    this.#currentConfig = config;
    this.#sidepanelComponent.setContent(config);
    this.#sidepanelComponent.open();
  }

  public setSidepanelConfig<T>(config: SidepanelConfig<T>): void {
    if (!this.#sidepanelComponent) {
      console.warn('Sidepanel component not set');
      return;
    }
    this.#currentConfig = config;
    this.#sidepanelComponent.setContent(config);
  }

  public closeSidepanel(): void {
    if (!this.#sidepanelComponent) {
      console.warn('Sidepanel component not set');
      return;
    }
    this.#currentConfig = undefined;
    this.#sidepanelComponent.close();
  }

  public clearSidepanel(): void {
    if (!this.#sidepanelComponent) {
      console.warn('Sidepanel component not set');
      return;
    }
    this.#sidepanelComponent.clearSidepanel();
  }

  public setSidepanelComponent(component: SidepanelComponent): void {
    this.#sidepanelComponent = component;
    /*     this.addSubscription(
      this.#router.events.subscribe((value) => {
        console.log('url', value);
      })
    ); */
  }

  public getCurrentConfig(): SidepanelConfig | undefined {
    return this.#currentConfig;
  }
}
