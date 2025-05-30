import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidepanelConfig } from '../services/sidepanel-provider/sidepanel-provider.service';
import { CommonModule } from '@angular/common';
import { ComponentBaseComponent } from '../shared/core/component-base/component-base.component';
import { NavigationEnd, Router } from '@angular/router';

/**
 * A component that displays a drawer-like sidepanel.
 */
@Component({
  selector: 'app-sidepanel',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  templateUrl: './sidepanel.component.html',
  styleUrl: './sidepanel.component.scss',
  host: {
    class: 'sidepanel-host',
  },
})
export class SidepanelComponent
  extends ComponentBaseComponent
  implements OnInit
{
  /**
   * A signal that determines if the sidepanel is open.
   */
  isOpen = signal(false);

  /**
   * A view container reference to the dynamic content.
   */
  @ViewChild('dynamicContent', { read: ViewContainerRef, static: true })
  private dynamicContentContainer!: ViewContainerRef;

  /**
   * A router instance.
   */
  #router = inject(Router);

  /**
   * A custom function that opens the sidepanel.
   * If provided, the sidepanel will be opened by calling this function.
   * @param open - A function that opens the sidepanel.
   */
  #openPanel?: (open: () => void) => void;

  /**
   * A signal that determines if the sidepanel is hidden.
   */
  protected isHidden = signal(true);

  /**
   * A function that opens the sidepanel.
   */
  public open() {
    // If a custom function is provided, use it to open the sidepanel.
    if (this.#openPanel) {
      this.#openPanel(() => this.isOpen.set(true));
    } else {
      // Otherwise, just set the sidepanel to open.
      this.isOpen.set(true);
    }
  }

  /**
   * A function that closes the sidepanel.
   */
  public close() {
    this.isOpen.set(false);
  }

  /**
   * A function that clears the sidepanel.
   */
  public clearSidepanel() {
    this.dynamicContentContainer.clear();
    this.#openPanel = undefined;
  }

  /**
   * A function that sets the content of the sidepanel.
   * @param config - A configuration object for the sidepanel.
   * @param openPanel - A custom function that opens the sidepanel.
   */
  public setContent<T>(
    config: SidepanelConfig<T>,
    openPanel?: (open: () => void) => void
  ) {
    this.dynamicContentContainer.clear();
    this.#openPanel = openPanel;
    const componentRef = this.dynamicContentContainer.createComponent(
      config.component
    );
    if (config.data) {
      Object.assign(
        componentRef.instance as Record<string, unknown>,
        config.data as Record<string, unknown>
      );
    }
  }

  ngOnInit() {
    this.addSubscription(
      this.#router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.isHidden.set(!event.url.includes('/cv'));
        }
      })
    );
  }
}
