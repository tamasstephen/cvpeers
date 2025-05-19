import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Component } from '@angular/core';

@Component({
  template: '',
})
export class ComponentBaseComponent implements OnDestroy {
  #subscriptions: Subscription[] = [];

  protected addSubscription(subscription: Subscription) {
    this.#subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.#subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
