import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type TagListForm = FormGroup<{
  items: FormArray<FormControl<string>>;
}>;

export type TagListFormValues = {
  items: (string | null)[];
};
