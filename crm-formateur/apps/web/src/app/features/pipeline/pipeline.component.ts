import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { KanbanCardComponent, ButtonComponent, BadgeComponent } from '@org/ui';
import type { KanbanCardData } from '@org/ui';
import { PipelineDataService, ContactDataService } from '@org/data-access';
import type { Pipeline, PipelineColumn, Contact, ContactStatus } from '@org/shared';

const STATUS_LABELS: Record<string, string> = {
  PROSPECT: 'Prospect', CONTACTED: 'Contacté', QUALIFIED: 'Qualifié',
  PROPOSAL: 'Proposition', WON: 'Gagné', LOST: 'Perdu',
};

const STATUS_VARIANTS: Record<string, string> = {
  PROSPECT: 'neutral', CONTACTED: 'info', QUALIFIED: 'primary',
  PROPOSAL: 'warning', WON: 'success', LOST: 'danger',
};

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [KanbanCardComponent, ButtonComponent, BadgeComponent],
  providers: [PipelineDataService, ContactDataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.css'],
})
export class PipelineComponent {
  private readonly pipelineService = inject(PipelineDataService);
  private readonly contactService = inject(ContactDataService);

  readonly pipeline = toSignal<Pipeline | null>(this.pipelineService.watchPipeline(), { initialValue: null });
  readonly selectedCardId = signal<string | null>(null);
  readonly draggingId = signal<string | null>(null);
  readonly dragOverColumn = signal<string | null>(null);

  readonly selectedContact = computed<{ contact: Contact; columnId: string } | null>(() => {
    const id = this.selectedCardId();
    if (!id) return null;
    const p = this.pipeline();
    if (!p) return null;
    for (const col of p.columns) {
      const c = col.contacts.find(c => c.id === id);
      if (c) return { contact: c, columnId: col.id };
    }
    return null;
  });

  readonly statusLabels = STATUS_LABELS;
  readonly statusVariants = STATUS_VARIANTS;
  readonly allStatuses = Object.keys(STATUS_LABELS) as ContactStatus[];

  // Create form
  readonly adding = signal(false);
  readonly createName = signal('');
  readonly createCompany = signal('');
  readonly createContactStatus = signal<ContactStatus>('PROSPECT');

  startCreate(): void {
    this.createName.set('');
    this.createCompany.set('');
    this.createContactStatus.set('PROSPECT');
    this.adding.set(true);
  }

  saveCreate(): void {
    const name = this.createName().trim();
    if (!name) return;
    this.contactService.createContact({
      name,
      company: this.createCompany().trim() || undefined,
      status: this.createContactStatus(),
    }).subscribe(() => {
      this.pipelineService.refetchPipeline().subscribe();
      this.adding.set(false);
    });
  }

  cancelCreate(): void { this.adding.set(false); }

  toCardData(contact: Contact): KanbanCardData {
    return {
      id: contact.id,
      name: contact.name,
      company: contact.company ?? undefined,
      status: contact.status.toLowerCase() as KanbanCardData['status'],
      tags: contact.tags,
      lastContact: contact.lastContact ? new Date(contact.lastContact) : undefined,
    };
  }

  selectCard(card: KanbanCardData): void {
    this.selectedCardId.update(id => id === card.id ? null : card.id);
  }

  closePanel(): void {
    this.selectedCardId.set(null);
  }

  updateStatus(contact: Contact, status: ContactStatus): void {
    this.contactService.updateContact(contact.id, { status }).subscribe();
  }

  deleteContact(contact: Contact): void {
    this.contactService.deleteContact(contact.id).subscribe(() => {
      this.closePanel();
    });
  }

  moveContact(contactId: string, targetColumnId: string): void {
    this.pipelineService.moveContact({ contactId, columnId: targetColumnId, position: 0 }).subscribe();
  }

  // Drag and Drop
  onDragStart(event: DragEvent, contact: Contact): void {
    this.draggingId.set(contact.id);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', contact.id);
    }
  }

  onDragEnd(): void {
    this.draggingId.set(null);
    this.dragOverColumn.set(null);
  }

  onDragOver(event: DragEvent, columnId: string): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    this.dragOverColumn.set(columnId);
  }

  onDragLeave(event: DragEvent, columnId: string): void {
    const el = event.currentTarget as HTMLElement;
    if (!el.contains(event.relatedTarget as Node)) {
      if (this.dragOverColumn() === columnId) this.dragOverColumn.set(null);
    }
  }

  onDrop(event: DragEvent, columnId: string): void {
    event.preventDefault();
    const contactId = this.draggingId();
    if (contactId) this.moveContact(contactId, columnId);
    this.onDragEnd();
  }

  formatDate(isoDate: string): string {
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: '2-digit', year: 'numeric' }).format(new Date(isoDate));
  }

  trackColumn(_: number, col: PipelineColumn) { return col.id; }
  trackContact(_: number, contact: Contact) { return contact.id; }
}
