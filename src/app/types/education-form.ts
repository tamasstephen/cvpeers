import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type EducationItemForm = {
  degree: FormControl<EducationItemFormValues['degree']>;
  institution: FormControl<EducationItemFormValues['institution']>;
  location: FormControl<EducationItemFormValues['location']>;
  startDate: FormControl<EducationItemFormValues['startDate']>;
  endDate: FormControl<EducationItemFormValues['endDate']>;
};

export type EducationForm = FormGroup<{
  education: EducationFormArray;
}>;

export type EducationFormArray = FormArray<FormGroup<EducationItemForm>>;

export type EducationItemFormValues = {
  degree: string | null;
  institution: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type EducationFormValues = EducationItemFormValues[];
