import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'ft-top-bar',
  standalone: true,
  imports: [AvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent {
  readonly userName    = input.required<string>();
  readonly pageTitle   = input('');
  readonly menuToggled = output<void>();
}
