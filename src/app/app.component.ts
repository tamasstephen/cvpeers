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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
