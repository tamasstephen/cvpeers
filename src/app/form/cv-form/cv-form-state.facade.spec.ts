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

  it('replaces existing array controls when hydrating stored data', (): void => {
    const form = new FormGroup({
      personalDetailsForm: new FormGroup({
        fullName: new FormControl('Old Name'),
        email: new FormControl('old@example.com'),
        phone: new FormControl('+1'),
        website: new FormControl(''),
        headline: new FormControl('Old Headline'),
      }),
      socialForm: new FormGroup({
        social: new FormArray([
          new FormControl({
            type: 'github',
            url: 'https://github.com/old',
            src: 'assets/images/github-fill.png',
          }),
        ]),
      }),
      experienceForm: new FormArray([
        new FormGroup({
          title: new FormControl('Old Experience'),
          company: new FormControl('Old Co'),
          location: new FormControl('Old Location'),
          startDate: new FormControl(new Date('2020-01-01')),
          endDate: new FormControl(null),
          description: new FormArray([new FormControl('Old description')]),
        }),
      ]),
      educationForm: new FormArray([
        new FormGroup({
          degree: new FormControl('Old Degree'),
          institution: new FormControl('Old School'),
          location: new FormControl('Old City'),
          graduationDate: new FormControl(new Date('2010-01-01')),
        }),
      ]),
      expertiseForm: new FormArray([new FormControl('Legacy skill')]),
      strengthsForm: new FormArray([new FormControl('Legacy strength')]),
      languagesForm: new FormArray([
        new FormGroup({
          name: new FormControl('Hungarian'),
          level: new FormControl('Native'),
        }),
      ]),
      summary: new FormControl('Old summary'),
    });

    const richTextInitialValue = new Subject<string | null>();
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
            type: 'linkedin',
            url: 'https://linkedin.com/in/alex',
            src: 'assets/images/linkedin-box-fill.png',
          },
        ],
      },
      experienceForm: [
        {
          title: 'New Experience',
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

    facade.applyStoredData({
      form,
      formData,
      richTextInitialValue,
      detectChanges: (): void => {},
    });

    const social = form.get('socialForm.social') as FormArray;
    const experience = form.get('experienceForm') as FormArray;
    const education = form.get('educationForm') as FormArray;
    const expertise = form.get('expertiseForm') as FormArray;
    const strengths = form.get('strengthsForm') as FormArray;
    const languages = form.get('languagesForm') as FormArray;

    expect(social.length).toBe(1);
    expect(JSON.stringify(social.at(0).value)).toContain('https://linkedin.com/in/alex');
    expect(experience.length).toBe(1);
    expect(JSON.stringify(experience.at(0).value)).toContain('New Experience');
    expect(education.length).toBe(1);
    expect(JSON.stringify(education.at(0).value)).toContain('BSc');
    expect(expertise.length).toBe(1);
    expect(expertise.at(0).value).toBe('Angular');
    expect(strengths.length).toBe(1);
    expect(strengths.at(0).value).toBe('Ownership');
    expect(languages.length).toBe(1);
    expect(JSON.stringify(languages.at(0).value)).toContain('English');
  });

  it('is idempotent when applying the same stored data repeatedly', (): void => {
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

    facade.applyStoredData({
      form,
      formData,
      richTextInitialValue,
      detectChanges: (): void => {},
    });
    facade.applyStoredData({
      form,
      formData,
      richTextInitialValue,
      detectChanges: (): void => {},
    });

    expect((form.get('socialForm.social') as FormArray).length).toBe(1);
    expect((form.get('experienceForm') as FormArray).length).toBe(1);
    expect((form.get('educationForm') as FormArray).length).toBe(1);
    expect((form.get('expertiseForm') as FormArray).length).toBe(1);
    expect((form.get('strengthsForm') as FormArray).length).toBe(1);
    expect((form.get('languagesForm') as FormArray).length).toBe(1);
  });
});
