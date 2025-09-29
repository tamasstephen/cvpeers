import { CvForm } from '@/types/cv-form';
import { ExperienceForm, ExperienceFormArray, ExperienceItemForm } from '@/types/experience-form';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { Subject } from 'rxjs';
import { ComponentBaseComponent } from '../../../shared/core/component-base/component-base.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    IftaLabelModule,
    DialogModule,
    DatePickerModule,
    CalendarModule,
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
    this.editIndex.set(null);
  }

  protected saveExperience(): void {
    if (this.editIndex() !== null) {
      this.updateExperience();
      return;
    }
    if (this.experienceItemForm.valid) {
      const experienceArray = this.experienceForm.get('experience') as FormArray;
      const value = this.experienceItemForm.value;
      const itemGroup = new FormGroup({
        title: new FormControl(value.title || '', { nonNullable: true }),
        company: new FormControl(value.company || '', { nonNullable: true }),
        location: new FormControl(value.location || '', { nonNullable: true }),
        startDate: new FormControl<Date | null>(value.startDate || null, {
          nonNullable: true,
        }),
        endDate: new FormControl<Date | null>(value.endDate || null, {
          nonNullable: true,
        }),
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

  protected editExperience(index: number): void {
    this.isDialogOpen.set(true);
    this.editIndex.set(index);
    const experienceArray = this.experienceForm.get('experience') as FormArray<
      FormGroup<ExperienceItemForm>
    >;
    const experience = experienceArray.at(index);
    this.experienceItemForm.patchValue(experience.value);
    console.log(experience.value);
  }

  protected updateExperience(): void {
    if (this.experienceItemForm.valid) {
      const experienceArray = this.experienceForm.get('experience') as FormArray;
      experienceArray.at(this.editIndex() as number).patchValue(this.experienceItemForm.value);
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
