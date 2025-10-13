import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  Social,
  SOCIAL_OPTIONS_PROVIDER,
  SOCIAL_OPTIONS_TOKEN,
  SocialItem,
} from '../../../../types/social';

@Component({
  selector: 'app-social-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  providers: [SOCIAL_OPTIONS_PROVIDER],
  templateUrl: './social-dialog.component.html',
  styleUrl: './social-dialog.component.scss',
})
export class SocialDialogComponent implements OnInit {
  protected socialOptions = inject(SOCIAL_OPTIONS_TOKEN);

  protected dialogForm = new FormGroup({
    url: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    type: new FormControl<Social | null>(null, {
      validators: [Validators.required],
    }),
  });

  #dialogRef = inject(MatDialogRef<SocialDialogComponent>);

  #data = inject<SocialItem>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    if (this.#data.src) {
      this.dialogForm.patchValue(this.#data);
    }
  }

  protected addSocialFromDialog(): void {
    this.#dialogRef.close(this.dialogForm.getRawValue());
  }

  protected closeDialog(): void {
    this.#dialogRef.close();
  }
}
