import { FormArray, FormControl } from '@angular/forms';
import { clearFormArray } from './form-array.utils';

describe('clearFormArray', (): void => {
  it('removes all controls from the form array', (): void => {
    const formArray = new FormArray([
      new FormControl('one'),
      new FormControl('two'),
      new FormControl('three'),
    ]);

    clearFormArray(formArray);

    expect(formArray.length).toBe(0);
  });

  it('keeps empty arrays unchanged', (): void => {
    const formArray = new FormArray<FormControl<string | null>>([]);

    clearFormArray(formArray);

    expect(formArray.length).toBe(0);
  });
});
