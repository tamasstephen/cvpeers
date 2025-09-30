import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ComponentBaseComponent } from '../../../../shared/core/component-base/component-base.component';
import { ExperienceItemForm } from '../../../../types/experience-form';

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
export class ExperienceDialogComponent extends ComponentBaseComponent {
  protected experienceItemForm = new FormGroup<ExperienceItemForm>({
    title: new FormControl('', [Validators.required]),
    company: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    startDate: new FormControl<Date | null>(null, [Validators.required]),
    endDate: new FormControl<Date | null>(null),
    description: new FormArray([new FormControl('', [Validators.required])]),
  });

  #dialogRef = inject(MatDialogRef<ExperienceDialogComponent>);

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
}
