import { FormGroup } from '@angular/forms';
import { createCvFormSkeleton } from './cv-form-skeleton.factory';

describe('createCvFormSkeleton', (): void => {
  it('creates an empty cv form group', (): void => {
    const form = createCvFormSkeleton();

    expect(form instanceof FormGroup).toBeTrue();
    expect(Object.keys(form.controls)).toEqual([]);
  });

  it('returns a new form group instance on each call', (): void => {
    const first = createCvFormSkeleton();
    const second = createCvFormSkeleton();

    expect(first).not.toBe(second);
  });
});
