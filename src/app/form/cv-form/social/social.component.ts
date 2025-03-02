import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
import {
  Social,
  SOCIAL_OPTIONS_PROVIDER,
  SOCIAL_OPTIONS_TOKEN,
  SocialItem,
} from '../../../types/social';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-social',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    IftaLabelModule,
    SelectModule,
    DialogModule,
  ],
  templateUrl: './social.component.html',
  styleUrl: './social.component.scss',
  providers: [SOCIAL_OPTIONS_PROVIDER],
})
export class SocialComponent implements OnInit {
  parentForm = input<FormGroup>();
  socialOptions = inject(SOCIAL_OPTIONS_TOKEN);
  isDialogOpen = signal(false);

  socialForm = new FormGroup({
    social: new FormArray<FormControl<SocialItem>>([]),
  });

  ngOnInit(): void {
    this.parentForm()?.addControl('socialForm', this.socialForm);
  }

  addSocial(url: string, type: Social) {
    if (!url || !type) {
      return;
    }
    this.socialForm.controls.social.push(
      new FormControl<SocialItem>(
        {
          url,
          type,
        },
        { nonNullable: true }
      )
    );
    this.closeDialog();
  }

  openDialog() {
    this.isDialogOpen.set(true);
  }

  closeDialog() {
    console.log('closeDialog');
    this.isDialogOpen.set(false);
  }

  removeSocial(index: number) {
    this.socialForm.controls.social.removeAt(index);
  }
}
