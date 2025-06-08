import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TagListComponent } from '../../../shared/components/tag-list/tag-list.component';

@Component({
  selector: 'app-expertise',
  standalone: true,
  imports: [TagListComponent],
  templateUrl: './expertise.component.html',
  styleUrl: './expertise.component.scss',
})
export class ExpertiseComponent {
  public parentForm = input<FormGroup>();
}
