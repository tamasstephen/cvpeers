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
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { EducationItemFormValues } from '../../types/education-form';
import { ExperienceItemFormValues } from '../../types/experience-form';
import { LanguageItemFormValues } from '../../types/language-form';
import { PersonalDetailsFormValues } from '../../types/personal-details-form';
import { SocialFormValues } from '../../types/social';
import { RichTextComponent } from '../rich-text/rich-text.component';
import { EducationComponent } from './education/education.component';
import { ExperienceComponent } from './experience/experience.component';
import { ExpertiseComponent } from './expertise/expertise.component';
import { LanguageComponent } from './language/language.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { SocialComponent } from './social/social.component';
import { StrengthsComponent } from './strengths/strengths.component';

interface StoredFormData {
  personalDetailsForm: PersonalDetailsFormValues;
  socialForm: { social: SocialFormValues };
  experienceForm: ExperienceItemFormValues[];
  educationForm: EducationItemFormValues[];
  expertiseForm: string[];
  strengthsForm: string[];
  languagesForm: LanguageItemFormValues[];
  summary: string;
}

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
  ],
  templateUrl: './cv-form.component.html',
  styleUrl: './cv-form.component.scss',
  providers: [DatePipe],
})
export class CvFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cvForm') protected cvForm!: ElementRef<HTMLDivElement>;

  @ViewChild('portrait') protected portrait!: ElementRef<HTMLImageElement>;

  @ViewChild('resetDialog') protected resetDialogTemplate!: TemplateRef<unknown>;

  protected isMobile = signal<boolean>(false);

  protected reset$ = new Subject<boolean>();

  protected snackBar = inject(MatSnackBar);

  protected dialog = inject(MatDialog);

  protected readonly pdfService: PdfGeneratorService = inject(PdfGeneratorService);

  protected readonly sidepanelProvider: SidepanelProviderService = inject(SidepanelProviderService);

  protected readonly structuredDataService: StructuredDataService = inject(StructuredDataService);

  protected form: CvForm = new FormGroup({});

  protected currentDate = new Date();

  protected richTextInitialValue = new Subject<string | null>();

  protected richTextInitialValue$ = this.richTextInitialValue.asObservable();

  #dialogRef: MatDialogRef<unknown> | null = null;

  readonly #cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  #image: File | null = null;

  readonly #STORAGE_KEY = 'cv_form_data';

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
      if (this.#formDataHasValues(value as unknown as StoredFormData)) {
        localStorage.setItem(this.#STORAGE_KEY, JSON.stringify(value));
      } else {
        localStorage.removeItem(this.#STORAGE_KEY);
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

  #formDataHasValues(value: StoredFormData | Partial<StoredFormData>): boolean {
    return Object.values(value).some((value): boolean => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (value && typeof value === 'object') {
        return this.#formDataHasValues(value as StoredFormData);
      }
      return Boolean(value);
    });
  }

  public ngAfterViewInit(): void {
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

  public onSubmit(): void {
    if (this.form.valid) {
      // eslint-disable-next-line no-console
      console.log(this.form.value);
    }
  }

  protected async downloadPdf(): Promise<void> {
    const element = document.querySelector('#cv');
    if (!element) return;
    await this.pdfService.createPdfFromHtml(element);
  }

  protected resetForm(): void {
    this.form.reset();
    localStorage.removeItem(this.#STORAGE_KEY);
    this.closeResetFormDialog();
    this.reset$.next(true);
    this.#cdRef.detectChanges();
    this.showToast();
  }

  #loadFormData(): void {
    const savedData = localStorage.getItem(this.#STORAGE_KEY);
    if (savedData) {
      try {
        const formData = JSON.parse(savedData) as StoredFormData;
        // Wait for next tick to ensure all form controls are initialized
        setTimeout((): void => {
          // Handle regular form controls
          const personalDetails = this.form.get('personalDetailsForm');
          if (personalDetails) {
            personalDetails.patchValue(formData.personalDetailsForm);
          }

          // Handle form arrays
          const socialControl = this.form.get('socialForm.social');
          if (socialControl instanceof FormArray) {
            formData.socialForm.social.forEach((item): void => {
              socialControl.push(new FormControl(item, { nonNullable: true }));
            });
          }

          const experienceControl = this.form.get('experienceForm');
          if (experienceControl instanceof FormArray) {
            formData.experienceForm.forEach((exp): void => {
              const descriptionArray = new FormArray(
                exp.description
                  .filter((desc): desc is string => desc !== null)
                  .map((desc): FormControl<string> => new FormControl(desc, { nonNullable: true }))
              );
              const expGroup = new FormGroup({
                title: new FormControl(exp.title, { nonNullable: true }),
                company: new FormControl(exp.company, { nonNullable: true }),
                location: new FormControl(exp.location, { nonNullable: true }),
                startDate: new FormControl(exp.startDate, { nonNullable: true }),
                endDate: new FormControl(exp.endDate),
                description: descriptionArray,
              });
              experienceControl.push(expGroup);
            });
          }

          const educationControl = this.form.get('educationForm');
          if (educationControl instanceof FormArray) {
            formData.educationForm.forEach((edu): void => {
              const eduGroup = new FormGroup({
                degree: new FormControl(edu.degree, { nonNullable: true }),
                institution: new FormControl(edu.institution, { nonNullable: true }),
                location: new FormControl(edu.location, { nonNullable: true }),
                startDate: new FormControl(edu.startDate, { nonNullable: true }),
                endDate: new FormControl(edu.endDate, { nonNullable: true }),
              });
              educationControl.push(eduGroup);
            });
          }

          const expertiseControl = this.form.get('expertiseForm');
          if (expertiseControl instanceof FormArray) {
            formData.expertiseForm.forEach((item): void => {
              expertiseControl.push(new FormControl(item, { nonNullable: true }));
            });
          }

          const strengthsControl = this.form.get('strengthsForm');
          if (strengthsControl instanceof FormArray) {
            formData.strengthsForm.forEach((item): void => {
              strengthsControl.push(new FormControl(item, { nonNullable: true }));
            });
          }

          const languagesControl = this.form.get('languagesForm');
          if (languagesControl instanceof FormArray) {
            formData.languagesForm.forEach((lang): void => {
              const langGroup = new FormGroup({
                name: new FormControl(lang.name, { nonNullable: true }),
                level: new FormControl(lang.level, { nonNullable: true }),
              });
              languagesControl.push(langGroup);
            });
          }

          // Handle summary separately since it's a rich text field
          if (formData.summary) {
            const summaryControl = this.form.get('summary');
            if (summaryControl) {
              summaryControl.setValue(formData.summary);
              this.richTextInitialValue.next(formData.summary);
            }
          }

          this.#cdRef.detectChanges();
        });
      } catch (error) {
        console.error('Error loading form data:', error);
        localStorage.removeItem(this.#STORAGE_KEY);
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
    this.#dialogRef = this.dialog.open(this.resetDialogTemplate, {
      width: '400px',
      disableClose: true,
    });
  }

  protected closeResetFormDialog(): void {
    this.#dialogRef?.close();
    this.#dialogRef = null;
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
      this.form = new FormGroup({});
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
