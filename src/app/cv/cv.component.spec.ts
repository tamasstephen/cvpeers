import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Template } from '../enums/template.enum';
import { CvForm } from '../types/cv-form';
import { ExperienceItemForm, ExperienceItemFormValues } from '../types/experience-form';
import { CvComponent } from './cv.component';

describe('CvComponent', (): void => {
  let component: CvComponent;
  let fixture: ComponentFixture<CvComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [CvComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CvComponent);
    component = fixture.componentInstance;
    const formControls: CvForm['controls'] = {
      templateForm: new FormControl<Template>(Template.MINIMAL, { nonNullable: true }),
      personalDetailsForm: new FormGroup({
        fullName: new FormControl('John Doe'),
        email: new FormControl('john.doe@example.com'),
        phone: new FormControl('+1 (555) 123-4567'),
        website: new FormControl('https://johndoe.com'),
        headline: new FormControl('Senior Software Engineer'),
      }),
    };
    component.cvForm = new FormGroup(formControls);
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should not initialize preview viewport with zero height', (): void => {
    const previewViewport = fixture.debugElement.query(By.css('.cv-preview-viewport'));
    expect(previewViewport).toBeTruthy();
    expect(previewViewport.styles['height']).not.toBe('0px');
  });

  it('should bind preview viewport min-height to resolved slice height', (): void => {
    const previewViewport = fixture.debugElement.query(By.css('.cv-preview-viewport'));
    expect(previewViewport).toBeTruthy();
    expect(previewViewport.styles['min-height']).toBe(previewViewport.styles['height']);
    expect(previewViewport.styles['min-height']).not.toBe('100%');
  });

  it('should position preview slices using top offset without inline transform', (): void => {
    const previewSlice = fixture.debugElement.query(By.css('.cv-preview-slice'));
    expect(previewSlice).toBeTruthy();
    expect(previewSlice.styles['top']).toBe('0px');
    expect(previewSlice.styles['transform']).toBe('');
  });

  it('should render preview inside a horizontal scroll container', (): void => {
    const previewScroll = fixture.debugElement.query(By.css('.cv-preview-scroll'));
    expect(previewScroll).toBeTruthy();
    const preview = previewScroll.query(By.css('.cv-preview'));
    expect(preview).toBeTruthy();
  });

  it('should render left column experience without personal details and right-column controls', fakeAsync((): void => {
    const localFixture = TestBed.createComponent(CvComponent);
    const localComponent = localFixture.componentInstance;
    const formControls: CvForm['controls'] = {
      templateForm: new FormControl<Template>(Template.MINIMAL, { nonNullable: true }),
      experienceForm: new FormArray([
        new FormGroup({
          title: new FormControl('Engineer'),
          company: new FormControl('CV Peers'),
          location: new FormControl('Remote'),
          startDate: new FormControl(new Date('2024-01-01')),
          endDate: new FormControl<Date | null>(null),
          description: new FormArray([new FormControl('Built the profile editor')]),
        }),
      ]),
    };
    localComponent.cvForm = new FormGroup(formControls);
    localFixture.detectChanges();

    tick(350);
    localFixture.detectChanges();

    const experienceItems = localFixture.debugElement.queryAll(By.css('.experience-item'));
    expect(experienceItems.length).toBe(1);
  }));

  it('should render experience when only left-column data changes', fakeAsync((): void => {
    const localFixture = TestBed.createComponent(CvComponent);
    const localComponent = localFixture.componentInstance;
    const experienceForm = new FormArray<FormGroup<ExperienceItemForm>>([]);
    const formControls: CvForm['controls'] = {
      templateForm: new FormControl<Template>(Template.MINIMAL, { nonNullable: true }),
      personalDetailsForm: new FormGroup({
        fullName: new FormControl(''),
        email: new FormControl(''),
        phone: new FormControl(''),
        website: new FormControl(''),
        headline: new FormControl(''),
      }),
      experienceForm,
    };
    localComponent.cvForm = new FormGroup(formControls);
    localFixture.detectChanges();
    tick(350);
    localFixture.detectChanges();

    experienceForm.push(
      new FormGroup<ExperienceItemForm>({
        title: new FormControl<ExperienceItemFormValues['title']>('Engineer'),
        company: new FormControl<ExperienceItemFormValues['company']>('CV Peers'),
        location: new FormControl<ExperienceItemFormValues['location']>('Remote'),
        startDate: new FormControl<ExperienceItemFormValues['startDate']>(new Date('2024-01-01')),
        endDate: new FormControl<ExperienceItemFormValues['endDate']>(null),
        description: new FormArray([
          new FormControl<ExperienceItemFormValues['description'][number]>('Implemented CV preview'),
        ]),
      })
    );
    tick(350);
    localFixture.detectChanges();

    const experienceItems = localFixture.debugElement.queryAll(By.css('.experience-item'));
    expect(experienceItems.length).toBe(1);
  }));
});
