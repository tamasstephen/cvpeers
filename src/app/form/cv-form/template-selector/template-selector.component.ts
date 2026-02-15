import { Component, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Subject, Subscription } from 'rxjs';
import { Template } from '../../../enums/template.enum';
import { CvForm } from '../../../types/cv-form';

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './template-selector.component.html',
  styleUrl: './template-selector.component.scss',
})
export class TemplateSelectorComponent implements OnInit, OnDestroy {
  public parentForm = input<CvForm>();

  public reset$ = input.required<Subject<boolean>>();

  protected templates = Template;

  protected templateForm = new FormControl(Template.MINIMAL, {
    nonNullable: true,
    validators: [Validators.required],
  });

  #resetSubscription: Subscription | null = null;

  public ngOnInit(): void {
    this.parentForm()?.addControl('templateForm', this.templateForm);
    this.#resetSubscription = this.reset$().subscribe((value: boolean): void => {
      if (value) {
        this.templateForm.setValue(Template.MINIMAL);
      }
    });
  }

  public ngOnDestroy(): void {
    this.#resetSubscription?.unsubscribe();
    this.#resetSubscription = null;
  }
}
