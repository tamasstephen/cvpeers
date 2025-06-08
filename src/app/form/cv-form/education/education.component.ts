import { DatePipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';

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
  ],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
})
export class EducationComponent implements OnInit {
  public parentForm = input<FormGroup>();
  protected isDialogOpen = false;

  protected educationForm = new FormGroup({
    education: new FormArray<FormGroup>([]),
  });

  protected educationItemForm = new FormGroup({
    degree: new FormControl('', [Validators.required]),
    institution: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    graduationDate: new FormControl('', [Validators.required]),
  });

  protected get educationControls(): AbstractControl[] {
    return (this.educationForm.get('education') as FormArray).controls;
  }

  public ngOnInit(): void {
    this.parentForm()?.addControl('educationForm', this.educationForm.get('education'));
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
