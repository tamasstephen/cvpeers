import { Component, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { ComponentBaseComponent } from '../../../shared/core/component-base/component-base.component';
import { CvForm } from '../../../types/cv-form';
import { PersonalDetailsForm } from '../../../types/personal-details-form';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.scss',
})
export class PersonalDetailsComponent extends ComponentBaseComponent implements OnInit {
  public parentForm = input<CvForm>();

  public reset$ = input.required<Subject<boolean>>();

  public personalDetailsForm: PersonalDetailsForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    website: new FormControl(''),
    headline: new FormControl('', [Validators.required]),
  });

  public ngOnInit(): void {
    this.parentForm()?.addControl('personalDetailsForm', this.personalDetailsForm);

    this.addSubscription(
      this.reset$().subscribe((value: boolean): void => {
        if (value) {
          this.personalDetailsForm.reset();
        }
      })
    );
  }
}
