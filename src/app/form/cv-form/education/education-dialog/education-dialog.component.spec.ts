import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EducationDialogComponent } from './education-dialog.component';

describe('EducationDialogComponent', (): void => {
  let component: EducationDialogComponent;
  let fixture: ComponentFixture<EducationDialogComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [EducationDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            degree: '',
            institution: 'Example University',
            location: 'Budapest',
            graduationDate: new Date('2020-01-01'),
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

    fixture = TestBed.createComponent(EducationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('prefills form when edit data exists even with empty degree', (): void => {
    expect(component['educationItemForm'].getRawValue()).toEqual({
      degree: '',
      institution: 'Example University',
      location: 'Budapest',
      graduationDate: new Date('2020-01-01'),
    });
  });
});
