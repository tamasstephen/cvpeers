import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { StoredFormData } from './cv-form-persistence.mapper';
import {
  createEducationItemFormGroup,
  createExperienceItemFormGroup,
  createLanguageItemFormGroup,
  createSocialItemFormControl,
} from './cv-form-section-array.factory';

interface ApplyStoredDataCommand {
  form: FormGroup;
  formData: StoredFormData;
  richTextInitialValue: Subject<string | null>;
  detectChanges: () => void;
}

@Injectable({ providedIn: 'root' })
export class CvFormStateFacade {
  public hasMeaningfulValues(value: unknown): boolean {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (value && typeof value === 'object') {
      return Object.values(value).some((nestedValue): boolean => this.hasMeaningfulValues(nestedValue));
    }

    return Boolean(value);
  }

  public applyStoredData(command: ApplyStoredDataCommand): void {
    const personalDetails = command.form.get('personalDetailsForm');
    if (personalDetails instanceof FormGroup) {
      personalDetails.patchValue(command.formData.personalDetailsForm);
    }

    const socialControl = command.form.get('socialForm.social');
    if (socialControl instanceof FormArray) {
      command.formData.socialForm.social.forEach((item): void => {
        socialControl.push(createSocialItemFormControl(item));
      });
    }

    const experienceControl = command.form.get('experienceForm');
    if (experienceControl instanceof FormArray) {
      command.formData.experienceForm.forEach((experience): void => {
        experienceControl.push(createExperienceItemFormGroup(experience));
      });
    }

    const educationControl = command.form.get('educationForm');
    if (educationControl instanceof FormArray) {
      command.formData.educationForm.forEach((education): void => {
        educationControl.push(createEducationItemFormGroup(education));
      });
    }

    const expertiseControl = command.form.get('expertiseForm');
    if (expertiseControl instanceof FormArray) {
      command.formData.expertiseForm.forEach((item): void => {
        expertiseControl.push(new FormControl(item, { nonNullable: true }));
      });
    }

    const strengthsControl = command.form.get('strengthsForm');
    if (strengthsControl instanceof FormArray) {
      command.formData.strengthsForm.forEach((item): void => {
        strengthsControl.push(new FormControl(item, { nonNullable: true }));
      });
    }

    const languagesControl = command.form.get('languagesForm');
    if (languagesControl instanceof FormArray) {
      command.formData.languagesForm.forEach((language): void => {
        languagesControl.push(createLanguageItemFormGroup(language));
      });
    }

    const summaryControl = command.form.get('summary');
    if (summaryControl instanceof FormControl) {
      summaryControl.setValue(command.formData.summary);
      command.richTextInitialValue.next(command.formData.summary);
    }

    command.detectChanges();
  }
}
