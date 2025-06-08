import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
}
