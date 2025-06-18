import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import '../assets/fonts/Geist-SemiBold-normal.js';
import '../assets/fonts/Geist-Variable_pdf-normal.js';
import '../assets/fonts/GeistMono-SemiBold-bold.js';
import { PdfGeneratorService } from '../services/pdf-generator/pdf-generator.service';
import { ComponentBaseComponent } from '../shared/core/component-base/component-base.component';
import { CvForm } from '../types/cv-form';
import { EducationFormValues } from '../types/education-form.js';
import { ExperienceFormValues } from '../types/experience-form.js';
import { LanguageFormValues } from '../types/language-form.js';
import { PersonalDetailsFormValues } from '../types/personal-details-form.js';
import { SocialFormValues } from '../types/social.js';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss',
})
export class CvComponent extends ComponentBaseComponent implements OnInit {
  /**
   * The form group of the CV
   */
  @Input() public cvForm!: CvForm;

  /**
   * The personal details of the CV
   */
  protected personalDetails: PersonalDetailsFormValues | undefined = undefined;

  /**
   * The social links of the CV
   */
  protected socialLinks: SocialFormValues = [];

  /**
   * The summary of the CV
   */
  protected summary: string | undefined = undefined;

  /**
   * The parsed summary of the CV
   */
  protected parsedSummary = signal<SafeHtml | undefined>(undefined);

  /**
   * The experience of the CV
   */
  protected experience: ExperienceFormValues | undefined = undefined;

  /**
   * The education of the CV
   */
  protected education: EducationFormValues | undefined = undefined;

  /**
   * The expertise of the CV
   */
  protected expertise: string[] | undefined = undefined;

  /**
   * The strengths of the CV
   */
  protected strengths: string[] | undefined = undefined;

  /**
   * The languages of the CV
   */
  protected languages: LanguageFormValues | undefined = undefined;

  /**
   * The PDF generator service
   */
  protected pdfGeneratorService = inject(PdfGeneratorService);

  /**
   * The sanitizer service
   */
  protected sanitizer = inject(DomSanitizer);

  public constructor() {
    super();
    this.personalDetails = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      website: 'https://johndoe.com',
      headline: 'Senior Software Engineer',
    };
  }

  public ngOnInit(): void {
    // Wait for form to be initialized and subscribe to changes
    this.addSubscription(
      this.cvForm.valueChanges
        .pipe(
          filter((): boolean => !!this.cvForm), // Only proceed if form exists
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe((value): void => {
          this.personalDetails = value.personalDetailsForm as PersonalDetailsFormValues;
          this.socialLinks = value.socialForm?.social as SocialFormValues;
          if (value.summary !== this.summary) {
            this.summary = value.summary;

            const cleanHTML: string = DOMPurify.sanitize(this.summary ?? '');
            this.parsedSummary.set(
              this.sanitizer.bypassSecurityTrustHtml(
                this.pdfGeneratorService.addGeistFontToHtml(cleanHTML)
              )
            );
          }
          this.experience = value.experienceForm as unknown as ExperienceFormValues;
          this.education = value.educationForm as unknown as EducationFormValues;
          this.expertise = value.expertiseForm as unknown as string[];
          this.strengths = value.strengthsForm as unknown as string[];
          this.languages = value.languagesForm as unknown as LanguageFormValues;
        })
    );
  }
}
