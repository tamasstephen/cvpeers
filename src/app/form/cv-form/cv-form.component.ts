import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { CvComponent } from '../../cv/cv.component';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator.service';
import { StructuredDataService } from '../../services/seo/structured-data.service';
import { SidepanelProviderService } from '../../services/sidepanel-provider/sidepanel-provider.service';
import { MobileWarningComponent } from '../../shared/components/mobile-warning/mobile-warning.component';
import { CvForm } from '../../types/cv-form';
import { RichTextComponent } from '../rich-text/rich-text.component';
import { CvFormCommandsFacade } from './cv-form-commands.facade';
import { CvFormPersistenceMapper, StoredFormData } from './cv-form-persistence.mapper';
import { createCvFormSkeleton } from './cv-form-skeleton.factory';
import { CvFormStorageAdapter } from './cv-form-storage.adapter';
import { CvFormStateFacade } from './cv-form-state.facade';
import { EducationComponent } from './education/education.component';
import { ExperienceComponent } from './experience/experience.component';
import { ExpertiseComponent } from './expertise/expertise.component';
import { LanguageComponent } from './language/language.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { SocialComponent } from './social/social.component';
import { StrengthsComponent } from './strengths/strengths.component';
import { TemplateSelectorComponent } from './template-selector/template-selector.component';

const DUMMY_CV_DATA: StoredFormData = {
  personalDetailsForm: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (415) 555-0142',
    website: 'https://alexmorgan.dev',
    headline: 'Senior Product Engineer | Frontend Platform & AI-assisted UX',
  },
  socialForm: {
    social: [
      {
        type: 'github',
        url: 'https://github.com/alexmorgan',
        src: 'assets/images/github-fill.png',
      },
      {
        type: 'linkedin',
        url: 'https://www.linkedin.com/in/alexmorgan',
        src: 'assets/images/linkedin-box-fill.png',
      },
    ],
  },
  experienceForm: [
    {
      title: 'Senior Product Engineer',
      company: 'Northstar Labs',
      location: 'San Francisco, CA',
      startDate: new Date('2023-01-01'),
      endDate: null,
      description: [
        'Led architecture and delivery of a multi-tenant CV platform used by over 120,000 active professionals.',
        'Built server-driven rendering flows that reduced preview mismatch issues by 67% across multiple templates.',
        'Designed and shipped robust form persistence with conflict-safe restore logic and deterministic section hydration.',
        'Partnered with design and growth to launch onboarding experiments that improved completion rate from 54% to 72%.',
      ],
    },
    {
      title: 'Staff Frontend Engineer',
      company: 'Orbit Commerce',
      location: 'Remote, US',
      startDate: new Date('2020-03-01'),
      endDate: new Date('2022-12-01'),
      description: [
        'Created a component platform with strict accessibility and performance budgets used by four product squads.',
        'Migrated legacy forms to typed reactive patterns and reduced production form defects by more than 40%.',
        'Implemented analytics guardrails and release controls that enabled faster iteration without regression spikes.',
        'Mentored engineers on test-first workflows, review rigor, and instrumentation-first debugging techniques.',
      ],
    },
    {
      title: 'Senior Software Engineer',
      company: 'Cobalt Health',
      location: 'Seattle, WA',
      startDate: new Date('2017-06-01'),
      endDate: new Date('2020-02-01'),
      description: [
        'Delivered patient-facing onboarding journeys that handled high-volume traffic during seasonal enrollment peaks.',
        'Refactored client state handling to lower time-to-interactive and simplify cross-team feature ownership.',
        'Introduced API contract testing that prevented breaking changes across dependent mobile and web clients.',
        'Worked with compliance and legal teams to align workflows with evolving regulatory requirements.',
      ],
    },
    {
      title: 'Software Engineer II',
      company: 'Brightline Media',
      location: 'Austin, TX',
      startDate: new Date('2015-02-01'),
      endDate: new Date('2017-05-01'),
      description: [
        'Owned content workflow tooling and built publishing automation for distributed editorial teams.',
        'Improved CMS rendering performance through bundle splitting and lazy loading strategies.',
        'Created preview and revision tooling that reduced editorial QA turnaround by nearly half.',
        'Automated smoke-test coverage in CI to catch critical regressions before release windows.',
      ],
    },
    {
      title: 'Frontend Engineer',
      company: 'Atlas Mobility',
      location: 'Denver, CO',
      startDate: new Date('2013-07-01'),
      endDate: new Date('2015-01-01'),
      description: [
        'Built route planning and trip-summary interfaces for both desktop dispatchers and mobile operators.',
        'Collaborated with backend teams to design resilient retry and offline synchronization experiences.',
        'Introduced observability dashboards that surfaced top rendering bottlenecks and crash vectors.',
        'Drove refactors that replaced duplicate view logic with shared and testable UI primitives.',
      ],
    },
    {
      title: 'Junior Software Engineer',
      company: 'Pixel Forge',
      location: 'Portland, OR',
      startDate: new Date('2011-08-01'),
      endDate: new Date('2013-06-01'),
      description: [
        'Implemented customer-facing account and billing flows with clear validation and transactional safeguards.',
        'Maintained template systems and created reusable modules for marketing and product launch pages.',
        'Reduced CSS and rendering inconsistencies by introducing a shared design token strategy.',
        'Coordinated release checklists with QA to stabilize launch quality across multiple browsers.',
      ],
    },
  ],
  educationForm: [
    {
      degree: 'M.S. Computer Science',
      institution: 'University of Washington',
      location: 'Seattle, WA',
      graduationDate: new Date('2011-06-01'),
    },
    {
      degree: 'B.S. Software Engineering',
      institution: 'Oregon State University',
      location: 'Corvallis, OR',
      graduationDate: new Date('2009-06-01'),
    },
  ],
  expertiseForm: [
    'Angular',
    'TypeScript',
    'Reactive Forms',
    'Frontend Architecture',
    'Design Systems',
    'Accessibility',
    'Performance Optimization',
    'Unit Testing',
    'Contract Testing',
    'CI/CD',
    'Experimentation',
    'Observability',
    'UX Writing',
    'Product Discovery',
  ],
  strengthsForm: [
    'Systems Thinking',
    'Cross-functional Communication',
    'Mentoring',
    'Technical Planning',
    'Root Cause Analysis',
    'Delivery Discipline',
    'User Empathy',
    'Stakeholder Management',
  ],
  languagesForm: [
    { name: 'English', level: 'Native' },
    { name: 'Spanish', level: 'Advanced' },
    { name: 'German', level: 'Intermediate' },
  ],
  summary:
    '<p>Senior product engineer with 12+ years of experience designing and shipping reliable web applications across platform, growth, and workflow-heavy domains. I focus on architecting user-facing systems that remain fast under load, maintainable under pressure, and observable in production so teams can iterate safely.</p><p>My recent work centers on form-heavy interfaces, document-generation pipelines, and preview systems where consistency and trust matter. I combine typed frontend patterns, pragmatic testing strategy, and strong collaboration with design, QA, and product to deliver outcomes that are measurable and durable.</p><p>I enjoy improving engineering leverage: creating reusable abstractions, clarifying ownership boundaries, and mentoring teams toward test-first thinking. I optimize for clarity in architecture, reliability in delivery, and user confidence in every interaction.</p>',
};

@Component({
  selector: 'app-cv-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    PersonalDetailsComponent,
    SocialComponent,
    ExperienceComponent,
    ExpertiseComponent,
    StrengthsComponent,
    RichTextComponent,
    EducationComponent,
    LanguageComponent,
    MobileWarningComponent,
    TemplateSelectorComponent,
  ],
  templateUrl: './cv-form.component.html',
  styleUrl: './cv-form.component.scss',
  providers: [DatePipe],
})
export class CvFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cvForm') protected cvForm!: ElementRef<HTMLDivElement>;

  @ViewChild('portrait') protected portrait?: ElementRef<HTMLImageElement>;

  @ViewChild('resetDialog') protected resetDialogTemplate!: TemplateRef<unknown>;

  protected isMobile = signal<boolean>(false);

  protected reset$ = new Subject<boolean>();

  protected snackBar = inject(MatSnackBar);

  protected dialog = inject(MatDialog);

  protected readonly pdfService: PdfGeneratorService = inject(PdfGeneratorService);

  protected readonly sidepanelProvider: SidepanelProviderService = inject(SidepanelProviderService);

  protected readonly structuredDataService: StructuredDataService = inject(StructuredDataService);

  protected form: CvForm = createCvFormSkeleton();

  protected currentDate = new Date();

  protected richTextInitialValue = new Subject<string | null>();

  protected richTextInitialValue$ = this.richTextInitialValue.asObservable();

  #dialogRef: MatDialogRef<unknown> | null = null;

  readonly #cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  #image: File | null = null;

  readonly #storageAdapter: CvFormStorageAdapter = inject(CvFormStorageAdapter);

  readonly #persistenceMapper: CvFormPersistenceMapper = inject(CvFormPersistenceMapper);

  readonly #commandsFacade: CvFormCommandsFacade = inject(CvFormCommandsFacade);

  readonly #stateFacade: CvFormStateFacade = inject(CvFormStateFacade);

  readonly #MOBILE_BREAKPOINT = 768;

  public ngOnInit(): void {
    // Check initial screen size
    this.#checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', this.#onResize.bind(this));

    // Load form data from localStorage if exists
    this.#loadFormData();

    // Subscribe to form changes to save to localStorage
    this.form.valueChanges.subscribe((value): void => {
      if (this.#stateFacade.hasMeaningfulValues(value)) {
        this.#storageAdapter.save(this.#persistenceMapper.serialize(value));
      } else {
        this.#storageAdapter.clear();
      }
    });

    // Add structured data
    this.structuredDataService.setCvFormStructuredData();

    // Initialize sidepanel if not in mobile mode
    if (!this.isMobile()) {
      this.sidepanelProvider.openSidepanel({
        component: CvComponent,
        data: {
          cvForm: this.form,
        },
      });
    }
  }

  public ngAfterViewInit(): void {
    if (!this.portrait) {
      return;
    }

    // Crop the image to keep the aspect ratio on the pdf
    this.portrait.nativeElement.onload = (): void => {
      this.cropImage();
    };
  }

  public ngOnDestroy(): void {
    // Remove resize listener
    window.removeEventListener('resize', this.#onResize.bind(this));

    this.structuredDataService.removeStructuredData();
  }

  public onSubmit(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    if (this.form.valid) {
      // eslint-disable-next-line no-console
      console.log(this.form.value);
    }
  }

  public useDummyDataForTests(): void {
    this.useDummyData();
  }

  protected async downloadPdf(): Promise<void> {
    await this.#commandsFacade.downloadPdfFromPreview();
  }

  protected resetForm(): void {
    this.#commandsFacade.resetForm({
      form: this.form,
      reset$: this.reset$,
      closeResetDialog: (): void => this.closeResetFormDialog(),
      detectChanges: (): void => this.#cdRef.detectChanges(),
      showToast: (): void => this.showToast(),
    });
  }

  protected useDummyData(): void {
    this.#commandsFacade.applyDummyData({
      form: this.form,
      dummyData: DUMMY_CV_DATA,
      reset$: this.reset$,
      richTextInitialValue: this.richTextInitialValue,
      detectChanges: (): void => this.#cdRef.detectChanges(),
    });
  }

  #loadFormData(): void {
    const savedData = this.#storageAdapter.load();
    if (savedData) {
      try {
        const formData = this.#persistenceMapper.deserialize(savedData);
        // Wait for next tick to ensure all form controls are initialized
        setTimeout((): void => {
          this.#stateFacade.applyStoredData({
            form: this.form,
            formData,
            richTextInitialValue: this.richTextInitialValue,
            detectChanges: (): void => this.#cdRef.detectChanges(),
          });
        });
      } catch (error) {
        console.error('Error loading form data:', error);
        this.#storageAdapter.clear();
      }
    }
  }

  protected showToast(): void {
    this.snackBar.open('Form reset successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  protected showErrorToast(): void {
    this.snackBar.open('Form reset failed', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-error'],
    });
  }

  // Workaround for keeping the image aspect ratio on the pdf
  protected cropImage(): void {
    if (!this.portrait) {
      return;
    }

    const currentImage = this.portrait.nativeElement;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to 300x300
    canvas.width = 300;
    canvas.height = 300;

    // Calculate the center crop dimensions
    const size = Math.min(currentImage.naturalWidth, currentImage.naturalHeight);
    const startX = (currentImage.naturalWidth - size) / 2;
    const startY = (currentImage.naturalHeight - size) / 2;

    // Draw the cropped image
    ctx.drawImage(currentImage, startX, startY, size, size, 0, 0, 300, 300);

    // Convert canvas to blob
    canvas.toBlob((blob): void => {
      if (blob) {
        // Create a new File object
        const croppedFile = new File([blob], 'cropped-portrait.jpg', {
          type: 'image/jpeg',
        });

        // Update the image source
        const reader = new FileReader();
        reader.onload = (e): void => {
          if (e.target?.result) {
            currentImage.src = e.target.result as string;
          }
        };
        reader.readAsDataURL(croppedFile);

        // Store the cropped file
        this.#image = croppedFile;
      }
    }, 'image/jpeg');
  }

  protected openResetFormDialog(): void {
    this.#dialogRef = this.#commandsFacade.openResetDialog(this.dialog, this.resetDialogTemplate);
  }

  protected closeResetFormDialog(): void {
    this.#dialogRef = this.#commandsFacade.closeResetDialog(this.#dialogRef);
  }

  #onResize(): void {
    this.#checkScreenSize();
  }

  #checkScreenSize(): void {
    const wasMobile = this.isMobile();
    this.isMobile.set(window.innerWidth < this.#MOBILE_BREAKPOINT);

    if (wasMobile && !this.isMobile()) {
      // When switching from mobile to desktop, reinitialize completely
      this.sidepanelProvider.clearSidepanel();
      // Force a new form instance
      const formValue = this.form.value;
      this.form = createCvFormSkeleton();
      this.#loadFormData();
      // Wait for next tick to ensure form is initialized
      setTimeout((): void => {
        this.form.patchValue(formValue);
        this.sidepanelProvider.openSidepanel({
          component: CvComponent,
          data: {
            cvForm: this.form,
          },
        });
      });
    } else if (this.isMobile()) {
      this.sidepanelProvider.clearSidepanel();
      this.sidepanelProvider.hideSidepanel();
    } else {
      this.sidepanelProvider.displaySidepanel();
    }
  }
}
