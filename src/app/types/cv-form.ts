import { FormControl, FormGroup } from '@angular/forms';
import { EducationFormArray } from './education-form';
import { ExperienceForm } from './experience-form';
import { LanguageForm } from './language-form';
import { PersonalDetailsForm } from './personal-details-form';
import { SocialForm } from './social';
import { TagListForm } from './tag-list-form';

export type CvForm = FormGroup<{
  personalDetailsForm?: PersonalDetailsForm;
  socialForm?: SocialForm;
  summary?: FormControl<string>;
  experienceForm?: ExperienceForm;
  educationForm?: EducationFormArray;
  expertiseForm?: TagListForm;
  strengthsForm?: TagListForm;
  languagesForm?: LanguageForm;
}>;
