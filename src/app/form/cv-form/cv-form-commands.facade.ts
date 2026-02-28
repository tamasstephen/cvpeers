import { Injectable, TemplateRef, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Template } from '../../enums/template.enum';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator.service';
import { StoredFormData } from './cv-form-persistence.mapper';
import {
  createEducationItemFormGroup,
  createExperienceItemFormGroup,
  createLanguageItemFormGroup,
  createSocialItemFormControl,
} from './cv-form-section-array.factory';
import { CvFormStorageAdapter } from './cv-form-storage.adapter';

interface ResetFormCommand {
  form: FormGroup;
  reset$: Subject<boolean>;
  closeResetDialog: () => void;
  detectChanges: () => void;
  showToast: () => void;
}

interface ApplyDummyDataCommand {
  form: FormGroup;
  dummyData: StoredFormData;
  reset$: Subject<boolean>;
  richTextInitialValue: Subject<string | null>;
  detectChanges: () => void;
}

@Injectable({ providedIn: 'root' })
export class CvFormCommandsFacade {
  readonly #pdfService: PdfGeneratorService = inject(PdfGeneratorService);

  readonly #storageAdapter: CvFormStorageAdapter = inject(CvFormStorageAdapter);

  public async downloadPdfFromPreview(): Promise<void> {
    const element = document.querySelector('#cv-raw');
    if (!element) {
      return;
    }

    await this.#pdfService.createPdfFromHtml(element);
  }

  public openResetDialog(
    dialog: MatDialog,
    template: TemplateRef<unknown>
  ): MatDialogRef<unknown> {
    return dialog.open(template, {
      width: '400px',
      disableClose: true,
    });
  }

  public closeResetDialog(dialogRef: MatDialogRef<unknown> | null): MatDialogRef<unknown> | null {
    dialogRef?.close();
    return null;
  }

  public resetForm(command: ResetFormCommand): void {
    command.form.reset();

    const templateControl = command.form.get('templateForm');
    if (templateControl instanceof FormControl) {
      templateControl.setValue(Template.MINIMAL);
    }

    this.#storageAdapter.clear();
    command.closeResetDialog();
    command.reset$.next(true);
    command.detectChanges();
    command.showToast();
  }

  public applyDummyData(command: ApplyDummyDataCommand): void {
    command.form.reset();
    this.#storageAdapter.clear();
    command.reset$.next(true);

    const templateControl = command.form.get('templateForm');
    if (templateControl instanceof FormControl) {
      templateControl.setValue(Template.MINIMAL);
    }

    const personalDetails = command.form.get('personalDetailsForm');
    if (personalDetails instanceof FormGroup) {
      personalDetails.patchValue(command.dummyData.personalDetailsForm);
    }

    const socialControl = command.form.get('socialForm.social');
    if (socialControl instanceof FormArray) {
      command.dummyData.socialForm.social.forEach((item): void => {
        socialControl.push(createSocialItemFormControl(item));
      });
    }

    const experienceControl = command.form.get('experienceForm');
    if (experienceControl instanceof FormArray) {
      command.dummyData.experienceForm.forEach((experience): void => {
        experienceControl.push(createExperienceItemFormGroup(experience));
      });
    }

    const educationControl = command.form.get('educationForm');
    if (educationControl instanceof FormArray) {
      command.dummyData.educationForm.forEach((education): void => {
        educationControl.push(createEducationItemFormGroup(education));
      });
    }

    const expertiseControl = command.form.get('expertiseForm');
    if (expertiseControl instanceof FormArray) {
      command.dummyData.expertiseForm.forEach((item): void => {
        expertiseControl.push(new FormControl(item, { nonNullable: true }));
      });
    }

    const strengthsControl = command.form.get('strengthsForm');
    if (strengthsControl instanceof FormArray) {
      command.dummyData.strengthsForm.forEach((item): void => {
        strengthsControl.push(new FormControl(item, { nonNullable: true }));
      });
    }

    const languagesControl = command.form.get('languagesForm');
    if (languagesControl instanceof FormArray) {
      command.dummyData.languagesForm.forEach((language): void => {
        languagesControl.push(createLanguageItemFormGroup(language));
      });
    }

    const summaryControl = command.form.get('summary');
    if (summaryControl instanceof FormControl) {
      summaryControl.setValue(command.dummyData.summary);
      command.richTextInitialValue.next(command.dummyData.summary);
    }

    command.detectChanges();
  }
}
