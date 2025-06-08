import { Component, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { CvForm } from '../../../types/cv-form';
import { PersonalDetailsForm } from '../../../types/personal-details-form';

@Component({
  selector: 'app-personal-details',
  imports: [IftaLabelModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.scss',
})
export class PersonalDetailsComponent implements OnInit {
  public parentForm = input<CvForm>();

  public personalDetailsForm: PersonalDetailsForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    website: new FormControl(''),
    headline: new FormControl('', [Validators.required]),
  });

  public ngOnInit(): void {
    this.parentForm()?.addControl('personalDetailsForm', this.personalDetailsForm);
  }
}
