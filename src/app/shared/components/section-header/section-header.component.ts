import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
})
export class SectionHeaderComponent {
  @Input() public title = '';

  @Input() public addLabel = 'Add';

  @Output() public add = new EventEmitter<void>();

  protected onAddClick(): void {
    this.add.emit();
  }
}
