import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { StructuredDataService } from '../services/seo/structured-data.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatIconModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit, OnDestroy {
  #structuredDataService = inject(StructuredDataService);

  public ngOnInit(): void {
    this.#structuredDataService.setWebsiteStructuredData();
    this.#structuredDataService.setCvGeneratorStructuredData();
  }

  public ngOnDestroy(): void {
    this.#structuredDataService.removeStructuredData();
  }
}
