import { Component, input, OnInit } from '@angular/core';
import { IftaLabelModule } from 'primeng/iftalabel';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DatePipe } from '@angular/common';

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
  parentForm = input<FormGroup>();
  isDialogOpen = false;

  educationForm = new FormGroup({
    education: new FormArray<FormGroup>([]),
  });

  educationItemForm = new FormGroup({
    degree: new FormControl('', [Validators.required]),
    institution: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    graduationDate: new FormControl('', [Validators.required]),
  });

  get educationControls() {
    return (this.educationForm.get('education') as FormArray).controls;
  }

  ngOnInit(): void {
    this.parentForm()?.addControl(
      'educationForm',
      this.educationForm.get('education')
    );
  }

  openDialog() {
    this.isDialogOpen = true;
    this.educationItemForm.reset();
  }

  closeDialog() {
    this.isDialogOpen = false;
  }

  addEducation() {
    if (this.educationItemForm.valid) {
      const educationArray = this.educationForm.get('education') as FormArray;
      const newEducation = new FormGroup({
        degree: new FormControl(this.educationItemForm.get('degree')?.value),
        institution: new FormControl(
          this.educationItemForm.get('institution')?.value
        ),
        location: new FormControl(
          this.educationItemForm.get('location')?.value
        ),
        graduationDate: new FormControl(
          this.educationItemForm.get('graduationDate')?.value
        ),
      });
      educationArray.push(newEducation);
      this.closeDialog();
    }
  }

  removeEducation(index: number) {
    const educationArray = this.educationForm.get('education') as FormArray;
    educationArray.removeAt(index);
  }
}
