import { FormArray } from '@angular/forms';
import {
  createEducationItemFormGroup,
  createExperienceItemFormGroup,
  createLanguageItemFormGroup,
  createSocialItemFormControl,
} from './cv-form-section-array.factory';

describe('cv form section array factories', (): void => {
  it('creates social control with non-nullable item value', (): void => {
    const control = createSocialItemFormControl({
      type: 'github',
      url: 'https://github.com/example',
      src: 'assets/images/github-fill.png',
    });

    expect(control.value.type).toBe('github');
    expect(control.value.url).toBe('https://github.com/example');
  });

  it('creates experience group with filtered description entries', (): void => {
    const group = createExperienceItemFormGroup({
      title: 'Senior Engineer',
      company: 'Example Inc',
      location: 'Remote',
      startDate: new Date('2023-01-01T00:00:00.000Z'),
      endDate: null,
      description: ['Delivered platform work', null],
    });

    expect(group.controls.title.value).toBe('Senior Engineer');
    expect(group.controls.description instanceof FormArray).toBeTrue();
    expect(group.controls.description.length).toBe(1);
    expect(group.controls.description.at(0).value).toBe('Delivered platform work');
  });

  it('creates education group with graduation date control', (): void => {
    const date = new Date('2019-06-01T00:00:00.000Z');
    const group = createEducationItemFormGroup({
      degree: 'BSc',
      institution: 'University',
      location: 'Budapest',
      graduationDate: date,
    });

    expect(group.controls.graduationDate.value).toBe(date);
    expect(group.controls.degree.value).toBe('BSc');
  });

  it('creates language group', (): void => {
    const group = createLanguageItemFormGroup({
      name: 'English',
      level: 'Native',
    });

    expect(group.controls.name.value).toBe('English');
    expect(group.controls.level.value).toBe('Native');
  });
});
