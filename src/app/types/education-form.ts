import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type EducationItemForm = {
  degree: FormControl<EducationItemFormValues['degree']>;
  institution: FormControl<EducationItemFormValues['institution']>;
  location: FormControl<EducationItemFormValues['location']>;
  graduationDate: FormControl<EducationItemFormValues['graduationDate']>;
};

export type EducationForm = FormGroup<{
  education: EducationFormArray;
}>;

export type EducationFormArray = FormArray<FormGroup<EducationItemForm>>;

export type EducationItemFormValues = {
  degree: string | null;
  institution: string | null;
  location: string | null;
  graduationDate: string | null;
};

export type EducationFormValues = EducationItemFormValues[];
