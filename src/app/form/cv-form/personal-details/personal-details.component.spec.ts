import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalDetailsComponent } from './personal-details.component';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

describe('PersonalDetailsComponent', (): void => {
  let component: PersonalDetailsComponent;
  let fixture: ComponentFixture<PersonalDetailsComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [PersonalDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('parentForm', new FormGroup({}));
    fixture.componentRef.setInput('reset$', new Subject<boolean>());
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
