import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example-sidepanel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="example-content">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [
    `
      .example-content {
        padding: 20px;
      }
    `,
  ],
})
export class ExampleSidepanelComponent {
  @Input() title: string = '';
  @Input() message: string = '';
}
