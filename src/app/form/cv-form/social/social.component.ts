import { CommonModule } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subject } from 'rxjs';
import { ComponentBaseComponent } from '../../../shared/core/component-base/component-base.component';
import { CvForm } from '../../../types/cv-form';
import {
  Social,
  SOCIAL_OPTIONS_PROVIDER,
  SOCIAL_OPTIONS_TOKEN,
  SocialForm,
  SocialItem,
} from '../../../types/social';
import { SocialDialogComponent } from './social-dialog/social-dialog.component';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './social.component.html',
  styleUrl: './social.component.scss',
  providers: [SOCIAL_OPTIONS_PROVIDER],
})
export class SocialComponent extends ComponentBaseComponent implements OnInit, OnDestroy {
  @ViewChild('socialDialog') protected socialDialogTemplate!: TemplateRef<unknown>;

  public reset$ = input.required<Subject<boolean>>();

  /**
   * The parent form
   */
  public parentForm = input<CvForm>();

  /**
   * The injected social options
   */
  protected socialOptions = inject(SOCIAL_OPTIONS_TOKEN);

  /**
   * The social form array
   */
  protected socialForm: SocialForm = new FormGroup({
    social: new FormArray<FormControl<SocialItem>>([]),
  });

  #dialog = inject(MatDialog);

  public ngOnInit(): void {
    this.parentForm()?.addControl('socialForm', this.socialForm);

    this.addSubscription(
      this.reset$().subscribe((value: boolean): void => {
        if (value) {
          const socialArray = this.socialForm.get('social') as FormArray;
          while (socialArray.length) {
            socialArray.removeAt(0);
          }
        }
      })
    );
  }

  /**
   * Add a social link
   * @param url The URL of the social link
   * @param type The type of the social link
   * @param src The source of the social link
   */
  protected addSocialFromDialog(url: string, type: Social): void {
    this.socialForm.controls.social.push(
      new FormControl<SocialItem>(
        {
          url,
          type,
          src: this.getSocialOptionSrc(type),
        },
        { nonNullable: true }
      )
    );
  }

  /**
   * Open the dialog to add a social item
   */
  protected openDialog(): void {
    const dialogRef = this.#dialog.open(SocialDialogComponent);
    dialogRef.afterClosed().subscribe((result: { url: string; type: Social } | null): void => {
      if (result) {
        this.addSocialFromDialog(result.url, result.type);
      }
    });
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
