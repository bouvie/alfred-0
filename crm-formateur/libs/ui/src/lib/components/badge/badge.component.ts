import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { BadgeVariant, BadgeSize, BADGE_VARIANTS } from './badge.types';

@Component({
  selector: 'ft-badge',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css'],
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');
  readonly size    = input<BadgeSize>('md');
  readonly dot     = input(false);

  readonly safeVariant = computed<BadgeVariant>(() => {
    const v = this.variant();
    if (!BADGE_VARIANTS.includes(v)) return 'neutral';
    return v;
  });
}
