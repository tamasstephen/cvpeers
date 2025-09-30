import { CvForm } from '@/types/cv-form';
import {
  ExperienceForm,
  ExperienceFormArray,
  ExperienceItemForm,
  ExperienceItemFormValues,
} from '@/types/experience-form';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { ComponentBaseComponent } from '../../../shared/core/component-base/component-base.component';
import { ExperienceDialogComponent } from './experience-dialog/experience-dialog.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatIconModule,
    MatFormFieldModule,
    DatePipe,
    CommonModule,
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent extends ComponentBaseComponent implements OnInit {
  public parentForm = input<CvForm>();

  public reset$ = input.required<Subject<boolean>>();

  protected isDialogOpen = signal(false);

  protected yearRange = `${new Date().getFullYear() - 50}:${new Date().getFullYear()}`;

  protected editIndex = signal<number | null>(null);

  protected experienceForm: ExperienceForm = new FormGroup({
    experience: new FormArray<FormGroup<ExperienceItemForm>>([]),
  });

  protected experienceItemForm = new FormGroup<ExperienceItemForm>({
    title: new FormControl('', [Validators.required]),
    company: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    startDate: new FormControl<Date | null>(null, [Validators.required]),
    endDate: new FormControl<Date | null>(null),
    description: new FormArray([new FormControl('', [Validators.required])]),
  });

  #dialog = inject(MatDialog);

  public ngOnInit(): void {
    this.parentForm()?.addControl(
      'experienceForm',
      this.experienceForm.get('experience') as ExperienceFormArray
    );

    this.addSubscription(
      this.reset$().subscribe((value: boolean): void => {
        if (value) {
          const experienceArray = this.experienceForm.get('experience') as FormArray;
          while (experienceArray.length) {
            experienceArray.removeAt(0);
          }
        }
      })
    );
  }

  protected openDialog(): void {
    const dialogRef = this.#dialog.open(ExperienceDialogComponent);
    dialogRef.afterClosed().subscribe((result: ExperienceItemFormValues | null): void => {
      if (result) {
        this.saveExperience(result);
      }
    });
  }

  protected saveExperience(result: ExperienceItemFormValues): void {
    if (this.editIndex() !== null) {
      this.updateExperience(result);
      return;
    }

    const experienceArray = this.experienceForm.get('experience') as FormArray;
    const itemGroup = new FormGroup({
      title: new FormControl(result.title || '', { nonNullable: true }),
      company: new FormControl(result.company || '', { nonNullable: true }),
      location: new FormControl(result.location || '', { nonNullable: true }),
      startDate: new FormControl<Date | null>(result.startDate || null, {
        nonNullable: true,
      }),
      endDate: new FormControl<Date | null>(result.endDate || null, {
        nonNullable: true,
      }),
      description: new FormArray(
        result.description.map(
          (desc: string | null): FormControl<string | null> =>
            new FormControl(desc || '', { nonNullable: true })
        )
      ),
    });
    experienceArray.push(itemGroup);
  }

  protected editExperience(index: number): void {
    this.isDialogOpen.set(true);
    this.editIndex.set(index);
    const experienceArray = this.experienceForm.get('experience') as FormArray<
      FormGroup<ExperienceItemForm>
    >;
    const experience = experienceArray.at(index);
    this.experienceItemForm.patchValue(experience.value);
  }

  protected updateExperience(result: ExperienceItemFormValues): void {
    const experienceArray = this.experienceForm.get('experience') as FormArray;
    experienceArray.at(this.editIndex() as number).patchValue(result);
  }

  protected removeExperience(index: number): void {
    const experienceArray = this.experienceForm.get('experience') as FormArray;
    experienceArray.removeAt(index);
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

  protected get descriptionControls(): FormControl<string | null>[] {
    return (this.experienceItemForm.get('description') as FormArray).controls as FormControl<
      string | null
    >[];
  }

  protected get experienceControls(): FormGroup<ExperienceItemForm>[] {
    return (this.experienceForm.get('experience') as FormArray)
      .controls as FormGroup<ExperienceItemForm>[];
  }

  protected getDescriptionControls(experience: FormGroup): FormControl<string | null>[] {
    return (experience.get('description') as FormArray).controls as FormControl<string | null>[];
  }
}
