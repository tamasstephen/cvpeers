import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { CvFormStateFacade } from './cv-form-state.facade';
import { StoredFormData } from './cv-form-persistence.mapper';

describe('CvFormStateFacade', (): void => {
  let facade: CvFormStateFacade;

  beforeEach((): void => {
    facade = new CvFormStateFacade();
  });

  it('detects when value tree has no meaningful values', (): void => {
    const value = {
      personalDetailsForm: {
        fullName: '',
        email: '',
      },
      experienceForm: [],
      summary: '',
    };

    expect(facade.hasMeaningfulValues(value)).toBeFalse();
  });

  it('detects when value tree has meaningful values', (): void => {
    const value = {
      personalDetailsForm: {
        fullName: 'Alex',
      },
      experienceForm: [],
      summary: '',
    };

    expect(facade.hasMeaningfulValues(value)).toBeTrue();
  });

  it('hydrates form controls and arrays from stored data', (): void => {
    const form = new FormGroup({
      personalDetailsForm: new FormGroup({
        fullName: new FormControl(''),
        email: new FormControl(''),
        phone: new FormControl(''),
        website: new FormControl(''),
        headline: new FormControl(''),
      }),
      socialForm: new FormGroup({
        social: new FormArray([]),
      }),
      experienceForm: new FormArray([]),
      educationForm: new FormArray([]),
      expertiseForm: new FormArray([]),
      strengthsForm: new FormArray([]),
      languagesForm: new FormArray([]),
      summary: new FormControl(''),
    });

    const richTextInitialValue = new Subject<string | null>();
    const richTextValues: Array<string | null> = [];
    richTextInitialValue.subscribe((value: string | null): void => {
      richTextValues.push(value);
    });

    const formData: StoredFormData = {
      personalDetailsForm: {
        fullName: 'Alex',
        email: 'alex@example.com',
        phone: '+1',
        website: 'https://example.com',
        headline: 'Engineer',
      },
      socialForm: {
        social: [
          {
            type: 'github',
            url: 'https://github.com/alex',
            src: 'assets/images/github-fill.png',
          },
        ],
      },
      experienceForm: [
        {
          title: 'Senior Engineer',
          company: 'Example Inc',
          location: 'Remote',
          startDate: new Date('2023-01-01T00:00:00.000Z'),
          endDate: null,
          description: ['Built systems'],
        },
      ],
      educationForm: [
        {
          degree: 'BSc',
          institution: 'University',
          location: 'City',
          graduationDate: new Date('2018-06-01T00:00:00.000Z'),
        },
      ],
      expertiseForm: ['Angular'],
      strengthsForm: ['Ownership'],
      languagesForm: [{ name: 'English', level: 'Native' }],
      summary: '<p>Summary</p>',
    };

    let detectChangesCalled = false;

    facade.applyStoredData({
      form,
      formData,
      richTextInitialValue,
      detectChanges: (): void => {
        detectChangesCalled = true;
      },
    });

    const personalDetails = form.get('personalDetailsForm') as FormGroup;
    const social = form.get('socialForm.social') as FormArray;
    const experience = form.get('experienceForm') as FormArray;
    const education = form.get('educationForm') as FormArray;
    const expertise = form.get('expertiseForm') as FormArray;
    const strengths = form.get('strengthsForm') as FormArray;
    const languages = form.get('languagesForm') as FormArray;
    const summary = form.get('summary') as FormControl;

    expect(personalDetails.controls['fullName'].value).toBe('Alex');
    expect(social.length).toBe(1);
    expect(experience.length).toBe(1);
    expect(education.length).toBe(1);
    expect(expertise.length).toBe(1);
    expect(strengths.length).toBe(1);
    expect(languages.length).toBe(1);
    expect(summary.value).toBe('<p>Summary</p>');
    expect(richTextValues).toEqual(['<p>Summary</p>']);
    expect(detectChangesCalled).toBeTrue();
  });
});
