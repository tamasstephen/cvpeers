import { AbstractControl, FormArray } from '@angular/forms';

export const clearFormArray = <TControl extends AbstractControl>(
  formArray: FormArray<TControl>
): void => {
  while (formArray.length) {
    formArray.removeAt(0);
  }
};
