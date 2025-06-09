import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function hasChangedFromInitial(initialValue: unknown): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!initialValue) {
      return null;
    }

    const currentValue = control.value as unknown;
    const hasChanged = JSON.stringify(currentValue) !== JSON.stringify(initialValue);

    return hasChanged ? null : { unchanged: true };
  };
}
