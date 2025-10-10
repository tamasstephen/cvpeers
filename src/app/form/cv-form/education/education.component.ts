import { DatePipe } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject, Subscription } from 'rxjs';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { ComponentBaseComponent } from '../../../shared/core/component-base/component-base.component';
import { CvForm } from '../../../types/cv-form';
import {
  EducationForm,
  EducationFormArray,
  EducationItemForm,
  EducationItemFormValues,
} from '../../../types/education-form';
import { EducationDialogComponent } from './education-dialog/education-dialog.component';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    DatePipe,
    SectionHeaderComponent,
  ],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
})
export class EducationComponent extends ComponentBaseComponent implements OnInit, OnDestroy {
  public parentForm = input<CvForm>();

  public reset$ = input.required<Subject<boolean>>();

  protected dialog = inject(MatDialog);

  protected educationForm: EducationForm = new FormGroup({
    education: new FormArray<FormGroup<EducationItemForm>>([]),
  });

  protected get educationControls(): FormGroup<EducationItemForm>[] {
    return (this.educationForm.get('education') as FormArray<FormGroup<EducationItemForm>>)
      .controls;
  }

  #dialogRef: MatDialogRef<unknown> | null = null;

  #afterCloseSubscription: Subscription | null = null;

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

  public override ngOnDestroy(): void {
    this.#afterCloseSubscription?.unsubscribe();
    this.#afterCloseSubscription = null;
  }

  protected openDialog(): void {
    const dialogRef = this.dialog.open(EducationDialogComponent);

    dialogRef.afterClosed().subscribe((result: EducationItemFormValues | null): void => {
      if (result) {
        this.addEducation(result);
      }
    });
  }

  protected closeDialog(): void {
    this.#dialogRef?.close();
    this.#dialogRef = null;
    this.#afterCloseSubscription?.unsubscribe();
    this.#afterCloseSubscription = null;
  }

  protected addEducation(result: EducationItemFormValues): void {
    const educationArray = this.educationForm.get('education') as FormArray;
    const newEducation = new FormGroup({
      degree: new FormControl(result.degree),
      institution: new FormControl(result.institution),
      location: new FormControl(result.location),
      graduationDate: new FormControl(result.graduationDate),
    });
    educationArray.push(newEducation);
    this.closeDialog();
  }

  protected removeEducation(index: number): void {
    const educationArray = this.educationForm.get('education') as FormArray;
    educationArray.removeAt(index);
  }
}
