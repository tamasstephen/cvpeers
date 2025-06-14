import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { TagListComponent } from '../../../shared/components/tag-list/tag-list.component';

@Component({
  selector: 'app-strengths',
  standalone: true,
  imports: [TagListComponent],
  templateUrl: './strengths.component.html',
  styleUrl: './strengths.component.scss',
})
export class StrengthsComponent {
  public parentForm = input<FormGroup>();

  public reset$ = input.required<Subject<boolean>>();
}
