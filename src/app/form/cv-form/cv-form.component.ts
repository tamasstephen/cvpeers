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
  ViewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { CvComponent } from '../../cv/cv.component';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator.service';
import { StructuredDataService } from '../../services/seo/structured-data.service';
import { SidepanelProviderService } from '../../services/sidepanel-provider/sidepanel-provider.service';
import { CvForm } from '../../types/cv-form';
import { RichTextComponent } from '../rich-text/rich-text.component';
import { EducationComponent } from './education/education.component';
import { ExperienceComponent } from './experience/experience.component';
import { ExpertiseComponent } from './expertise/expertise.component';
import { LanguageComponent } from './language/language.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { SocialComponent } from './social/social.component';
import { StrengthsComponent } from './strengths/strengths.component';

@Component({
  selector: 'app-cv-form',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    IftaLabelModule,
    PersonalDetailsComponent,
    SocialComponent,
    MessageModule,
    ExperienceComponent,
    ExpertiseComponent,
    StrengthsComponent,
    TextareaModule,
    RichTextComponent,
    EducationComponent,
    LanguageComponent,
    ToastModule,
  ],
  templateUrl: './cv-form.component.html',
  styleUrl: './cv-form.component.scss',
  providers: [DatePipe, MessageService],
})
export class CvFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cvForm') protected cvForm!: ElementRef<HTMLDivElement>;

  @ViewChild('portrait') protected portrait!: ElementRef<HTMLImageElement>;

  protected messageService = inject(MessageService);

  protected readonly pdfService: PdfGeneratorService = inject(PdfGeneratorService);

  protected readonly sidepanelProvider: SidepanelProviderService = inject(SidepanelProviderService);

  protected readonly structuredDataService: StructuredDataService = inject(StructuredDataService);

  protected form: CvForm = new FormGroup({});

  protected currentDate = new Date();

  protected isDialogOpen = signal<boolean>(false);

  readonly #cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  #image: File | null = null;

  public ngOnInit(): void {
    // Initialize sidepanel
    this.sidepanelProvider.setSidepanelConfig({
      component: CvComponent,
      data: {
        cvForm: this.form,
      },
    });

    // Add structured data
    this.structuredDataService.setCvFormStructuredData();
  }

  public ngOnDestroy(): void {
    this.structuredDataService.removeStructuredData();
  }

  public ngAfterViewInit(): void {
    // Crop the image to keep the aspect ratio on the pdf
    this.portrait.nativeElement.onload = (): void => {
      this.cropImage();
    };
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
    this.closeResetFormDialog();
    this.#cdRef.detectChanges();
    this.showToast();
  }

  protected showToast(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Form reset successfully',
      life: 3000,
    });
  }

  protected showErrorToast(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Form reset failed',
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
    this.isDialogOpen.set(true);
  }

  protected closeResetFormDialog(): void {
    this.isDialogOpen.set(false);
  }
}
