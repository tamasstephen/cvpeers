import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';
import { debounceTime, distinctUntilChanged, filter, startWith } from 'rxjs';
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
  imports: [CommonModule, DatePipe, MatFormFieldModule, MatSelectModule],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss',
})
export class CvComponent extends ComponentBaseComponent implements OnInit, AfterViewInit {
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
   * Preview HTML cloned from the raw CV markup.
   */
  protected previewHtml = signal<SafeHtml | null>(null);

  /**
   * Preview pages with vertical offsets.
   */
  protected previewPages = signal<{ offset: number }[]>([{ offset: 0 }]);

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

  @ViewChild('cvRaw') protected cvRaw?: ElementRef<HTMLElement>;

  #previewReady = false;

  #previewUpdateHandle: number | null = null;

  public constructor() {
    super();
  }

  public ngOnInit(): void {
    // Wait for form to be initialized and subscribe to changes
    this.addSubscription(
      this.cvForm.valueChanges
        .pipe(
          startWith(this.cvForm.value),
          filter((): boolean => !!this.cvForm), // Only proceed if form exists
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe((value): void => {
          this.selectedTemplate.set(value.templateForm as Template);
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

          this.#schedulePreviewUpdate();
        })
    );
  }

  public ngAfterViewInit(): void {
    this.#previewReady = true;
    this.#schedulePreviewUpdate();
  }

  /**
   * Handles template selection change
   */

  #schedulePreviewUpdate(): void {
    if (!this.#previewReady) return;
    if (this.#previewUpdateHandle !== null) {
      window.cancelAnimationFrame(this.#previewUpdateHandle);
    }
    this.#previewUpdateHandle = window.requestAnimationFrame((): void => {
      this.#previewUpdateHandle = null;
      void this.#updatePreviewPages();
    });
  }

  async #updatePreviewPages(): Promise<void> {
    const raw = this.cvRaw?.nativeElement;
    if (!raw) return;

    await this.#waitForAssets(raw);

    const previewSource = raw.cloneNode(true) as HTMLElement;
    previewSource.removeAttribute('id');
    previewSource.classList.remove('cv-raw');
    previewSource.classList.add('cv-preview-source');
    previewSource.style.width = '210mm';
    previewSource.style.padding = '10mm';
    previewSource.style.boxSizing = 'border-box';
    previewSource.style.margin = '0';
    previewSource.style.position = 'relative';

    const measureContainer = document.createElement('div');
    measureContainer.style.position = 'fixed';
    measureContainer.style.top = '-10000px';
    measureContainer.style.left = '-10000px';
    measureContainer.style.pointerEvents = 'none';
    measureContainer.style.opacity = '0';
    measureContainer.style.width = '210mm';
    measureContainer.appendChild(previewSource);
    document.body.appendChild(measureContainer);

    await this.#waitForAssets(previewSource);

    const pageHeightPx = this.#getPageHeightPx(measureContainer);
    const totalHeight = previewSource.scrollHeight;
    const pageCount = Math.max(1, Math.ceil(totalHeight / pageHeightPx));

    this.previewPages.set(
      Array.from({ length: pageCount }, (_: unknown, index: number) => ({
        offset: Math.round(index * pageHeightPx),
      }))
    );
    this.previewHtml.set(this.sanitizer.bypassSecurityTrustHtml(previewSource.outerHTML));

    document.body.removeChild(measureContainer);
  }

  async #waitForAssets(container: HTMLElement): Promise<void> {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
    const images = Array.from(container.querySelectorAll('img'));
    await Promise.all(
      images.map(
        (img): Promise<void> =>
          img.complete && img.naturalWidth > 0
            ? Promise.resolve()
            : new Promise((resolve): void => {
                img.addEventListener('load', (): void => resolve(), { once: true });
                img.addEventListener('error', (): void => resolve(), { once: true });
              })
      )
    );
  }

  #mmToPx(mm: number): number {
    const pxPerMm = 96 / 25.4;
    return Math.round(mm * pxPerMm);
  }

  #getPageHeightPx(container: HTMLElement): number {
    const probe = document.createElement('div');
    probe.style.position = 'absolute';
    probe.style.top = '0';
    probe.style.left = '0';
    probe.style.width = '210mm';
    probe.style.height = '297mm';
    probe.style.visibility = 'hidden';
    container.appendChild(probe);
    const measured = probe.getBoundingClientRect().height;
    container.removeChild(probe);
    return measured > 0 ? measured : this.#mmToPx(297);
  }
}
