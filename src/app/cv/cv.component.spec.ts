import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { Template } from '../enums/template.enum';
import { CvForm } from '../types/cv-form';
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
});
