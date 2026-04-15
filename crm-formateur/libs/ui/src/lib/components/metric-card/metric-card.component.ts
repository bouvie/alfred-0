import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export type MetricTrend = 'up' | 'down' | 'neutral';

@Component({
  selector: 'ft-metric-card',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.css'],
})
export class MetricCardComponent {
  readonly label    = input.required<string>();
  readonly value    = input.required<string | number>();
  readonly unit     = input('');
  readonly trend    = input<MetricTrend>('neutral');
  readonly delta    = input('');
  readonly subtitle = input('');
}
