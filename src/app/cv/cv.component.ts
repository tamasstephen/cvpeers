import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import '../assets/fonts/Geist-SemiBold-normal.js';
import '../assets/fonts/Geist-Variable_pdf-normal.js';
import '../assets/fonts/GeistMono-SemiBold-bold.js';
import { Template } from '../enums/template.enum.js';
import { PdfGeneratorService } from '../services/pdf-generator/pdf-generator.service';
import { ComponentBaseComponent } from '../shared/core/component-base/component-base.component';
import { CvForm } from '../types/cv-form';
import { EducationFormValues } from '../types/education-form.js';
import { ExperienceFormValues } from '../types/experience-form.js';
import { LanguageFormValues } from '../types/language-form.js';
import { PersonalDetailsFormValues } from '../types/personal-details-form.js';
import { SocialFormValues } from '../types/social.js';

const placeholderPersonalDetails: PersonalDetailsFormValues = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  website: 'https://johndoe.com',
  headline: 'Senior Software Engineer',
};

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

  protected templates = Template;

  /**
   * The personal details of the CV
   */
  protected personalDetails = signal<PersonalDetailsFormValues>(placeholderPersonalDetails);

  /**
   * The social links of the CV
   */
  protected socialLinks = signal<SocialFormValues>([]);

  /**
   * The summary of the CV
   */
  protected summary = signal<string | undefined>(undefined);

  /**
   * The parsed summary of the CV
   */
  protected parsedSummary = signal<SafeHtml | undefined>(undefined);

  /**
   * The experience of the CV
   */
  protected experience = signal<ExperienceFormValues>([]);

  /**
   * The education of the CV
   */
  protected education = signal<EducationFormValues>([]);

  /**
   * The expertise of the CV
   */
  protected expertise = signal<string[]>([]);

  /**
   * The strengths of the CV
   */
  protected strengths = signal<string[]>([]);

  /**
   * The languages of the CV
   */
  protected languages = signal<LanguageFormValues>([]);

  /**
   * The selected template
   */
  protected selectedTemplate = signal<Template>(Template.MINIMAL);

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
          this.personalDetails.set(value.personalDetailsForm as PersonalDetailsFormValues);
          this.socialLinks.set(value.socialForm?.social as SocialFormValues);
          if (value.summary !== this.summary()) {
            this.summary.set(value.summary);

            const cleanHTML: string = DOMPurify.sanitize(this.summary() ?? '');
            const parsedForPdf = this.pdfGeneratorService.parseSummaryHtml(cleanHTML);
            const withFonts = this.pdfGeneratorService.addGeistFontToHtml(parsedForPdf);
            this.parsedSummary.set(this.sanitizer.bypassSecurityTrustHtml(withFonts));
          }
          if (value.experienceForm) {
            this.experience.set(value.experienceForm as ExperienceFormValues);
          }
          if (value.educationForm) {
            this.education.set(value.educationForm as EducationFormValues);
          }
          if (value.expertiseForm) {
            this.expertise.set(value.expertiseForm as string[]);
          }
          if (value.strengthsForm) {
            this.strengths.set(value.strengthsForm as string[]);
          }
          if (value.languagesForm) {
            this.languages.set(value.languagesForm as LanguageFormValues);
          }
        })
    );
  }

  /**
   * Handles template selection change
   */
  protected onTemplateChange(template: Template): void {
    this.selectedTemplate.set(template);
  }
}
