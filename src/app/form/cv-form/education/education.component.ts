import { DatePipe } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject, Subscription } from 'rxjs';
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
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    DatePipe,
  ],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
})
export class EducationComponent extends ComponentBaseComponent implements OnInit, OnDestroy {
  @ViewChild('educationDialog') protected educationDialogTemplate!: TemplateRef<unknown>;

  public parentForm = input<CvForm>();

  public reset$ = input.required<Subject<boolean>>();

  protected dialog = inject(MatDialog);

  protected educationForm: EducationForm = new FormGroup({
    education: new FormArray<FormGroup<EducationItemForm>>([]),
  });

  protected educationItemForm = new FormGroup<EducationItemForm>({
    degree: new FormControl('', [Validators.required]),
    institution: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
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
    this.educationItemForm.reset();
    this.#dialogRef = this.dialog.open(this.educationDialogTemplate, {
      width: '440px',
      disableClose: true,
    });

    this.#afterCloseSubscription?.unsubscribe();
    this.#afterCloseSubscription = this.#dialogRef.afterClosed().subscribe((): void => {
      this.educationItemForm.reset();
    });
  }

  protected closeDialog(): void {
    this.#dialogRef?.close();
    this.#dialogRef = null;
    this.#afterCloseSubscription?.unsubscribe();
    this.#afterCloseSubscription = null;
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
