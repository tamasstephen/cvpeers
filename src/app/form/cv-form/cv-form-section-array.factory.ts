import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { EducationItemForm, EducationItemFormValues } from '../../types/education-form';
import { ExperienceItemForm, ExperienceItemFormValues } from '../../types/experience-form';
import { LanguageItemForm, LanguageItemFormValues } from '../../types/language-form';
import { SocialItem } from '../../types/social';

export const createSocialItemFormControl = (
  socialItem: SocialItem
): FormControl<SocialItem> => new FormControl(socialItem, { nonNullable: true });

export const createExperienceItemFormGroup = (
  experienceItem: ExperienceItemFormValues
): FormGroup<ExperienceItemForm> => {
  const descriptionControls = experienceItem.description
    .filter((descriptionItem): descriptionItem is string => descriptionItem !== null)
    .map(
      (descriptionItem): FormControl<ExperienceItemFormValues['description'][number]> =>
        new FormControl(descriptionItem)
    );

  return new FormGroup({
    title: new FormControl(experienceItem.title, { nonNullable: true }),
    company: new FormControl(experienceItem.company, { nonNullable: true }),
    location: new FormControl(experienceItem.location, { nonNullable: true }),
    startDate: new FormControl(experienceItem.startDate, { nonNullable: true }),
    endDate: new FormControl(experienceItem.endDate),
    description: new FormArray(descriptionControls),
  });
};

export const createEducationItemFormGroup = (
  educationItem: EducationItemFormValues
): FormGroup<EducationItemForm> =>
  new FormGroup({
    degree: new FormControl(educationItem.degree, { nonNullable: true }),
    institution: new FormControl(educationItem.institution, { nonNullable: true }),
    location: new FormControl(educationItem.location, { nonNullable: true }),
    graduationDate: new FormControl(educationItem.graduationDate, { nonNullable: true }),
  });

export const createLanguageItemFormGroup = (
  languageItem: LanguageItemFormValues
): LanguageItemForm =>
  new FormGroup({
    name: new FormControl(languageItem.name, { nonNullable: true }),
    level: new FormControl(languageItem.level, { nonNullable: true }),
  });
