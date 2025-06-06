import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ComponentBaseComponent } from '../shared/core/component-base/component-base.component';
import '../assets/fonts/GeistMono-SemiBold-bold.js';
import '../assets/fonts/Geist-Variable_pdf-normal.js';
import { PdfGeneratorService } from '../services/pdf-generator/pdf-generator.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SocialItem } from '../types/social';
import {
  Education,
  Experience,
  Language,
  PersonalDetails,
} from '../shared/interface/cv.interface';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss',
})
export class CvComponent extends ComponentBaseComponent implements OnInit {
  /**
   * The personal details of the CV
   */
  personalDetails: PersonalDetails = {
    fullName: 'Your Name',
    headline: 'Your Title - Years of Experience',
    email: 'your.email@example.com',
    website: 'www.yourwebsite.com',
    linkedin: 'linkedin.com/in/yourprofile',
  };

  /**
   * The social links of the CV
   */
  socialLinks: SocialItem[] = [];

  /**
   * The summary of the CV
   */
  summary: string = '';
  parsedSummary = signal<SafeHtml>('');

  /**
   * The experience of the CV
   */
  experience: Experience[] = [];

  /**
   * The education of the CV
   */
  education: Education[] = [];

  /**
   * The expertise of the CV
   */
  expertise: string[] = [];

  /**
   * The strengths of the CV
   */
  strengths: string[] = [];

  /**
   * The languages of the CV
   */
  languages: Language[] = [];

  /**
   * The PDF generator service
   */
  pdfGeneratorService = inject(PdfGeneratorService);

  /**
   * The sanitizer service
   */
  sanitizer = inject(DomSanitizer);

  /**
   * The form group of the CV
   */
  @Input() cvForm!: FormGroup;

  constructor() {
    super();
  }

  ngOnInit() {
    // Subscribe to form data changes
    this.addSubscription(
      this.cvForm.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((value) => {
          console.log('formvalue changed', value);
          this.personalDetails = value?.personalDetailsForm;
          this.socialLinks = value?.socialForm?.social;
          if (value?.summary !== this.summary) {
            this.summary = value?.summary;
            this.parsedSummary.set(
              this.sanitizer.bypassSecurityTrustHtml(
                this.pdfGeneratorService.addGeistFontToHtml(this.summary)
              )
            );
          }
          this.experience = value?.experienceForm;
          this.education = value?.educationForm;
          this.expertise = value?.expertiseForm;
          this.strengths = value?.strengthsForm;
          this.languages = value?.languagesForm;
        })
    );
  }
}
