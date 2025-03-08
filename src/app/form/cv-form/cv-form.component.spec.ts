import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvFormComponent } from './cv-form.component';
import { ActivatedRoute } from '@angular/router';

describe('CvFormComponent', () => {
  let component: CvFormComponent;
  let fixture: ComponentFixture<CvFormComponent>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: {
        data: {
          cvData: { cv: 'test' },
        },
      },
    };
    await TestBed.configureTestingModule({
      imports: [CvFormComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(CvFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
