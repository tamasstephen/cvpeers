import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CvComponent } from '../../cv/cv.component';
import { Template } from '../../enums/template.enum';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator.service';
import { StructuredDataService } from '../../services/seo/structured-data.service';
import { SidepanelProviderService } from '../../services/sidepanel-provider/sidepanel-provider.service';
import { CvFormComponent } from './cv-form.component';
import { CvFormStateFacade } from './cv-form-state.facade';

describe('CvFormComponent', (): void => {
  let component: CvFormComponent;
  let fixture: ComponentFixture<CvFormComponent>;
  let pdfServiceSpy: jasmine.SpyObj<PdfGeneratorService>;
  let sidepanelProviderSpy: jasmine.SpyObj<SidepanelProviderService>;
  let structuredDataServiceSpy: jasmine.SpyObj<StructuredDataService>;

  const mockActivatedRoute = {
    snapshot: {
      data: {
        cvData: { cv: 'test' },
      },
    },
  };

  const findButtonByText = (text: string): HTMLButtonElement | null => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find((button): boolean => button.textContent?.trim() === text) ?? null;
  };

  const createComponent = (width = 1440): void => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: width,
    });
    fixture = TestBed.createComponent(CvFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async (): Promise<void> => {
    localStorage.clear();

    pdfServiceSpy = jasmine.createSpyObj<PdfGeneratorService>('PdfGeneratorService', [
      'createPdfFromHtml',
    ]);
    pdfServiceSpy.createPdfFromHtml.and.resolveTo();

    sidepanelProviderSpy = jasmine.createSpyObj<SidepanelProviderService>('SidepanelProviderService', [
      'openSidepanel',
      'open',
      'displaySidepanel',
      'hideSidepanel',
      'setSidepanelConfig',
      'closeSidepanel',
      'clearSidepanel',
      'setSidepanelComponent',
      'getCurrentConfig',
    ]);

    structuredDataServiceSpy = jasmine.createSpyObj<StructuredDataService>('StructuredDataService', [
      'setCvFormStructuredData',
      'removeStructuredData',
    ]);

    await TestBed.configureTestingModule({
      imports: [CvFormComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: PdfGeneratorService, useValue: pdfServiceSpy },
        { provide: SidepanelProviderService, useValue: sidepanelProviderSpy },
        { provide: StructuredDataService, useValue: structuredDataServiceSpy },
        provideNoopAnimations(),
      ],
    }).compileComponents();
  });

  it('should create', (): void => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should render the form element', (): void => {
    createComponent();
    const formElement = fixture.debugElement.query(By.css('form'));
    expect(formElement).toBeTruthy();
  });

  it('should render download and reset buttons', (): void => {
    createComponent();
    const actionButtons = fixture.debugElement.queryAll(By.css('button[type="button"]'));
    expect(actionButtons.length).toBeGreaterThanOrEqual(3);
  });

  it('should open sidepanel on desktop init', (): void => {
    createComponent(1440);
    expect(sidepanelProviderSpy.openSidepanel).toHaveBeenCalledWith(
      jasmine.objectContaining({ component: CvComponent })
    );
    expect(structuredDataServiceSpy.setCvFormStructuredData).toHaveBeenCalled();
  });

  it('should hide and clear sidepanel on mobile init', (): void => {
    createComponent(600);
    expect(sidepanelProviderSpy.openSidepanel).not.toHaveBeenCalled();
    expect(sidepanelProviderSpy.clearSidepanel).toHaveBeenCalled();
    expect(sidepanelProviderSpy.hideSidepanel).toHaveBeenCalled();
  });

  it('should submit the form', async (): Promise<void> => {
    createComponent();
    const submitSpy = spyOn(component, 'onSubmit');
    const formElement = fixture.debugElement.query(By.css('form'));
    formElement.triggerEventHandler('ngSubmit', new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(submitSpy).toHaveBeenCalled();
  });

  it('should prevent submit side effects for invalid form', (): void => {
    createComponent();
    const submitEvent = new Event('submit');
    const preventDefaultSpy = spyOn(submitEvent, 'preventDefault').and.callThrough();
    const stopPropagationSpy = spyOn(submitEvent, 'stopPropagation').and.callThrough();
    const consoleSpy = spyOn(console, 'log');

    component.onSubmit(submitEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should log form value for valid submit', (): void => {
    createComponent();
    component.useDummyDataForTests();
    const submitEvent = new Event('submit');
    const consoleSpy = spyOn(console, 'log');

    component.onSubmit(submitEvent);

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should trigger pdf generation when download button is clicked', (): void => {
    createComponent();
    const cvRaw = document.createElement('div');
    cvRaw.id = 'cv-raw';
    document.body.appendChild(cvRaw);

    const downloadButton = fixture.debugElement.query(By.css('button.btn-filled'));
    downloadButton.triggerEventHandler('click', null);

    expect(pdfServiceSpy.createPdfFromHtml).toHaveBeenCalledWith(cvRaw);
    document.body.removeChild(cvRaw);
  });

  it('should not render use dummy button in the ui', (): void => {
    createComponent();
    const useDummyButton = fixture.debugElement.query(By.css('button[data-testid="use-dummy-button"]'));
    expect(useDummyButton).toBeNull();
  });

  it('should populate a long dummy cv for tests via method call', (): void => {
    createComponent();
    component.useDummyDataForTests();
    fixture.detectChanges();

    const savedData = localStorage.getItem('cv_form_data');
    expect(savedData).toBeTruthy();
    if (savedData === null) {
      fail('no saved dummy data found');
      return;
    }

    const raw: unknown = JSON.parse(savedData);
    if (
      typeof raw !== 'object' ||
      raw === null ||
      !('experienceForm' in raw) ||
      !('expertiseForm' in raw) ||
      !('summary' in raw)
    ) {
      fail('dummy data payload shape invalid');
      return;
    }

    const experienceForm = raw.experienceForm;
    const expertiseForm = raw.expertiseForm;
    const summary = raw.summary;
    if (!Array.isArray(experienceForm) || !Array.isArray(expertiseForm) || typeof summary !== 'string') {
      fail('dummy data payload values invalid');
      return;
    }

    expect(experienceForm.length).toBeGreaterThanOrEqual(6);
    expect(expertiseForm.length).toBeGreaterThanOrEqual(10);
    expect(summary.length).toBeGreaterThan(800);
  });

  it('should load persisted form data from localStorage on init', fakeAsync((): void => {
    const storedData = {
      personalDetailsForm: {
        fullName: 'Stored User',
        email: 'stored.user@example.com',
        phone: '+1 111 111 1111',
        website: 'https://stored.example.com',
        headline: 'Stored Headline',
      },
      socialForm: { social: [] },
      experienceForm: [],
      educationForm: [],
      expertiseForm: [],
      strengthsForm: [],
      languagesForm: [],
      summary: '<p>Stored summary</p>',
    };
    localStorage.setItem('cv_form_data', JSON.stringify(storedData));

    createComponent();
    tick();
    fixture.detectChanges();

    const fullNameInput = document.querySelector('input[formcontrolname="fullName"]');
    expect(fullNameInput instanceof HTMLInputElement).toBeTrue();
    if (!(fullNameInput instanceof HTMLInputElement)) {
      fail('fullName input not found');
      return;
    }
    expect(fullNameInput.value).toBe('Stored User');
  }));

  it('should hydrate stored data before opening sidepanel on desktop', fakeAsync((): void => {
    const storedData = {
      personalDetailsForm: {
        fullName: 'Stored User',
        email: 'stored.user@example.com',
        phone: '+1 111 111 1111',
        website: 'https://stored.example.com',
        headline: 'Stored Headline',
      },
      socialForm: { social: [] },
      experienceForm: [],
      educationForm: [],
      expertiseForm: [],
      strengthsForm: [],
      languagesForm: [],
      summary: '<p>Stored summary</p>',
    };
    localStorage.setItem('cv_form_data', JSON.stringify(storedData));

    const stateFacade = TestBed.inject(CvFormStateFacade);
    const originalApplyStoredData = stateFacade.applyStoredData.bind(stateFacade);
    const callOrder: string[] = [];
    const applyStoredDataSpy = spyOn(stateFacade, 'applyStoredData').and.callFake((command): void => {
      callOrder.push('hydrate');
      originalApplyStoredData(command);
    });
    sidepanelProviderSpy.openSidepanel.and.callFake((): void => {
      callOrder.push('open');
    });

    createComponent(1440);

    expect(sidepanelProviderSpy.openSidepanel).not.toHaveBeenCalled();

    tick();
    fixture.detectChanges();

    expect(applyStoredDataSpy).toHaveBeenCalled();
    expect(sidepanelProviderSpy.openSidepanel).toHaveBeenCalled();
    expect(callOrder[0]).toBe('hydrate');
    expect(callOrder[1]).toBe('open');
  }));

  it('should replace persisted data with reset state after reset confirmation', fakeAsync((): void => {
    createComponent();
    component.useDummyDataForTests();
    fixture.detectChanges();
    expect(localStorage.getItem('cv_form_data')).not.toBeNull();

    const resetButton = findButtonByText('Reset form');
    expect(resetButton).not.toBeNull();
    if (resetButton === null) {
      fail('reset button not found');
      return;
    }

    resetButton.click();
    fixture.detectChanges();
    tick();

    const confirmButton = findButtonByText('Yes');
    expect(confirmButton).not.toBeNull();
    if (confirmButton === null) {
      fail('confirmation button not found');
      return;
    }

    confirmButton.click();
    fixture.detectChanges();
    tick();

    const fullNameInput = document.querySelector('input[formcontrolname="fullName"]');
    expect(fullNameInput instanceof HTMLInputElement).toBeTrue();
    if (!(fullNameInput instanceof HTMLInputElement)) {
      fail('fullName input not found');
      return;
    }

    expect(fullNameInput.value).toBe('');
    const persistedData = localStorage.getItem('cv_form_data');
    expect(persistedData).not.toBeNull();
    if (persistedData === null) {
      fail('persisted reset data not found');
      return;
    }

    const raw: unknown = JSON.parse(persistedData);
    if (
      typeof raw !== 'object' ||
      raw === null ||
      !('templateForm' in raw) ||
      !('personalDetailsForm' in raw)
    ) {
      fail('persisted reset payload shape invalid');
      return;
    }

    const templateForm = raw.templateForm;
    const personalDetailsForm = raw.personalDetailsForm;
    if (templateForm !== Template.MINIMAL || typeof personalDetailsForm !== 'object' || personalDetailsForm === null) {
      fail('persisted reset payload values invalid');
      return;
    }

    if (!('fullName' in personalDetailsForm)) {
      fail('persisted personal details missing fullName');
      return;
    }

    expect(templateForm).toBe(Template.MINIMAL);
    expect(personalDetailsForm.fullName).toBeNull();
  }));

  it('should keep reset payload in storage and rehydrate safely after reload', fakeAsync((): void => {
    createComponent();
    component.useDummyDataForTests();
    fixture.detectChanges();

    const resetButton = findButtonByText('Reset form');
    expect(resetButton).not.toBeNull();
    if (resetButton === null) {
      fail('reset button not found');
      return;
    }
    resetButton.click();
    fixture.detectChanges();
    tick();

    const confirmButton = findButtonByText('Yes');
    expect(confirmButton).not.toBeNull();
    if (confirmButton === null) {
      fail('confirmation button not found');
      return;
    }
    confirmButton.click();
    fixture.detectChanges();
    tick();

    const persistedAfterReset = localStorage.getItem('cv_form_data');
    expect(persistedAfterReset).not.toBeNull();
    if (persistedAfterReset === null) {
      fail('expected persisted data after reset');
      return;
    }

    fixture.destroy();
    createComponent();
    tick();
    fixture.detectChanges();

    expect(localStorage.getItem('cv_form_data')).not.toBeNull();
    const fullNameInput = document.querySelector('input[formcontrolname="fullName"]');
    expect(fullNameInput instanceof HTMLInputElement).toBeTrue();
    if (!(fullNameInput instanceof HTMLInputElement)) {
      fail('fullName input not found');
      return;
    }
    expect(fullNameInput.value).toBe('');
  }));

  it('should preserve in-memory array edits over stale storage on mobile to desktop switch', fakeAsync((): void => {
    const staleStoredData = {
      personalDetailsForm: {
        fullName: 'Storage User',
        email: 'storage.user@example.com',
        phone: '+1 111 111 1111',
        website: 'https://storage.example.com',
        headline: 'Storage Headline',
      },
      socialForm: {
        social: [
          {
            type: 'github',
            url: 'https://github.com/storage',
            src: 'assets/images/github-fill.png',
          },
        ],
      },
      experienceForm: [],
      educationForm: [],
      expertiseForm: [],
      strengthsForm: [],
      languagesForm: [],
      summary: '<p>Storage summary</p>',
    };
    localStorage.setItem('cv_form_data', JSON.stringify(staleStoredData));

    createComponent(600);
    tick();
    fixture.detectChanges();

    const inMemorySocialArray = new FormArray([
      new FormControl(
        {
          type: 'linkedin',
          url: 'https://linkedin.com/in/in-memory-1',
          src: 'assets/images/linkedin-box-fill.png',
        },
        { nonNullable: true }
      ),
      new FormControl(
        {
          type: 'github',
          url: 'https://github.com/in-memory-2',
          src: 'assets/images/github-fill.png',
        },
        { nonNullable: true }
      ),
    ]);
    component['form'].addControl(
      'socialForm',
      new FormGroup({
        social: inMemorySocialArray,
      })
    );
    component['form'].addControl('personalDetailsForm', new FormGroup({}));
    component['form'].addControl('experienceForm', new FormArray([]));
    component['form'].addControl('educationForm', new FormArray([]));
    component['form'].addControl('expertiseForm', new FormArray([]));
    component['form'].addControl('strengthsForm', new FormArray([]));
    component['form'].addControl('languagesForm', new FormArray([]));
    component['form'].addControl('summary', new FormControl(''));

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1280,
    });
    window.dispatchEvent(new Event('resize'));
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const rehydratedSocials = component['form'].get('socialForm.social');
    if (!(rehydratedSocials instanceof FormArray)) {
      fail('rehydrated social form array missing');
      return;
    }
    const serializedSocials = JSON.stringify(rehydratedSocials.getRawValue());
    expect(serializedSocials).toContain('https://linkedin.com/in/in-memory-1');
    expect(serializedSocials).toContain('https://github.com/in-memory-2');
  }));
});
