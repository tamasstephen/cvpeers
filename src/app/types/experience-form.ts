import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type ExperienceItemForm = {
  title: FormControl<ExperienceItemFormValues['title']>;
  company: FormControl<ExperienceItemFormValues['company']>;
  location: FormControl<ExperienceItemFormValues['location']>;
  startDate: FormControl<ExperienceItemFormValues['startDate']>;
  endDate: FormControl<ExperienceItemFormValues['endDate']>;
  description: FormArray<FormControl<ExperienceItemFormValues['description'][number]>>;
};

export type ExperienceForm = FormGroup<{
  experience: ExperienceFormArray;
}>;

export type ExperienceFormArray = FormArray<FormGroup<ExperienceItemForm>>;

export type ExperienceItemFormValues = {
  title: string | null;
  company: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  description: (string | null)[];
};

export type ExperienceFormValues = ExperienceItemFormValues[];
