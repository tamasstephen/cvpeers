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
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
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
    SectionHeaderComponent,
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent extends ComponentBaseComponent implements OnInit {
  public parentForm = input<CvForm>();

  public reset$ = input.required<Subject<boolean>>();

  protected isDialogOpen = signal(false);

  protected yearRange = `${new Date().getFullYear() - 50}:${new Date().getFullYear()}`;

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

  public saveExperience(result: ExperienceItemFormValues): void {
    const experienceArray = this.experienceForm.get('experience') as FormArray;
    experienceArray.push(this.#createExperienceGroup(result));
  }

  public updateExperience(result: ExperienceItemFormValues, index: number): void {
    const experienceArray = this.experienceForm.get('experience') as FormArray;
    experienceArray.setControl(index, this.#createExperienceGroup(result));
  }

  protected openDialog(): void {
    const dialogRef = this.#dialog.open(ExperienceDialogComponent);
    dialogRef.afterClosed().subscribe((result: ExperienceItemFormValues | null): void => {
      if (result) {
        this.saveExperience(result);
      }
    });
  }

  #openDialog(index: number): void {
    const dialogRef = this.#dialog.open(ExperienceDialogComponent, {
      data: this.experienceControls[index].value,
    });
    dialogRef.afterClosed().subscribe((result: ExperienceItemFormValues | null): void => {
      if (result) {
        this.updateExperience(result, index);
      }
    });
  }

  protected editExperience(index: number): void {
    this.#openDialog(index);
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

  public get experienceControls(): FormGroup<ExperienceItemForm>[] {
    return (this.experienceForm.get('experience') as FormArray)
      .controls as FormGroup<ExperienceItemForm>[];
  }

  protected getDescriptionControls(experience: FormGroup): FormControl<string | null>[] {
    return (experience.get('description') as FormArray).controls as FormControl<string | null>[];
  }

  #createExperienceGroup(result: ExperienceItemFormValues): FormGroup<ExperienceItemForm> {
    return new FormGroup<ExperienceItemForm>({
      title: new FormControl<ExperienceItemFormValues['title']>(result.title || ''),
      company: new FormControl<ExperienceItemFormValues['company']>(result.company || ''),
      location: new FormControl<ExperienceItemFormValues['location']>(result.location || ''),
      startDate: new FormControl<ExperienceItemFormValues['startDate']>(result.startDate || null),
      endDate: new FormControl<ExperienceItemFormValues['endDate']>(result.endDate || null),
      description: new FormArray(
        result.description.map(
          (desc: string | null): FormControl<string | null> =>
            new FormControl<ExperienceItemFormValues['description'][number]>(desc || '')
        )
      ),
    });
  }
}
