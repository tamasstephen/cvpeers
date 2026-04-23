import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SocialDialogComponent } from './social-dialog.component';

describe('SocialDialogComponent', (): void => {
  let component: SocialDialogComponent;
  let fixture: ComponentFixture<SocialDialogComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [SocialDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            type: 'github',
            url: 'https://github.com/example',
            src: '',
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

    fixture = TestBed.createComponent(SocialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('prefills form when edit data exists even with empty src', (): void => {
    expect(component['dialogForm'].getRawValue()).toEqual({
      url: 'https://github.com/example',
      type: 'github',
    });
  });
});
