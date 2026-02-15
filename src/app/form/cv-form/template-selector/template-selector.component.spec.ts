import { FormControl, FormGroup } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Template } from '../../../enums/template.enum';
import { TemplateSelectorComponent } from './template-selector.component';

describe('TemplateSelectorComponent', (): void => {
  let fixture: ComponentFixture<TemplateSelectorComponent>;
  let parentForm: FormGroup;
  let reset$: Subject<boolean>;

  beforeEach(async (): Promise<void> => {
    parentForm = new FormGroup({});
    reset$ = new Subject<boolean>();

    await TestBed.configureTestingModule({
      imports: [TemplateSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateSelectorComponent);
    fixture.componentRef.setInput('parentForm', parentForm);
    fixture.componentRef.setInput('reset$', reset$);
    fixture.detectChanges();
  });

  it('should register templateForm with minimal by default', (): void => {
    const templateControl = parentForm.get('templateForm');
    if (!(templateControl instanceof FormControl)) {
      fail('templateForm control was not initialized');
      return;
    }

    expect(templateControl.value).toBe(Template.MINIMAL);
  });

  it('should keep minimal selected after reset signal', (): void => {
    const templateControl = parentForm.get('templateForm');
    if (!(templateControl instanceof FormControl)) {
      fail('templateForm control was not initialized');
      return;
    }

    templateControl.setValue(Template.CLASSIC);
    reset$.next(true);

    expect(templateControl.value).toBe(Template.MINIMAL);
  });
});
