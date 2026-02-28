import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subject } from 'rxjs';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { ComponentBaseComponent } from '../../../shared/core/component-base/component-base.component';
import { CvForm } from '../../../types/cv-form';
import { LanguageForm, LanguageFormArray, LanguageItemForm } from '../../../types/language-form';
import { clearFormArray } from '../form-array.utils';

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    SectionHeaderComponent,
  ],
  templateUrl: './language.component.html',
  styleUrl: './language.component.scss',
})
export class LanguageComponent extends ComponentBaseComponent implements OnInit, OnDestroy {
  @ViewChild('languageDialog') protected languageDialogTemplate!: TemplateRef<unknown>;

  public parentForm = input<CvForm>();

  public reset$ = input.required<Subject<boolean>>();

  protected dialog = inject(MatDialog);

  protected languageForm: LanguageForm = new FormGroup({
    languages: new FormArray<LanguageItemForm>([]),
  });

  protected isEditing = signal<boolean>(false);

  protected languageItemForm: LanguageItemForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    level: new FormControl('', [Validators.required]),
  });

  protected proficiencyLevels = [
    { label: 'Basic', value: 'Basic' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
    { label: 'Native', value: 'Native' },
  ];

  protected dialogForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    level: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
  });

  protected get languageControls(): LanguageItemForm[] {
    return (this.languageForm.get('languages') as FormArray<LanguageItemForm>).controls;
  }

  #dialogRef: MatDialogRef<unknown> | null = null;

  public ngOnInit(): void {
    this.parentForm()?.addControl(
      'languagesForm',
      this.languageForm.get('languages') as LanguageFormArray
    );

    this.addSubscription(
      this.reset$().subscribe((value: boolean): void => {
        if (value) {
          clearFormArray(this.languageForm.controls.languages);
        }
      })
    );
  }

  public override ngOnDestroy(): void {
    this.dialogForm.reset({ name: '', level: null });
  }

  protected openDialog(): void {
    this.dialogForm.reset({ name: '', level: null });
    this.#dialogRef = this.dialog.open(this.languageDialogTemplate, {
      width: '420px',
      disableClose: true,
    });
    this.#dialogRef.afterClosed().subscribe((): void => {
      this.isEditing.set(false);
    });
  }

  protected closeDialog(): void {
    this.#dialogRef?.close();
    this.#dialogRef = null;
    this.isEditing.set(false);
  }

  protected addLanguage(): void {
    if (this.dialogForm.invalid) {
      this.dialogForm.markAllAsTouched();
      return;
    }

    const { name, level } = this.dialogForm.getRawValue();
    const languageArray = this.languageForm.get('languages') as FormArray;
    if (this.isEditing()) {
      this.closeDialog();
      return;
    } else {
      languageArray.push(
        new FormGroup({
          name: new FormControl(name, { nonNullable: true }),
          level: new FormControl(level, { nonNullable: true }),
        })
      );

      this.closeDialog();
    }
  }

  protected editLanguage(index: number): void {
    this.isEditing.set(true);

    const { name, level } = this.languageControls[index].value;
    this.dialogForm.patchValue({ name: name ?? '', level: level ?? '' });
    this.#dialogRef = this.dialog.open(this.languageDialogTemplate, {
      width: '420px',
      disableClose: true,
    });

    this.#dialogRef.afterClosed().subscribe((): void => {
      this.#dialogRef = null;
      const dialogFormResults = this.dialogForm.getRawValue();
      const isDiff = dialogFormResults.name !== name || dialogFormResults.level !== level;
      if (isDiff) {
        this.languageForm.controls.languages.at(index).patchValue(dialogFormResults);
      }
      this.isEditing.set(false);
    });
  }

  protected removeLanguage(index: number): void {
    const languageArray = this.languageForm.get('languages') as FormArray;
    languageArray.removeAt(index);
  }
}
