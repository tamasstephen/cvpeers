import { CvFormPersistenceMapper } from './cv-form-persistence.mapper';

describe('CvFormPersistenceMapper', (): void => {
  let mapper: CvFormPersistenceMapper;

  beforeEach((): void => {
    mapper = new CvFormPersistenceMapper();
  });

  it('serializes form values to JSON', (): void => {
    const payload = {
      personalDetailsForm: {
        fullName: 'Alex',
        email: 'alex@example.com',
        phone: '+1',
        website: 'https://example.com',
        headline: 'Engineer',
      },
      socialForm: { social: [] },
      experienceForm: [],
      educationForm: [],
      expertiseForm: [],
      strengthsForm: [],
      languagesForm: [],
      summary: '<p>Summary</p>',
    };

    const serialized = mapper.serialize(payload);

    expect(serialized).toBe(JSON.stringify(payload));
  });

  it('deserializes and normalizes date fields', (): void => {
    const serialized = JSON.stringify({
      personalDetailsForm: {
        fullName: 'Alex',
        email: 'alex@example.com',
        phone: '+1',
        website: 'https://example.com',
        headline: 'Engineer',
      },
      socialForm: { social: [] },
      experienceForm: [
        {
          title: 'Senior Engineer',
          company: 'Example Inc',
          location: 'Remote',
          startDate: '2023-01-01T00:00:00.000Z',
          endDate: null,
          description: ['Built systems'],
        },
      ],
      educationForm: [
        {
          degree: 'MSc',
          institution: 'Uni',
          location: 'City',
          graduationDate: '2019-06-01T00:00:00.000Z',
        },
      ],
      expertiseForm: ['Angular'],
      strengthsForm: ['Ownership'],
      languagesForm: [{ name: 'English', level: 'Native' }],
      summary: '<p>Summary</p>',
    });

    const deserialized = mapper.deserialize(serialized);

    expect(deserialized.experienceForm[0].startDate instanceof Date).toBeTrue();
    expect(deserialized.experienceForm[0].endDate).toBeNull();
    expect(deserialized.educationForm[0].graduationDate instanceof Date).toBeTrue();
    expect(deserialized.experienceForm[0].startDate?.toISOString()).toBe('2023-01-01T00:00:00.000Z');
    expect(deserialized.educationForm[0].graduationDate?.toISOString()).toBe('2019-06-01T00:00:00.000Z');
  });

  it('throws for invalid JSON', (): void => {
    expect((): void => {
      mapper.deserialize('{invalid');
    }).toThrowError();
  });

  it('throws for malformed date values', (): void => {
    const serialized = JSON.stringify({
      personalDetailsForm: {
        fullName: 'Alex',
        email: 'alex@example.com',
        phone: '+1',
        website: 'https://example.com',
        headline: 'Engineer',
      },
      socialForm: { social: [] },
      experienceForm: [
        {
          title: 'Senior Engineer',
          company: 'Example Inc',
          location: 'Remote',
          startDate: 'not-a-date',
          endDate: null,
          description: ['Built systems'],
        },
      ],
      educationForm: [],
      expertiseForm: [],
      strengthsForm: [],
      languagesForm: [],
      summary: '<p>Summary</p>',
    });

    expect((): void => {
      mapper.deserialize(serialized);
    }).toThrowError('Invalid startDate value');
  });

  it('normalizes nullable summary values to empty string', (): void => {
    const serialized = JSON.stringify({
      personalDetailsForm: {
        fullName: 'Alex',
        email: 'alex@example.com',
        phone: '+1',
        website: 'https://example.com',
        headline: 'Engineer',
      },
      socialForm: { social: [] },
      experienceForm: [],
      educationForm: [],
      expertiseForm: [],
      strengthsForm: [],
      languagesForm: [],
      summary: null,
    });

    const deserialized = mapper.deserialize(serialized);

    expect(deserialized.summary).toBe('');
  });

  it('normalizes nullable personal detail strings to empty strings', (): void => {
    const serialized = JSON.stringify({
      personalDetailsForm: {
        fullName: null,
        email: null,
        phone: null,
        website: null,
        headline: null,
      },
      socialForm: { social: [] },
      experienceForm: [],
      educationForm: [],
      expertiseForm: [],
      strengthsForm: [],
      languagesForm: [],
      summary: '<p>Summary</p>',
    });

    const deserialized = mapper.deserialize(serialized);

    expect(deserialized.personalDetailsForm).toEqual({
      fullName: '',
      email: '',
      phone: '',
      website: '',
      headline: '',
    });
  });
});
