import { CommonModule } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CvForm } from '../../../types/cv-form';
import { LanguageForm, LanguageFormArray, LanguageItemForm } from '../../../types/language-form';

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [
    CommonModule,
    IftaLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    SelectButtonModule,
  ],
  templateUrl: './language.component.html',
  styleUrl: './language.component.scss',
})
export class LanguageComponent implements OnInit {
  public parentForm = input<CvForm>();

  protected isDialogOpen = signal(false);

  protected languageForm: LanguageForm = new FormGroup({
    languages: new FormArray<LanguageItemForm>([]),
  });

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

  protected get languageControls(): LanguageItemForm[] {
    return (this.languageForm.get('languages') as FormArray<LanguageItemForm>).controls;
  }

  public ngOnInit(): void {
    this.parentForm()?.addControl(
      'languagesForm',
      this.languageForm.get('languages') as LanguageFormArray
    );
  }

  protected openDialog(): void {
    this.isDialogOpen.set(true);
    this.languageItemForm.reset();
  }

  protected closeDialog(): void {
    this.isDialogOpen.set(false);
  }

  protected addLanguage(): void {
    if (this.languageItemForm.valid) {
      const languageArray = this.languageForm.get('languages') as FormArray;
      const newLanguage = new FormGroup({
        name: new FormControl(this.languageItemForm.get('name')?.value),
        level: new FormControl(this.languageItemForm.get('level')?.value),
      });
      languageArray.push(newLanguage);
      this.closeDialog();
    }
  }

  protected removeLanguage(index: number): void {
    const languageArray = this.languageForm.get('languages') as FormArray;
    languageArray.removeAt(index);
  }
}
