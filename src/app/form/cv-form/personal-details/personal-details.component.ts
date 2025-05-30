import {
  Component,
  input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IftaLabelModule } from 'primeng/iftalabel';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { hasChangedFromInitial } from '../../validators/initial-value.validator';

@Component({
  selector: 'app-personal-details',
  imports: [IftaLabelModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.scss',
})
export class PersonalDetailsComponent implements OnInit {
  parentForm = input<FormGroup>();
  initialValues = input<any>(null);

  personalDetailsForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    website: new FormControl(''),
    headline: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.parentForm()?.addControl(
      'personalDetailsForm',
      this.personalDetailsForm
    );
  }
}
