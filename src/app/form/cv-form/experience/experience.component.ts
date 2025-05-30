import {
  Component,
  input,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DatePipe } from '@angular/common';

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
  parentForm = input<FormGroup>();
  isDialogOpen = signal(false);
  yearRange = `${new Date().getFullYear() - 50}:${new Date().getFullYear()}`;

  experienceForm = new FormGroup({
    experience: new FormArray([]),
  });

  experienceItemForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    company: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl(''),
    description: new FormArray([new FormControl('', [Validators.required])]),
  });

  ngOnInit(): void {
    this.parentForm()?.addControl(
      'experienceForm',
      this.experienceForm.get('experience')
    );
  }

  openDialog() {
    this.isDialogOpen.set(true);
    this.experienceItemForm.reset();
    // Ensure there's at least one description field
    const descriptionArray = this.experienceItemForm.get(
      'description'
    ) as FormArray;
    while (descriptionArray.length > 1) {
      descriptionArray.removeAt(descriptionArray.length - 1);
    }
  }

  closeDialog() {
    this.isDialogOpen.set(false);
  }

  addExperience() {
    if (this.experienceItemForm.valid) {
      const experienceArray = this.experienceForm.get(
        'experience'
      ) as FormArray;
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
            (desc) => new FormControl(desc || '', { nonNullable: true })
          )
        ),
      });
      experienceArray.push(itemGroup);
      this.closeDialog();
    }
  }

  removeExperience(index: number) {
    const experienceArray = this.experienceForm.get('experience') as FormArray;
    experienceArray.removeAt(index);
  }

  addDescriptionField() {
    const descriptionArray = this.experienceItemForm.get(
      'description'
    ) as FormArray;
    descriptionArray.push(new FormControl('', [Validators.required]));
  }

  removeDescriptionField(index: number) {
    const descriptionArray = this.experienceItemForm.get(
      'description'
    ) as FormArray;
    if (descriptionArray.length > 1) {
      descriptionArray.removeAt(index);
    }
  }

  get descriptionControls() {
    return (this.experienceItemForm.get('description') as FormArray).controls;
  }

  get experienceControls() {
    return (this.experienceForm.get('experience') as FormArray)
      .controls as FormGroup[];
  }

  getDescriptionControls(experience: FormGroup) {
    return (experience.get('description') as FormArray).controls;
  }
}
