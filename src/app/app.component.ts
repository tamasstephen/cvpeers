import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { SidepanelProviderService } from './services/sidepanel-provider/sidepanel-provider.service';
import { HeaderComponent } from './shared/header/header.component';
import { SidepanelComponent } from './sidepanel/sidepanel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidepanelComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild(SidepanelComponent) public sidepanel!: SidepanelComponent;

  protected primeng = inject(PrimeNG);

  protected sidepanelProvider = inject(SidepanelProviderService);

  public ngOnInit(): void {
    this.primeng.ripple.set(true);
  }

  public ngAfterViewInit(): void {
    this.sidepanelProvider.setSidepanelComponent(this.sidepanel);
  }
}
