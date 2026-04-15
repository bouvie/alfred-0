import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'ft-avatar',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent {
  readonly name   = input.required<string>();
  readonly src    = input<string | null>(null);
  readonly size   = input<AvatarSize>('md');

  readonly initials = computed(() => {
    const parts = this.name().trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });
}
