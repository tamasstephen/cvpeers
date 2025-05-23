import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { SidepanelComponent } from './sidepanel/sidepanel.component';
import { SidepanelProviderService } from './services/sidepanel-provider/sidepanel-provider.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidepanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  @ViewChild(SidepanelComponent) sidepanel!: SidepanelComponent;

  title = 'angular-starter';

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
