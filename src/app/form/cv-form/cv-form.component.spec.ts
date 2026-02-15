import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator.service';
import { CvFormComponent } from './cv-form.component';

describe('CvFormComponent', (): void => {
  let component: CvFormComponent;
  let fixture: ComponentFixture<CvFormComponent>;

  beforeEach(async (): Promise<void> => {
    localStorage.clear();

    const mockActivatedRoute = {
      snapshot: {
        data: {
          cvData: { cv: 'test' },
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [CvFormComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }, provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CvFormComponent);
    component = fixture.componentInstance;
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1440,
    });
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should render the form element', (): void => {
    const formElement = fixture.debugElement.query(By.css('form'));
    expect(formElement).toBeTruthy();
  });

  it('should render download and reset buttons', (): void => {
    const actionButtons = fixture.debugElement.queryAll(By.css('button[type="button"]'));
    expect(actionButtons.length).toBeGreaterThanOrEqual(3);
  });

  it('should submit the form', async (): Promise<void> => {
    const submitSpy = spyOn(component, 'onSubmit');
    const formElement = fixture.debugElement.query(By.css('form'));
    formElement.triggerEventHandler('ngSubmit', new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(submitSpy).toHaveBeenCalled();
  });

  it('should trigger pdf generation when download button is clicked', (): void => {
    const pdfService = TestBed.inject(PdfGeneratorService);
    const createPdfSpy = spyOn(pdfService, 'createPdfFromHtml').and.resolveTo();
    const cvRaw = document.createElement('div');
    cvRaw.id = 'cv-raw';
    document.body.appendChild(cvRaw);

    const downloadButton = fixture.debugElement.query(By.css('button.btn-filled'));
    downloadButton.triggerEventHandler('click', null);

    expect(createPdfSpy).toHaveBeenCalledWith(cvRaw);
    document.body.removeChild(cvRaw);
  });

  it('should not render use dummy button in the ui', (): void => {
    const useDummyButton = fixture.debugElement.query(By.css('button[data-testid="use-dummy-button"]'));
    expect(useDummyButton).toBeNull();
  });

  it('should populate a long dummy cv for tests via method call', (): void => {
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
});
