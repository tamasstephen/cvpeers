import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ComponentBaseComponent } from '../../../../shared/core/component-base/component-base.component';
import { EducationItemForm, EducationItemFormValues } from '../../../../types/education-form';

@Component({
  selector: 'app-education-dialog',
  templateUrl: './education-dialog.component.html',
  styleUrl: './education-dialog.component.scss',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class EducationDialogComponent extends ComponentBaseComponent implements OnInit {
  protected educationItemForm = new FormGroup<EducationItemForm>({
    degree: new FormControl('', [Validators.required]),
    institution: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    graduationDate: new FormControl<Date | null>(null),
  });

  readonly #dialogRef = inject(MatDialogRef<EducationDialogComponent>);

  readonly #data = inject<EducationItemFormValues>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    if (this.#data.degree) {
      this.educationItemForm.patchValue(this.#data);
    }
  }

  protected saveEducation(): void {
    this.#dialogRef.close(this.educationItemForm.getRawValue());
  }

  protected closeDialog(): void {
    this.#dialogRef.close();
  }
}
