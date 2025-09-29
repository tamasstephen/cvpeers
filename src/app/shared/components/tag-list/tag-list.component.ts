import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, input, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { CvForm } from '../../../types/cv-form';
import { TagListForm } from '../../../types/tag-list-form';
import { ComponentBaseComponent } from '../../core/component-base/component-base.component';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.scss',
})
export class TagListComponent extends ComponentBaseComponent implements OnInit, AfterViewInit {
  public parentForm = input<CvForm>();

  public title = input<string>('Items');

  public reset$ = input.required<Subject<boolean>>();

  public formControlName = input<string>('items');

  public placeholder = input<string>('Type your item');

  public addButtonLabel = input<string>('Add your item');

  public newItem = '';

  protected itemForm: TagListForm = new FormGroup({
    items: new FormArray<FormControl<string>>([]),
  });

  #cdr = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    const controlName = this.formControlName();
    this.parentForm()?.addControl(controlName + 'Form', this.itemForm.get('items') as FormArray);
  }

  public ngAfterViewInit(): void {
    this.addSubscription(
      this.reset$().subscribe((value: boolean): void => {
        if (value) {
          const itemsArray = this.itemForm.get('items') as FormArray;
          while (itemsArray.length) {
            itemsArray.removeAt(0);
          }
          this.#cdr.markForCheck();
        }
      })
    );
  }

  protected addItem(): void {
    if (this.newItem.trim()) {
      const itemArray = this.itemForm.get('items') as FormArray;
      itemArray.push(new FormControl(this.newItem.trim(), { nonNullable: true }));
      this.newItem = '';
    }
  }

  protected removeItem(index: number): void {
    const itemArray = this.itemForm.get('items') as FormArray;
    itemArray.removeAt(index);
  }

  public get itemControls(): FormControl<string>[] {
    return (this.itemForm.get('items') as FormArray).controls as FormControl<string>[];
  }
}
