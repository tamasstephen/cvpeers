import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ComponentBaseComponent } from '../shared/core/component-base/component-base.component';
import '../assets/fonts/GeistMono-SemiBold-bold.js';
import '../assets/fonts/Geist-Variable_pdf-normal.js';

interface PersonalDetails {
  fullName: string;
  email?: string;
  phone?: string;
  website?: string;
  headline: string;
  linkedin?: string;
}

interface SocialLink {
  type: string;
  url: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string[];
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
}

interface Skill {
  name: string;
  level: number; // 0-100
}

interface Language {
  name: string;
  level: string;
}

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss',
})
export class CvComponent extends ComponentBaseComponent implements OnInit {
  personalDetails: PersonalDetails = {
    fullName: 'Your Name',
    headline: 'Your Title - Years of Experience',
    email: 'your.email@example.com',
    website: 'www.yourwebsite.com',
    linkedin: 'linkedin.com/in/yourprofile',
  };
  socialLinks: SocialLink[] = [];
  summary: string = '';
  experience: Experience[] = [];
  education: Education[] = [];
  skills: Skill[] = [];
  languages: Language[] = [];
  designSkills: string[] = [];
  softSkills: string[] = [];

  @Input() cvForm!: FormGroup;

  constructor() {
    super();
  }

  ngOnInit() {
    // TODO: Subscribe to form data changes
    this.addSubscription(
      this.cvForm.valueChanges.subscribe((value) => {
        console.log(value);
        this.personalDetails = value?.personalDetailsForm;
        this.socialLinks = value?.socialForm.social;
        this.summary = value?.summary;
        this.experience = value?.experienceForm;
        this.education = value?.educationForm;
        this.skills = value?.skillsForm;
        this.languages = value?.languagesForm;
        console.log(this.personalDetails);
      })
    );
    // This will be implemented when we connect it to the form
  }
}
