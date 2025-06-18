import { Injectable, OnDestroy, Type } from '@angular/core';
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

  public openSidepanel<T>(config: SidepanelConfig<T>): void {
    if (!this.#sidepanelComponent) {
      console.warn('Sidepanel component not set');
      return;
    }
    this.#currentConfig = config;
    this.#sidepanelComponent.setContent(config);
    this.#sidepanelComponent.open();
  }

  public open(): void {
    this.#sidepanelComponent?.open();
  }

  public displaySidepanel(): void {
    this.#sidepanelComponent?.displaySidepanel();
  }

  public hideSidepanel(): void {
    this.#sidepanelComponent?.hideSidepanel();
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
  }

  public getCurrentConfig(): SidepanelConfig | undefined {
    return this.#currentConfig;
  }
}
