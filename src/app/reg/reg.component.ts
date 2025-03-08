import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-reg',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    IftaLabelModule,
  ],
  templateUrl: './reg.component.html',
  styleUrl: './reg.component.scss',
})
export class RegComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
  });

  register() {
    console.log(this.form.value);
  }
}
