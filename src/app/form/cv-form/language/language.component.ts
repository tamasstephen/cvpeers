import { Component, input, OnInit } from '@angular/core';
import { IftaLabelModule } from 'primeng/iftalabel';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';

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
  parentForm = input<FormGroup>();
  isDialogOpen = false;

  languageForm = new FormGroup({
    languages: new FormArray<FormGroup>([]),
  });

  languageItemForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    level: new FormControl('', [Validators.required]),
  });

  proficiencyLevels = [
    { label: 'Basic', value: 'Basic' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
    { label: 'Native', value: 'Native' },
  ];

  get languageControls() {
    return (this.languageForm.get('languages') as FormArray).controls;
  }

  ngOnInit(): void {
    this.parentForm()?.addControl(
      'languagesForm',
      this.languageForm.get('languages')
    );
  }

  openDialog() {
    this.isDialogOpen = true;
    this.languageItemForm.reset();
  }

  closeDialog() {
    this.isDialogOpen = false;
  }

  addLanguage() {
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

  removeLanguage(index: number) {
    const languageArray = this.languageForm.get('languages') as FormArray;
    languageArray.removeAt(index);
  }
}
