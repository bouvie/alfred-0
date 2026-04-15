import { Component, ChangeDetectionStrategy, signal, inject, computed, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BadgeComponent, ButtonComponent, AvatarComponent } from '@org/ui';
import { SessionDataService, ContactDataService } from '@org/data-access';
import type { Session, SessionStatus, Contact } from '@org/shared';

const STATUS_LABELS: Record<string, string> = {
  PLANNED: 'Planifiée', CONFIRMED: 'Confirmée', DONE: 'Réalisée', CANCELLED: 'Annulée',
};

const STATUS_VARIANTS: Record<string, string> = {
  PLANNED: 'info', CONFIRMED: 'primary', DONE: 'success', CANCELLED: 'danger',
};

const STATUS_CHIP_CLASS: Record<string, string> = {
  PLANNED: 'chip--info', CONFIRMED: 'chip--primary', DONE: 'chip--success', CANCELLED: 'chip--danger',
};

interface CalendarDay {
  date: Date;
  key: string;
  currentMonth: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, AvatarComponent],
  providers: [SessionDataService, ContactDataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css'],
})
export class SessionsComponent {
  private readonly sessionService = inject(SessionDataService);
  private readonly contactService = inject(ContactDataService);

  readonly sessions = toSignal(this.sessionService.watchSessions(), { initialValue: [] as Session[] });
  readonly contacts: Signal<Contact[]> = toSignal(this.contactService.watchContacts(), { initialValue: [] as Contact[] });
  readonly currentMonth = signal(new Date());
  readonly selectedSession = signal<Session | null>(null);

  // Create form
  readonly adding = signal(false);
  readonly createTitle = signal('');
  readonly createContactId = signal('');
  readonly createDate = signal('');
  readonly createDuration = signal(60);
  readonly createSessionStatus = signal<SessionStatus>('PLANNED');
  readonly createNotes = signal('');

  // Drag & drop
  readonly draggingSession = signal<Session | null>(null);
  readonly dragOverDay = signal<string | null>(null);

  readonly statusLabels = STATUS_LABELS;
  readonly statusVariants = STATUS_VARIANTS;
  readonly statusChipClass = STATUS_CHIP_CLASS;
  readonly allStatuses = Object.keys(STATUS_LABELS) as SessionStatus[];
  readonly weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  readonly monthLabel = computed(() =>
    new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(this.currentMonth())
  );

  readonly calendarDays = computed<CalendarDay[]>(() => {
    const ref = this.currentMonth();
    const year = ref.getFullYear();
    const month = ref.getMonth();
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const toKey = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const days: CalendarDay[] = [];

    // Monday-based: (getDay() + 6) % 7 gives 0=Mon..6=Sun
    const startOffset = (firstDay.getDay() + 6) % 7;
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      const key = toKey(d);
      days.push({ date: d, key, currentMonth: false, isToday: key === todayKey });
    }

    for (let n = 1; n <= lastDay.getDate(); n++) {
      const d = new Date(year, month, n);
      const key = toKey(d);
      days.push({ date: d, key, currentMonth: true, isToday: key === todayKey });
    }

    const remaining = (7 - (days.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
      const d = new Date(year, month + 1, n);
      const key = toKey(d);
      days.push({ date: d, key, currentMonth: false, isToday: key === todayKey });
    }

    return days;
  });

  readonly sessionsByDay = computed(() => {
    const map = new Map<string, Session[]>();
    for (const s of this.sessions()) {
      const key = s.date.slice(0, 10);
      const list = map.get(key);
      if (list) list.push(s);
      else map.set(key, [s]);
    }
    return map;
  });

  getSessionsForDay(key: string): Session[] {
    return this.sessionsByDay().get(key) ?? [];
  }

  prevMonth(): void {
    this.currentMonth.update(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    this.currentMonth.update(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  goToToday(): void {
    this.currentMonth.set(new Date());
  }

  startCreate(): void {
    const now = new Date();
    this.createTitle.set('');
    this.createContactId.set('');
    this.createDate.set(now.toISOString().slice(0, 16));
    this.createDuration.set(60);
    this.createSessionStatus.set('PLANNED');
    this.createNotes.set('');
    this.adding.set(true);
  }

  saveCreate(): void {
    const title = this.createTitle().trim();
    const contactId = this.createContactId();
    if (!title || !contactId) return;
    this.sessionService.createSession({
      title,
      contactId,
      date: new Date(this.createDate()).toISOString(),
      duration: this.createDuration(),
      status: this.createSessionStatus(),
      notes: this.createNotes().trim() || undefined,
    }).subscribe(() => this.adding.set(false));
  }

  cancelCreate(): void { this.adding.set(false); }

  // Drag & drop calendar
  onSessionDragStart(event: DragEvent, session: Session): void {
    this.draggingSession.set(session);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', session.id);
    }
  }

  onSessionDragEnd(): void {
    this.draggingSession.set(null);
    this.dragOverDay.set(null);
  }

  onCalDragOver(event: DragEvent, dayKey: string): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    this.dragOverDay.set(dayKey);
  }

  onCalDragLeave(event: DragEvent, dayKey: string): void {
    const el = event.currentTarget as HTMLElement;
    if (!el.contains(event.relatedTarget as Node)) {
      if (this.dragOverDay() === dayKey) this.dragOverDay.set(null);
    }
  }

  onCalDrop(event: DragEvent, day: CalendarDay): void {
    event.preventDefault();
    const session = this.draggingSession();
    if (session) {
      const original = new Date(session.date);
      const [y, m, d] = day.key.split('-').map(Number);
      const newDate = new Date(y, m - 1, d, original.getHours(), original.getMinutes());
      this.sessionService.updateSession(session.id, { date: newDate.toISOString() }).subscribe();
    }
    this.onSessionDragEnd();
  }

  openSession(session: Session, event: Event): void {
    event.stopPropagation();
    this.selectedSession.set(session);
  }

  closePanel(): void {
    this.selectedSession.set(null);
  }

  updateSessionStatus(session: Session, status: SessionStatus): void {
    this.sessionService.updateSession(session.id, { status }).subscribe();
  }

  formatTime(isoDate: string): string {
    return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(isoDate));
  }

  formatFullDate(isoDate: string): string {
    return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(isoDate));
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h}h${m}` : `${h}h`;
  }

  trackDay(_: number, day: CalendarDay) { return day.key; }
  trackSession(_: number, session: Session) { return session.id; }
}
