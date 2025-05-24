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
export class SocialComponent implements OnInit {
  /**
   * The parent form
   */
  parentForm = input<FormGroup>();

  //TODO: add proper typing
  /**
   * The initial values
   */
  initialValues = input<any>(null);

  /**
   * The injected social options
   */
  socialOptions = inject(SOCIAL_OPTIONS_TOKEN);

  /**
   * The dialog open state
   */
  isDialogOpen = signal(false);

  /**
   * The social form array
   */
  socialForm = new FormGroup({
    social: new FormArray<FormControl<SocialItem>>([]),
  });

  ngOnInit(): void {
    this.parentForm()?.addControl('socialForm', this.socialForm);
  }

  /**
   * Add a social link
   * @param url The URL of the social link
   * @param type The type of the social link
   * @param src The source of the social link
   */
  addSocial(url: string, type: Social, src: string) {
    if (!url || !type || !src) {
      return;
    }
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

  /**
   * Open the dialog to add a social item
   */
  openDialog() {
    this.isDialogOpen.set(true);
  }

  /**
   * Close the dialog
   */
  closeDialog() {
    console.log('closeDialog');
    this.isDialogOpen.set(false);
  }

  /**
   * @param current type of the selected social item.
   * @returns the url string of the social image
   */
  getSocialOptionSrc(type: Social): string {
    return (
      this.socialOptions.find((option) => option.value === type)?.src ?? ''
    );
  }

  /**
   * Remove a social link
   * @param index The index of the social link to remove
   */
  removeSocial(index: number) {
    this.socialForm.controls.social.removeAt(index);
  }
}
