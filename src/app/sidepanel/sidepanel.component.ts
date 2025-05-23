import { Component, ViewChild, ViewContainerRef, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidepanelConfig } from '../services/sidepanel-provider/sidepanel-provider.service';

@Component({
  selector: 'app-sidepanel',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './sidepanel.component.html',
  styleUrl: './sidepanel.component.scss',
})
export class SidepanelComponent {
  isOpen = signal(false);

  @ViewChild('dynamicContent', { read: ViewContainerRef, static: true })
  private dynamicContentContainer!: ViewContainerRef;

  /**
   * A custom function that opens the sidepanel.
   * If provided, the sidepanel will be opened by calling this function.
   * @param open - A function that opens the sidepanel.
   */
  #openPanel?: (open: () => void) => void;

  public open() {
    if (this.#openPanel) {
      this.#openPanel(() => this.isOpen.set(true));
    } else {
      this.isOpen.set(true);
    }
  }

  /**
   * A function that closes the sidepanel.
   */
  public close() {
    this.isOpen.set(false);
  }

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
}
