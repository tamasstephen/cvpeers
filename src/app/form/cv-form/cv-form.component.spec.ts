import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvFormComponent } from './cv-form.component';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
@Component({
  selector: 'app-rich-text',
  template: '',
})
class RichTextStubComponent {}

@Component({
  selector: 'app-personal-details',
  template: '',
})
class PersonalDetailsStubComponent {}

@Component({
  selector: 'app-social',
  template: '',
})
class SocialStubComponent {}

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
      imports: [
        CvFormComponent,
        PersonalDetailsStubComponent,
        SocialStubComponent,
        RichTextStubComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CvFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form', () => {
    expect(component.form).toBeDefined();
  });

  it('should have a submit button', () => {
    const submitButton = fixture.debugElement.query(By.css('button'));
    expect(submitButton).toBeTruthy();
  });

  it('should submit the form', async () => {
    const spy = spyOn(component, 'onSubmit');
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalled();
  });
});
