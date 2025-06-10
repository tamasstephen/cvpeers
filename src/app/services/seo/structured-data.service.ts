import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StructuredDataService {
  readonly #document = inject(DOCUMENT);

  public addStructuredData(type: string, data: Record<string, unknown>): void {
    const script = this.#document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    });
    this.#document.head.appendChild(script);
  }

  public removeStructuredData(): void {
    const scripts: NodeListOf<HTMLScriptElement> = this.#document.head.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    scripts.forEach((script): void => script.remove());
  }

  public setWebsiteStructuredData(): void {
    this.addStructuredData('WebSite', {
      name: 'CVPeers - Professional CV Generator',
      description:
        'Create professional, customizable CVs and resumes with our easy-to-use CV Generator. Build your perfect resume in minutes.',
      url: 'https://cvpeers.com',
    });

    this.addStructuredData('Organization', {
      name: 'CVPeers',
      url: 'https://cvpeers.com',
      description: 'Professional CV and resume generation platform',
    });
  }

  public setCvGeneratorStructuredData(): void {
    this.addStructuredData('SoftwareApplication', {
      name: 'CVPeers CV Generator',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    });
  }

  public setCvFormStructuredData(): void {
    this.addStructuredData('WebApplication', {
      name: 'CV Builder',
      applicationCategory: 'BusinessApplication',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Professional CV templates',
        'Real-time preview',
        'PDF export',
        'Custom sections',
        'Rich text formatting',
      ],
    });
  }
}
