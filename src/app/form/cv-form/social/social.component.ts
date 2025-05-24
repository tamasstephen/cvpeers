import {
  Component,
  inject,
  input,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
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
import { hasChangedFromInitial } from '../../validators/initial-value.validator';

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
export class SocialComponent implements OnInit, OnChanges {
  parentForm = input<FormGroup>();
  initialValues = input<any>(null);
  socialOptions = inject(SOCIAL_OPTIONS_TOKEN);
  isDialogOpen = signal(false);

  socialForm = new FormGroup({
    social: new FormArray<FormControl<SocialItem>>([]),
  });

  ngOnInit(): void {
    this.parentForm()?.addControl('socialForm', this.socialForm);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValues'] && changes['initialValues'].currentValue) {
      this.applyInitialValues(changes['initialValues'].currentValue);
    }
  }

  private applyInitialValues(initialData: any) {
    if (initialData.social) {
      const socialArray = this.socialForm.get('social') as FormArray;
      // Clear existing controls
      while (socialArray.length) {
        socialArray.removeAt(0);
      }
      // Add new controls with initial values
      initialData.social.forEach((item: SocialItem) => {
        const control = new FormControl<SocialItem>(item, {
          nonNullable: true,
        });
        control.addValidators(hasChangedFromInitial(item));
        control.updateValueAndValidity();
        socialArray.push(control);
      });
    }
  }

  addSocial(url: string, type: Social, src: string) {
    if (!url || !type || !src) {
      return;
    }
    console.log('addSocial', url, type, src);
    this.socialForm.controls.social.push(
      new FormControl<SocialItem>(
        {
          url,
          type,
          src,
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

  getSocialOptionSrc(type: Social): string {
    return (
      this.socialOptions.find((option) => option.value === type)?.src ?? ''
    );
  }

  removeSocial(index: number) {
    this.socialForm.controls.social.removeAt(index);
  }
}
