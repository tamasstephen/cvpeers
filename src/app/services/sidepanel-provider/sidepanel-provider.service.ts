import { Injectable, Type } from '@angular/core';
import { SidepanelComponent } from '../../sidepanel/sidepanel.component';

export interface SidepanelConfig<T = any> {
  component: Type<T>;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class SidepanelProviderService {
  constructor() {}

  #sidepanelComponent?: SidepanelComponent;
  #currentConfig?: SidepanelConfig;

  public openSidepanel<T>(config: SidepanelConfig<T>) {
    if (!this.#sidepanelComponent) {
      console.warn('Sidepanel component not set');
      return;
    }
    this.#currentConfig = config;
    this.#sidepanelComponent.setContent(config);
    this.#sidepanelComponent.open();
  }

  public setSidepanelConfig<T>(config: SidepanelConfig<T>) {
    if (!this.#sidepanelComponent) {
      console.warn('Sidepanel component not set');
      return;
    }
    this.#currentConfig = config;
    this.#sidepanelComponent.setContent(config);
  }

  public closeSidepanel() {
    if (!this.#sidepanelComponent) {
      console.warn('Sidepanel component not set');
      return;
    }
    this.#currentConfig = undefined;
    this.#sidepanelComponent.close();
  }

  public clearSidepanel() {
    if (!this.#sidepanelComponent) {
      console.warn('Sidepanel component not set');
      return;
    }
    this.#sidepanelComponent.clearSidepanel();
  }

  public setSidepanelComponent(component: SidepanelComponent) {
    this.#sidepanelComponent = component;
  }

  public getCurrentConfig() {
    return this.#currentConfig;
  }
}
