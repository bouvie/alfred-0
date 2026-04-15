import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { ButtonVariant, ButtonSize, BUTTON_VARIANTS, BUTTON_SIZES } from './button.types';

@Component({
  selector: 'ft-button',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  readonly variant   = input<ButtonVariant>('primary');
  readonly size      = input<ButtonSize>('md');
  readonly disabled  = input(false);
  readonly fullWidth = input(false);
  readonly isLoading = input(false);
  readonly type      = input<'button' | 'submit' | 'reset'>('button');

  readonly clicked = output<void>();

  readonly safeVariant = computed<ButtonVariant>(() => {
    const v = this.variant();
    if (!BUTTON_VARIANTS.includes(v)) return 'primary';
    return v;
  });

  readonly safeSize = computed<ButtonSize>(() => {
    const s = this.size();
    if (!BUTTON_SIZES.includes(s)) return 'md';
    return s;
  });

  onClick(): void {
    if (!this.disabled() && !this.isLoading()) this.clicked.emit();
  }
}
