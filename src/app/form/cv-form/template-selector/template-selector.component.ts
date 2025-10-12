import { Component, input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Subject } from 'rxjs';
import { Template } from '../../../enums/template.enum';
import { CvForm } from '../../../types/cv-form';

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './template-selector.component.html',
  styleUrl: './template-selector.component.scss',
})
export class TemplateSelectorComponent implements OnInit {
  public parentForm = input<CvForm>();

  public reset$ = input.required<Subject<boolean>>();

  protected templates = Template;

  protected templateForm: FormControl<Template | null> = new FormControl<Template>(
    Template.MINIMAL,
    [Validators.required]
  );

  public ngOnInit(): void {
    this.parentForm()?.addControl('templateForm', this.templateForm);
  }
}
