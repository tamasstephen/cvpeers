import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type LanguageItemForm = FormGroup<{
  name: FormControl<LanguageItemFormValues['name']>;
  level: FormControl<LanguageItemFormValues['level']>;
}>;

export type LanguageForm = FormGroup<{
  languages: FormArray<LanguageItemForm>;
}>;

export type LanguageFormArray = FormArray<LanguageItemForm>;

export type LanguageItemFormValues = {
  name: string | null;
  level: string | null;
};

export type LanguageFormValues = LanguageItemFormValues[];
