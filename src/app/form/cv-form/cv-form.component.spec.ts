import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { CvFormComponent } from './cv-form.component';

describe('CvFormComponent', (): void => {
  let component: CvFormComponent;
  let fixture: ComponentFixture<CvFormComponent>;

  beforeEach(async (): Promise<void> => {
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
    expect(actionButtons.length).toBe(2);
  });

  it('should submit the form', async (): Promise<void> => {
    const submitSpy = spyOn(component, 'onSubmit');
    const formElement = fixture.debugElement.query(By.css('form'));
    formElement.triggerEventHandler('ngSubmit', new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(submitSpy).toHaveBeenCalled();
  });
});
