import { FormArray } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExperienceDialogComponent } from './experience-dialog.component';

describe('ExperienceDialogComponent', (): void => {
  let component: ExperienceDialogComponent;
  let fixture: ComponentFixture<ExperienceDialogComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [ExperienceDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Senior Engineer',
            company: 'CV Peers',
            location: 'Remote',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2025-01-01'),
            description: ['First item', 'Second item', 'Third item'],
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: (): void => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render all existing description items when editing', (): void => {
    const descriptionControl = component.experienceItemForm.get('description');
    if (!(descriptionControl instanceof FormArray)) {
      fail('description control is not a FormArray');
      return;
    }

    const values = descriptionControl.getRawValue();
    expect(values).toEqual(['First item', 'Second item', 'Third item']);
  });

  it('prefills form when edit data exists even with empty title', async (): Promise<void> => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ExperienceDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: '',
            company: 'CV Peers',
            location: 'Remote',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2025-01-01'),
            description: ['Description from persisted payload'],
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: (): void => {},
          },
        },
      ],
    }).compileComponents();

    const localFixture = TestBed.createComponent(ExperienceDialogComponent);
    const localComponent = localFixture.componentInstance;
    localFixture.detectChanges();

    expect(localComponent.experienceItemForm.getRawValue().company).toBe('CV Peers');
    const descriptionControl = localComponent.experienceItemForm.get('description');
    if (!(descriptionControl instanceof FormArray)) {
      fail('description control is not a FormArray');
      return;
    }
    expect(descriptionControl.getRawValue()).toEqual(['Description from persisted payload']);
  });
});
