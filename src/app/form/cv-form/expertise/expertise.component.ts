import { Component, input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-expertise',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    IftaLabelModule,
  ],
  templateUrl: './expertise.component.html',
  styleUrl: './expertise.component.scss',
})
export class ExpertiseComponent implements OnInit {
  parentForm = input<FormGroup>();
  newExpertise = '';

  expertiseForm = new FormGroup({
    expertise: new FormArray([]),
  });

  ngOnInit(): void {
    this.parentForm()?.addControl(
      'expertiseForm',
      this.expertiseForm.get('expertise')
    );
  }

  addExpertise() {
    if (this.newExpertise.trim()) {
      const expertiseArray = this.expertiseForm.get('expertise') as FormArray;
      expertiseArray.push(
        new FormControl(this.newExpertise.trim(), { nonNullable: true })
      );
      this.newExpertise = '';
    }
  }

  removeExpertise(index: number) {
    const expertiseArray = this.expertiseForm.get('expertise') as FormArray;
    expertiseArray.removeAt(index);
  }

  get expertiseControls() {
    return (this.expertiseForm.get('expertise') as FormArray).controls;
  }
}
