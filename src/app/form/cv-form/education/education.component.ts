import { DatePipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { Subject } from 'rxjs';
import { ComponentBaseComponent } from '../../../shared/core/component-base/component-base.component';
import { CvForm } from '../../../types/cv-form';
import {
  EducationForm,
  EducationFormArray,
  EducationItemForm,
} from '../../../types/education-form';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [
    IftaLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    CalendarModule,
    DatePipe,
    DatePickerModule,
  ],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
})
export class EducationComponent extends ComponentBaseComponent implements OnInit {
  public parentForm = input<CvForm>();

  public reset$ = input.required<Subject<boolean>>();

  protected isDialogOpen = false;

  protected educationForm: EducationForm = new FormGroup({
    education: new FormArray<FormGroup<EducationItemForm>>([]),
  });

  protected educationItemForm = new FormGroup<EducationItemForm>({
    degree: new FormControl('', [Validators.required]),
    institution: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    graduationDate: new FormControl('', [Validators.required]),
  });

  protected get educationControls(): FormGroup<EducationItemForm>[] {
    return (this.educationForm.get('education') as FormArray<FormGroup<EducationItemForm>>)
      .controls;
  }

  public ngOnInit(): void {
    this.parentForm()?.addControl(
      'educationForm',
      this.educationForm.get('education') as EducationFormArray
    );

    this.addSubscription(
      this.reset$().subscribe((value: boolean): void => {
        if (value) {
          const educationArray = this.educationForm.get('education') as FormArray;
          while (educationArray.length) {
            educationArray.removeAt(0);
          }
        }
      })
    );
  }

  protected openDialog(): void {
    this.isDialogOpen = true;
    this.educationItemForm.reset();
  }

  protected closeDialog(): void {
    this.isDialogOpen = false;
  }

  protected addEducation(): void {
    if (this.educationItemForm.valid) {
      const educationArray = this.educationForm.get('education') as FormArray;
      const newEducation = new FormGroup({
        degree: new FormControl(this.educationItemForm.get('degree')?.value),
        institution: new FormControl(this.educationItemForm.get('institution')?.value),
        location: new FormControl(this.educationItemForm.get('location')?.value),
        graduationDate: new FormControl(this.educationItemForm.get('graduationDate')?.value),
      });
      educationArray.push(newEducation);
      this.closeDialog();
    }
  }

  protected removeEducation(index: number): void {
    const educationArray = this.educationForm.get('education') as FormArray;
    educationArray.removeAt(index);
  }
}
