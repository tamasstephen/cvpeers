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
import { Template } from '../enums/template.enum';
import { PdfGeneratorService } from '../services/pdf-generator/pdf-generator.service';
import { ComponentBaseComponent } from '../shared/core/component-base/component-base.component';
import { CvForm } from '../types/cv-form';
import { EducationFormValues } from '../types/education-form';
import { ExperienceFormValues } from '../types/experience-form';
import { LanguageFormValues } from '../types/language-form';
import { PersonalDetailsFormValues } from '../types/personal-details-form';
import { SocialFormValues } from '../types/social';
import { KeepTogetherBlockMeasurement, resolveSemanticPageSlices } from './preview-pagination.util';

const placeholderPersonalDetails: PersonalDetailsFormValues = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  website: 'https://johndoe.com',
  headline: 'Senior Software Engineer',
};

const PREVIEW_PAGE_WIDTH_MM = 210;
const PREVIEW_PAGE_HEIGHT_MM = 297;
const PREVIEW_PAGE_MARGIN_MM = 10;
const PREVIEW_PAGE_CONTENT_WIDTH_MM = PREVIEW_PAGE_WIDTH_MM - PREVIEW_PAGE_MARGIN_MM * 2;
const PREVIEW_PAGE_CONTENT_HEIGHT_MM = PREVIEW_PAGE_HEIGHT_MM - PREVIEW_PAGE_MARGIN_MM * 2;
const PREVIEW_PAGE_CONTENT_HEIGHT_PX_FALLBACK = Math.round(PREVIEW_PAGE_CONTENT_HEIGHT_MM * (96 / 25.4));

const PREVIEW_KEEP_TOGETHER_SELECTOR = [
  '.header-section',
  '.header-section-modern',
  '.summary-section',
  '.summary-section p',
  '.summary-section li',
  '.experience-item',
  '.experience-item .job-header',
  '.education-item',
  '.skills-section',
  '.skills-section li',
  '.languages-section',
  '.languages-grid > div',
  '.soft-skills-section',
  '.soft-skills-section li',
  '.section-modern',
  '.section-modern p',
  '.section-modern li',
  '.experience-item-modern',
  '.experience-item-modern .job-header-modern',
  '.education-item-modern',
  '.job-description li',
  '.job-description-modern li',
  'h1',
  'h2',
  'h3',
  'h4',
  'p',
  'li',
].join(', ');

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

  @ViewChild('cvRaw') protected cvRaw?: ElementRef<HTMLElement>;

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
  protected previewPages = signal<{ offset: number; height: number }[]>([
    { offset: 0, height: PREVIEW_PAGE_CONTENT_HEIGHT_PX_FALLBACK },
  ]);

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
          this.selectedTemplate.set(value.templateForm ?? Template.MINIMAL);
          this.personalDetails.set(this.#resolvePersonalDetails(value.personalDetailsForm));
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
    previewSource.style.width = '100%';
    previewSource.style.padding = '0';
    previewSource.style.boxSizing = 'border-box';
    previewSource.style.margin = '0';
    previewSource.style.position = 'relative';

    const measureContainer = document.createElement('div');
    measureContainer.style.position = 'fixed';
    measureContainer.style.top = '-10000px';
    measureContainer.style.left = '-10000px';
    measureContainer.style.pointerEvents = 'none';
    measureContainer.style.opacity = '0';
    measureContainer.style.width = `${PREVIEW_PAGE_CONTENT_WIDTH_MM}mm`;
    measureContainer.appendChild(previewSource);
    document.body.appendChild(measureContainer);

    await this.#waitForAssets(previewSource);

    const pageContentHeightPx = this.#getPageContentHeightPx(measureContainer);
    const totalHeight = previewSource.scrollHeight;
    const semanticBlocks = this.#measureSemanticBlocks(previewSource, pageContentHeightPx);
    const pageSlices = resolveSemanticPageSlices({
      pageHeight: pageContentHeightPx,
      totalHeight,
      blocks: semanticBlocks,
    });
    const fallbackSliceHeight = pageContentHeightPx > 0 ? pageContentHeightPx : totalHeight;

    this.previewPages.set(
      pageSlices.length > 0
        ? pageSlices
        : [
            {
              offset: 0,
              height: fallbackSliceHeight,
            },
          ]
    );
    this.previewHtml.set(this.sanitizer.bypassSecurityTrustHtml(previewSource.outerHTML));

    document.body.removeChild(measureContainer);
  }

  #measureSemanticBlocks(
    previewSource: HTMLElement,
    pageHeightPx: number
  ): KeepTogetherBlockMeasurement[] {
    const keepTogetherElements = Array.from(
      new Set(previewSource.querySelectorAll(PREVIEW_KEEP_TOGETHER_SELECTOR))
    ).filter((element): element is HTMLElement => element instanceof HTMLElement);

    if (keepTogetherElements.length === 0 || pageHeightPx <= 0) {
      return [];
    }

    const rootTop = previewSource.getBoundingClientRect().top;
    const blocks = keepTogetherElements
      .map((element): KeepTogetherBlockMeasurement => {
        const blockRect = element.getBoundingClientRect();
        return {
          top: blockRect.top - rootTop,
          height: blockRect.height,
        };
      })
      .filter((block): boolean => block.height >= 8 && block.top >= 0)
      .sort((first, second): number => first.top - second.top);

    if (blocks.length === 0) {
      return [];
    }

    return blocks.reduce<KeepTogetherBlockMeasurement[]>((accumulator, block): KeepTogetherBlockMeasurement[] => {
      const previous = accumulator.at(-1);
      if (previous === undefined) {
        accumulator.push(block);
        return accumulator;
      }

      const sameTop = Math.abs(previous.top - block.top) < 0.5;
      const sameHeight = Math.abs(previous.height - block.height) < 0.5;
      if (sameTop && sameHeight) {
        return accumulator;
      }

      accumulator.push(block);
      return accumulator;
    }, []);
  }

  async #waitForAssets(container: HTMLElement): Promise<void> {
    await document.fonts.ready;
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

  #getPageContentHeightPx(container: HTMLElement): number {
    const probe = document.createElement('div');
    probe.style.position = 'absolute';
    probe.style.top = '0';
    probe.style.left = '0';
    probe.style.width = `${PREVIEW_PAGE_CONTENT_WIDTH_MM}mm`;
    probe.style.height = `${PREVIEW_PAGE_CONTENT_HEIGHT_MM}mm`;
    probe.style.visibility = 'hidden';
    container.appendChild(probe);
    const measured = probe.getBoundingClientRect().height;
    container.removeChild(probe);
    return measured > 0 ? measured : this.#mmToPx(PREVIEW_PAGE_CONTENT_HEIGHT_MM);
  }

  #resolvePersonalDetails(
    details: Partial<PersonalDetailsFormValues> | null | undefined
  ): PersonalDetailsFormValues {
    if (!details) {
      return placeholderPersonalDetails;
    }

    return {
      fullName: details.fullName ?? '',
      email: details.email ?? '',
      phone: details.phone ?? '',
      website: details.website ?? '',
      headline: details.headline ?? '',
    };
  }
}
