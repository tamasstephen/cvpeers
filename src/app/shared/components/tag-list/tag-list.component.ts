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
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    IftaLabelModule,
    ChipModule,
  ],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.scss',
})
export class TagListComponent implements OnInit {
  parentForm = input<FormGroup>();
  title = input<string>('Items');
  formControlName = input<string>('items');
  placeholder = input<string>('Type your item');
  addButtonLabel = input<string>('Add your item');

  newItem = '';

  itemForm = new FormGroup({
    items: new FormArray([]),
  });

  ngOnInit(): void {
    const controlName = this.formControlName();
    this.parentForm()?.addControl(
      controlName + 'Form',
      this.itemForm.get('items')
    );
  }

  addItem() {
    if (this.newItem.trim()) {
      const itemArray = this.itemForm.get('items') as FormArray;
      itemArray.push(
        new FormControl(this.newItem.trim(), { nonNullable: true })
      );
      this.newItem = '';
    }
  }

  removeItem(index: number) {
    const itemArray = this.itemForm.get('items') as FormArray;
    itemArray.removeAt(index);
  }

  get itemControls() {
    return (this.itemForm.get('items') as FormArray).controls;
  }
}
