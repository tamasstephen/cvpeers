import { FormGroup } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { ExperienceItemFormValues } from '../../../types/experience-form';
import { ExperienceComponent } from './experience.component';

function createExperience(
  overrides: Partial<ExperienceItemFormValues> = {}
): ExperienceItemFormValues {
  return {
    title: 'Software Engineer',
    company: 'CV Peers',
    location: 'Remote',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-01-01'),
    description: ['Built features'],
    ...overrides,
  };
}

describe('ExperienceComponent', (): void => {
  let component: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;
  let parentForm: FormGroup;

  beforeEach(async (): Promise<void> => {
    parentForm = new FormGroup({});

    await TestBed.configureTestingModule({
      imports: [ExperienceComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('parentForm', parentForm);
    fixture.componentRef.setInput('reset$', new Subject<boolean>());
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should keep all description items when experience is updated', (): void => {
    component.saveExperience(
      createExperience({
        description: ['First item'],
      })
    );
    component.updateExperience(
      createExperience({
        description: ['First item', 'Second item', 'Third item'],
      }),
      0
    );

    expect(component.experienceControls.length).toBe(1);
    expect(component.experienceControls[0].controls.description.getRawValue()).toEqual([
      'First item',
      'Second item',
      'Third item',
    ]);
  });
});
