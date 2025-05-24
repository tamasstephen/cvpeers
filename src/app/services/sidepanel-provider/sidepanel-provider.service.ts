import { Injectable, Type, OnDestroy, inject } from '@angular/core';
import { SidepanelComponent } from '../../sidepanel/sidepanel.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentBaseComponent } from '../../shared/core/component-base/component-base.component';

export interface SidepanelConfig<T = any> {
  component: Type<T>;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class SidepanelProviderService
  extends ComponentBaseComponent
  implements OnDestroy
{
  constructor() {
    super();
  }

  #sidepanelComponent?: SidepanelComponent;

  #currentConfig?: SidepanelConfig;

  #router = inject(Router);

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
    /*     this.addSubscription(
      this.#router.events.subscribe((value) => {
        console.log('url', value);
      })
    ); */
  }

  public getCurrentConfig() {
    return this.#currentConfig;
  }
}
