import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { LandingComponent } from './landing.component';
import { StructuredDataService } from '../services/seo/structured-data.service';

describe('LandingComponent', (): void => {
  const structuredDataService = {
    setWebsiteStructuredData: jasmine.createSpy('setWebsiteStructuredData'),
    setCvGeneratorStructuredData: jasmine.createSpy('setCvGeneratorStructuredData'),
    removeStructuredData: jasmine.createSpy('removeStructuredData'),
  };

  beforeEach(async (): Promise<void> => {
    structuredDataService.setWebsiteStructuredData.calls.reset();
    structuredDataService.setCvGeneratorStructuredData.calls.reset();
    structuredDataService.removeStructuredData.calls.reset();

    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [
        { provide: StructuredDataService, useValue: structuredDataService },
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('should create', (): void => {
    const fixture = TestBed.createComponent(LandingComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should set structured data on init', (): void => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    expect(structuredDataService.setWebsiteStructuredData).toHaveBeenCalledTimes(1);
    expect(structuredDataService.setCvGeneratorStructuredData).toHaveBeenCalledTimes(1);
  });

  it('should remove structured data on destroy', (): void => {
    const fixture = TestBed.createComponent(LandingComponent);

    fixture.destroy();

    expect(structuredDataService.removeStructuredData).toHaveBeenCalledTimes(1);
  });

  it('should render the two hero call-to-action buttons', (): void => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    const heroButtons = fixture.debugElement.queryAll(By.css('.cta-row button'));

    expect(heroButtons.length).toBe(2);
  });
});
