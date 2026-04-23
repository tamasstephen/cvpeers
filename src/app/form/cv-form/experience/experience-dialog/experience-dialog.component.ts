import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ComponentBaseComponent } from '../../../../shared/core/component-base/component-base.component';
import { ExperienceItemForm, ExperienceItemFormValues } from '../../../../types/experience-form';

@Component({
  selector: 'app-experience-dialog',
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
  templateUrl: './experience-dialog.component.html',
  styleUrl: './experience-dialog.component.scss',
})
export class ExperienceDialogComponent extends ComponentBaseComponent implements OnInit {
  public experienceItemForm = new FormGroup<ExperienceItemForm>({
    title: new FormControl('', [Validators.required]),
    company: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    startDate: new FormControl<Date | null>(null, [Validators.required]),
    endDate: new FormControl<Date | null>(null),
    description: new FormArray([new FormControl('', [Validators.required])]),
  });

  readonly #data = inject<ExperienceItemFormValues | null>(MAT_DIALOG_DATA, { optional: true });

  #dialogRef = inject(MatDialogRef<ExperienceDialogComponent>);

  public ngOnInit(): void {
    if (this.#data) {
      const descriptionArray = this.#createDescriptionArray(this.#data.description);
      this.experienceItemForm.setControl('description', descriptionArray);
      this.experienceItemForm.patchValue({
        title: this.#data.title,
        company: this.#data.company,
        location: this.#data.location,
        startDate: this.#data.startDate,
        endDate: this.#data.endDate,
      });
    }
  }

  protected addDescriptionField(): void {
    const descriptionArray = this.experienceItemForm.get('description') as FormArray;
    descriptionArray.push(new FormControl('', [Validators.required]));
  }

  protected removeDescriptionField(index: number): void {
    const descriptionArray = this.experienceItemForm.get('description') as FormArray;
    if (descriptionArray.length > 1) {
      descriptionArray.removeAt(index);
    }
  }

  protected saveExperience(): void {
    this.#dialogRef.close(this.experienceItemForm.getRawValue());
  }

  protected closeDialog(): void {
    this.#dialogRef.close();
  }

  #createDescriptionArray(descriptions: (string | null)[]): FormArray<FormControl<string | null>> {
    const normalized = descriptions.length > 0 ? descriptions : [''];
    return new FormArray(
      normalized.map(
        (description): FormControl<string | null> =>
          new FormControl(description || '', [Validators.required])
      )
    );
  }
}
