import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { SocialComponent } from './social/social.component';
import { TextareaModule } from 'primeng/textarea';
import { RichTextComponent } from '../rich-text/rich-text.component';

@Component({
  selector: 'app-cv-form',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    IftaLabelModule,
    PersonalDetailsComponent,
    SocialComponent,
    TextareaModule,
    RichTextComponent,
  ],
  templateUrl: './cv-form.component.html',
  styleUrl: './cv-form.component.scss',
})
export class CvFormComponent {
  image: File | null = null;
  form = new FormGroup({});

  onSubmit() {
    console.log(this.form);
  }
}
