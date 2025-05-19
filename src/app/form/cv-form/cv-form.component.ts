import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { SocialComponent } from './social/social.component';
import { TextareaModule } from 'primeng/textarea';
import { RichTextComponent } from '../rich-text/rich-text.component';
import { hasChangedFromInitial } from '../validators/initial-value.validator';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cv-form',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    IftaLabelModule,
    PersonalDetailsComponent,
    SocialComponent,
    TextareaModule,
    RichTextComponent,
    AsyncPipe,
    DatePipe,
  ],
  templateUrl: './cv-form.component.html',
  styleUrl: './cv-form.component.scss',
  providers: [DatePipe],
})
export class CvFormComponent implements AfterViewInit {
  image: File | null = null;

  form = new FormGroup({});

  // TODO: use if backend is implemented
  initialValues = new BehaviorSubject<any>(null);

  @ViewChild('cvForm') cvForm!: ElementRef<HTMLDivElement>;

  @ViewChild('portrait') portrait!: ElementRef<HTMLImageElement>;

  currentDate = new Date();

  constructor(private readonly _pdfService: PdfGeneratorService) {}

  ngAfterViewInit() {
    if (this.portrait?.nativeElement) {
      // Crop the image to keep the aspect ratio on the pdf
      this.portrait.nativeElement.onload = () => {
        this.cropImage();
      };
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }

  downloadPdf() {
    const element = document.querySelector('.print-only')! as HTMLElement;
    this._pdfService.createPdfFromHtml(element);
  }

  // Workaround for keeping the image aspect ratio on the pdf
  protected cropImage() {
    const currentImage = this.portrait.nativeElement;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to 300x300
    canvas.width = 300;
    canvas.height = 300;

    // Calculate the center crop dimensions
    const size = Math.min(
      currentImage.naturalWidth,
      currentImage.naturalHeight
    );
    const startX = (currentImage.naturalWidth - size) / 2;
    const startY = (currentImage.naturalHeight - size) / 2;

    // Draw the cropped image
    ctx.drawImage(currentImage, startX, startY, size, size, 0, 0, 300, 300);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        // Create a new File object
        const croppedFile = new File([blob], 'cropped-portrait.jpg', {
          type: 'image/jpeg',
        });

        // Update the image source
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            currentImage.src = e.target.result as string;
          }
        };
        reader.readAsDataURL(croppedFile);

        // Store the cropped file
        this.image = croppedFile;
      }
    }, 'image/jpeg');
  }
}
