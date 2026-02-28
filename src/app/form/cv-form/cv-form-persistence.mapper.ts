import { Injectable } from '@angular/core';
import { EducationItemFormValues } from '../../types/education-form';
import { ExperienceItemFormValues } from '../../types/experience-form';
import { LanguageItemFormValues } from '../../types/language-form';
import { PersonalDetailsFormValues } from '../../types/personal-details-form';
import { Social, SocialFormValues, SocialItem } from '../../types/social';

export interface StoredFormData {
  personalDetailsForm: PersonalDetailsFormValues;
  socialForm: { social: SocialFormValues };
  experienceForm: ExperienceItemFormValues[];
  educationForm: EducationItemFormValues[];
  expertiseForm: string[];
  strengthsForm: string[];
  languagesForm: LanguageItemFormValues[];
  summary: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseNullableString = (value: unknown): string | null => {
  if (value === null) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  throw new Error('Invalid string value');
};

const parseRequiredString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  throw new Error('Invalid string value');
};

const parseSocialType = (value: unknown): Social => {
  if (value === 'github' || value === 'linkedin') {
    return value;
  }

  throw new Error('Invalid social type value');
};

const parseDateField = (value: unknown, fieldName: string): Date | null => {
  if (value === null) {
    return null;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error(`Invalid ${fieldName} value`);
    }
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid ${fieldName} value`);
    }
    return parsedDate;
  }

  throw new Error(`Invalid ${fieldName} value`);
};

@Injectable({ providedIn: 'root' })
export class CvFormPersistenceMapper {
  public serialize(formValue: unknown): string {
    return JSON.stringify(formValue);
  }

  public deserialize(serializedFormData: string): StoredFormData {
    const parsedData: unknown = JSON.parse(serializedFormData);
    if (!isRecord(parsedData)) {
      throw new Error('Invalid stored form data');
    }

    return {
      personalDetailsForm: this.#parsePersonalDetails(parsedData['personalDetailsForm']),
      socialForm: this.#parseSocialForm(parsedData['socialForm']),
      experienceForm: this.#parseExperienceForm(parsedData['experienceForm']),
      educationForm: this.#parseEducationForm(parsedData['educationForm']),
      expertiseForm: this.#parseStringArray(parsedData['expertiseForm']),
      strengthsForm: this.#parseStringArray(parsedData['strengthsForm']),
      languagesForm: this.#parseLanguagesForm(parsedData['languagesForm']),
      summary: parseRequiredString(parsedData['summary']),
    };
  }

  #parsePersonalDetails(value: unknown): PersonalDetailsFormValues {
    if (!isRecord(value)) {
      throw new Error('Invalid personalDetailsForm value');
    }

    return {
      fullName: parseNullableString(value['fullName']),
      email: parseNullableString(value['email']),
      phone: parseNullableString(value['phone']),
      website: parseNullableString(value['website']),
      headline: parseNullableString(value['headline']),
    };
  }

  #parseSocialForm(value: unknown): { social: SocialFormValues } {
    if (!isRecord(value) || !Array.isArray(value['social'])) {
      throw new Error('Invalid socialForm value');
    }

    const social = value['social'].map((item: unknown): SocialItem => {
      if (!isRecord(item)) {
        throw new Error('Invalid social item value');
      }

      return {
        type: parseSocialType(item['type']),
        url: parseRequiredString(item['url']),
        src: parseRequiredString(item['src']),
      };
    });

    return { social };
  }

  #parseExperienceForm(value: unknown): ExperienceItemFormValues[] {
    if (!Array.isArray(value)) {
      throw new Error('Invalid experienceForm value');
    }

    return value.map((item: unknown): ExperienceItemFormValues => {
      if (!isRecord(item) || !Array.isArray(item['description'])) {
        throw new Error('Invalid experience item value');
      }

      return {
        title: parseNullableString(item['title']),
        company: parseNullableString(item['company']),
        location: parseNullableString(item['location']),
        startDate: parseDateField(item['startDate'], 'startDate'),
        endDate: parseDateField(item['endDate'], 'endDate'),
        description: item['description'].map((descriptionItem: unknown): string | null =>
          parseNullableString(descriptionItem)
        ),
      };
    });
  }

  #parseEducationForm(value: unknown): EducationItemFormValues[] {
    if (!Array.isArray(value)) {
      throw new Error('Invalid educationForm value');
    }

    return value.map((item: unknown): EducationItemFormValues => {
      if (!isRecord(item)) {
        throw new Error('Invalid education item value');
      }

      return {
        degree: parseNullableString(item['degree']),
        institution: parseNullableString(item['institution']),
        location: parseNullableString(item['location']),
        graduationDate: parseDateField(item['graduationDate'], 'graduationDate'),
      };
    });
  }

  #parseLanguagesForm(value: unknown): LanguageItemFormValues[] {
    if (!Array.isArray(value)) {
      throw new Error('Invalid languagesForm value');
    }

    return value.map((item: unknown): LanguageItemFormValues => {
      if (!isRecord(item)) {
        throw new Error('Invalid language item value');
      }

      return {
        name: parseNullableString(item['name']),
        level: parseNullableString(item['level']),
      };
    });
  }

  #parseStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) {
      throw new Error('Invalid string array value');
    }

    return value.map((item: unknown): string => parseRequiredString(item));
  }
}
