import { Component, ElementRef, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CvForm } from '../../../types/cv-form';
import {
  Social,
  SOCIAL_OPTIONS_PROVIDER,
  SOCIAL_OPTIONS_TOKEN,
  SocialForm,
  SocialItem,
} from '../../../types/social';

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
   * The url input element
   */
  @ViewChild('url') protected urlInput!: ElementRef<HTMLInputElement>;

  /**
   * The parent form
   */
  public parentForm = input<CvForm>();

  /**
   * The injected social options
   */
  protected socialOptions = inject(SOCIAL_OPTIONS_TOKEN);

  /**
   * The dialog open state
   */
  protected isDialogOpen = signal(false);

  /**
   * The social form array
   */
  protected socialForm: SocialForm = new FormGroup({
    social: new FormArray<FormControl<SocialItem>>([]),
  });

  public ngOnInit(): void {
    this.parentForm()?.addControl('socialForm', this.socialForm);
  }

  /**
   * Add a social link
   * @param url The URL of the social link
   * @param type The type of the social link
   * @param src The source of the social link
   */
  protected addSocial(url: string, type: Social, src: string): void {
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
    this.urlInput.nativeElement.value = '';
    this.closeDialog();
  }

  /**
   * Open the dialog to add a social item
   */
  protected openDialog(): void {
    this.isDialogOpen.set(true);
  }

  /**
   * Close the dialog
   */
  protected closeDialog(): void {
    this.isDialogOpen.set(false);
  }

  /**
   * @param current type of the selected social item.
   * @returns the url string of the social image
   */
  protected getSocialOptionSrc(type: Social): string {
    return this.socialOptions.find((option): boolean => option.value === type)?.src ?? '';
  }

  /**
   * Remove a social link
   * @param index The index of the social link to remove
   */
  protected removeSocial(index: number): void {
    this.socialForm.controls.social.removeAt(index);
  }
}
