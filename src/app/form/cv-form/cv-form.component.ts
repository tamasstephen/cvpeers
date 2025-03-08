import { Component, inject, OnInit, signal } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';

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
export class CvFormComponent implements OnInit {
  image: File | null = null;
  form = new FormGroup({});
  activatedRoute = inject(ActivatedRoute);
  cvData = signal<any>(null);

  ngOnInit(): void {
    this.cvData.set(this.activatedRoute.snapshot.data['cvData']);
    console.log('cvData', this.cvData()?.cv);
  }

  onSubmit() {
    console.log(this.form);
  }
}
