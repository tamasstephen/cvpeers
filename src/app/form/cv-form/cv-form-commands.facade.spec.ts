import { ChangeDetectorRef, TemplateRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Template } from '../../enums/template.enum';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator.service';
import { CvFormCommandsFacade } from './cv-form-commands.facade';
import { CvFormStorageAdapter } from './cv-form-storage.adapter';
import { StoredFormData } from './cv-form-persistence.mapper';

describe('CvFormCommandsFacade', (): void => {
  let facade: CvFormCommandsFacade;
  let pdfServiceSpy: jasmine.SpyObj<PdfGeneratorService>;
  let storageAdapterSpy: jasmine.SpyObj<CvFormStorageAdapter>;

  beforeEach((): void => {
    pdfServiceSpy = jasmine.createSpyObj<PdfGeneratorService>('PdfGeneratorService', ['createPdfFromHtml']);
    pdfServiceSpy.createPdfFromHtml.and.resolveTo();

    storageAdapterSpy = jasmine.createSpyObj<CvFormStorageAdapter>('CvFormStorageAdapter', ['clear']);

    TestBed.configureTestingModule({
      providers: [
        CvFormCommandsFacade,
        { provide: PdfGeneratorService, useValue: pdfServiceSpy },
        { provide: CvFormStorageAdapter, useValue: storageAdapterSpy },
      ],
    });

    facade = TestBed.inject(CvFormCommandsFacade);
  });

  it('downloads pdf when preview element exists', async (): Promise<void> => {
    const element = document.createElement('div');
    element.id = 'cv-raw';
    document.body.appendChild(element);

    await facade.downloadPdfFromPreview();

    expect(pdfServiceSpy.createPdfFromHtml).toHaveBeenCalledWith(element);
    document.body.removeChild(element);
  });

  it('opens reset dialog using configured options', (): void => {
    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>('MatDialogRef', ['close']);
    const dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    const template = {} as TemplateRef<unknown>;
    dialogSpy.open.and.returnValue(dialogRefSpy);

    const dialogRef = facade.openResetDialog(dialogSpy, template);

    expect(dialogSpy.open).toHaveBeenCalledWith(template, {
      width: '400px',
      disableClose: true,
    });
    expect(dialogRef).toBe(dialogRefSpy);
  });

  it('resets form, clears persisted data and emits reset', (): void => {
    const reset$ = new Subject<boolean>();
    const resetValues: boolean[] = [];
    reset$.subscribe((value: boolean): void => {
      resetValues.push(value);
    });

    const form = new FormGroup({
      templateForm: new FormControl(Template.CLASSIC, { nonNullable: true }),
    });

    const cdRefSpy = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['detectChanges']);
    const closeResetDialogSpy = jasmine.createSpy('closeResetDialog');
    const showToastSpy = jasmine.createSpy('showToast');

    facade.resetForm({
      form,
      reset$,
      closeResetDialog: closeResetDialogSpy,
      detectChanges: (): void => cdRefSpy.detectChanges(),
      showToast: showToastSpy,
    });

    expect(form.controls.templateForm.value).toBe(Template.MINIMAL);
    expect(storageAdapterSpy.clear).toHaveBeenCalled();
    expect(closeResetDialogSpy).toHaveBeenCalled();
    expect(cdRefSpy.detectChanges).toHaveBeenCalled();
    expect(showToastSpy).toHaveBeenCalled();
    expect(resetValues).toEqual([true]);
  });

  it('applies dummy data and emits rich text initial value', (): void => {
    const reset$ = new Subject<boolean>();
    const resetValues: boolean[] = [];
    reset$.subscribe((value: boolean): void => {
      resetValues.push(value);
    });

    const richTextInitialValue = new Subject<string | null>();
    const richTextValues: Array<string | null> = [];
    richTextInitialValue.subscribe((value: string | null): void => {
      richTextValues.push(value);
    });

    const form = new FormGroup({
      templateForm: new FormControl(Template.CLASSIC, { nonNullable: true }),
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

    const dummyData: StoredFormData = {
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

    const cdRefSpy = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['detectChanges']);

    facade.applyDummyData({
      form,
      dummyData,
      reset$,
      richTextInitialValue,
      detectChanges: (): void => cdRefSpy.detectChanges(),
    });

    expect(storageAdapterSpy.clear).toHaveBeenCalled();
    expect(form.controls.templateForm.value).toBe(Template.MINIMAL);
    expect(resetValues).toEqual([true]);
    expect(richTextValues).toEqual(['<p>Summary</p>']);
    expect(cdRefSpy.detectChanges).toHaveBeenCalled();
  });
});
