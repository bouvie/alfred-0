import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { NavItem } from './side-nav.types';

@Component({
  selector: 'ft-side-nav',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  readonly items       = input.required<NavItem[]>();
  readonly activeRoute = input('');
  readonly collapsed   = input(false);
  readonly navClick    = output<NavItem>();
}
