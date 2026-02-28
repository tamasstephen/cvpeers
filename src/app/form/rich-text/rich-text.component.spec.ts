import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { RichTextComponent } from './rich-text.component';

describe('RichTextComponent', (): void => {
  let component: RichTextComponent;
  let fixture: ComponentFixture<RichTextComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [RichTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RichTextComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('parentForm', new FormGroup({}));
    fixture.componentRef.setInput('reset$', new Subject<boolean>());
    fixture.componentRef.setInput('initialValues', new Observable<string | null>());
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
