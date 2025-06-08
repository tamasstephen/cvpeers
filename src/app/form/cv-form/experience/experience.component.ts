import { DatePipe } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { CvForm } from '../../../types/cv-form';
import {
  ExperienceForm,
  ExperienceFormArray,
  ExperienceItemForm,
} from '../../../types/experience-form';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    IftaLabelModule,
    DialogModule,
    CalendarModule,
    DatePipe,
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent implements OnInit {
  public parentForm = input<CvForm>();
  protected isDialogOpen = signal(false);
  protected yearRange = `${new Date().getFullYear() - 50}:${new Date().getFullYear()}`;

  protected experienceForm: ExperienceForm = new FormGroup({
    experience: new FormArray<FormGroup<ExperienceItemForm>>([]),
  });

  protected experienceItemForm = new FormGroup<ExperienceItemForm>({
    title: new FormControl('', [Validators.required]),
    company: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl(''),
    description: new FormArray([new FormControl('', [Validators.required])]),
  });

  public ngOnInit(): void {
    this.parentForm()?.addControl(
      'experienceForm',
      this.experienceForm.get('experience') as ExperienceFormArray
    );
  }

  protected openDialog(): void {
    this.isDialogOpen.set(true);
    this.experienceItemForm.reset();
    // Ensure there's at least one description field
    const descriptionArray = this.experienceItemForm.get('description') as FormArray;
    while (descriptionArray.length > 1) {
      descriptionArray.removeAt(descriptionArray.length - 1);
    }
  }

  protected closeDialog(): void {
    this.isDialogOpen.set(false);
  }

  protected addExperience(): void {
    if (this.experienceItemForm.valid) {
      const experienceArray = this.experienceForm.get('experience') as FormArray;
      const value = this.experienceItemForm.value;
      const itemGroup = new FormGroup({
        title: new FormControl(value.title || '', { nonNullable: true }),
        company: new FormControl(value.company || '', { nonNullable: true }),
        location: new FormControl(value.location || '', { nonNullable: true }),
        startDate: new FormControl(value.startDate || '', {
          nonNullable: true,
        }),
        endDate: new FormControl(value.endDate || ''),
        description: new FormArray(
          (value.description || []).map(
            (desc: string | null): FormControl<string | null> =>
              new FormControl(desc || '', { nonNullable: true })
          )
        ),
      });
      experienceArray.push(itemGroup);
      this.closeDialog();
    }
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
