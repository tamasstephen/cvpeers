import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function hasChangedFromInitial(initialValue: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!initialValue) {
      return null;
    }

    const currentValue = control.value;
    const hasChanged =
      JSON.stringify(currentValue) !== JSON.stringify(initialValue);

    return hasChanged ? null : { unchanged: true };
  };
}
