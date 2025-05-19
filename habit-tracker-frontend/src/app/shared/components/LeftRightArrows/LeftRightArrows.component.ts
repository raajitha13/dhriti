// left-right-arrows.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-left-right-arrows',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './LeftRightArrows.component.html',
  styleUrls: ['./LeftRightArrows.component.scss'],
})
export class LeftRightArrowsComponent {
  @Output() left = new EventEmitter<void>();
  @Output() right = new EventEmitter<void>();
}
