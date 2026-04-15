import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MetricCardComponent } from '@org/ui';
import { ContactDataService } from '@org/data-access';
import { SessionDataService } from '@org/data-access';
import type { Contact } from '@org/shared';
import type { Session } from '@org/shared';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MetricCardComponent],
  providers: [ContactDataService, SessionDataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private readonly contactService = inject(ContactDataService);
  private readonly sessionService = inject(SessionDataService);

  private readonly contacts = toSignal(this.contactService.watchContacts(), { initialValue: [] as Contact[] });
  private readonly sessions = toSignal(this.sessionService.watchSessions(), { initialValue: [] as Session[] });

  readonly totalContacts = computed(() => this.contacts().length);

  readonly activeProspects = computed(() =>
    this.contacts().filter(c => c.status === 'PROSPECT' || c.status === 'CONTACTED' || c.status === 'QUALIFIED').length
  );

  readonly upcomingSessions = computed(() =>
    this.sessions().filter(s => s.status === 'PLANNED' || s.status === 'CONFIRMED').length
  );

  readonly wonCount = computed(() => this.contacts().filter(c => c.status === 'WON').length);

  readonly conversionRate = computed(() => {
    const total = this.contacts().length;
    if (!total) return 0;
    return Math.round((this.wonCount() / total) * 100);
  });
}
