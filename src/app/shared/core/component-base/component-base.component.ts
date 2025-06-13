import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  template: '',
})
export class ComponentBaseComponent implements OnDestroy {
  #subscriptions: Subscription[] = [];

  public ngOnDestroy(): void {
    this.#subscriptions.forEach((subscription): void => subscription.unsubscribe());
  }

  protected addSubscription(subscription: Subscription): void {
    this.#subscriptions.push(subscription);
  }
}
