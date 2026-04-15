import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { KanbanCardData } from './kanban-card.types';
import { AvatarComponent } from '../avatar/avatar.component';
import { BadgeComponent } from '../badge/badge.component';
import { BadgeVariant } from '../badge/badge.types';

@Component({
  selector: 'ft-kanban-card',
  standalone: true,
  imports: [AvatarComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.css'],
})
export class KanbanCardComponent {
  readonly card     = input.required<KanbanCardData>();
  readonly selected = input(false);
  readonly cardClick = output<KanbanCardData>();

  readonly statusBadgeVariant = computed<BadgeVariant>(() => {
    const map: Record<string, BadgeVariant> = {
      prospect: 'neutral',
      contacted: 'info',
      qualified: 'primary',
      proposal: 'warning',
      won: 'success',
      lost: 'danger',
    };
    return map[this.card().status] ?? 'neutral';
  });

  readonly statusLabel = computed(() => {
    const map: Record<string, string> = {
      prospect: 'Prospect',
      contacted: 'Contacté',
      qualified: 'Qualifié',
      proposal: 'Proposition',
      won: 'Gagné',
      lost: 'Perdu',
    };
    return map[this.card().status] ?? this.card().status;
  });

  readonly relativeDate = computed(() => {
    const d = this.card().lastContact;
    if (!d) return null;
    const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return 'Hier';
    if (diff < 7) return `Il y a ${diff}j`;
    if (diff < 30) return `Il y a ${Math.floor(diff / 7)}sem`;
    return `Il y a ${Math.floor(diff / 30)}mois`;
  });
}
