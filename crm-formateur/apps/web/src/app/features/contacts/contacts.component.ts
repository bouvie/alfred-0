import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AvatarComponent, BadgeComponent, ButtonComponent } from '@org/ui';
import { ContactDataService } from '@org/data-access';
import type { Contact, ContactStatus, UpdateContactInput } from '@org/shared';

const STATUS_LABELS: Record<string, string> = {
  PROSPECT: 'Prospect', CONTACTED: 'Contacté', QUALIFIED: 'Qualifié',
  PROPOSAL: 'Proposition', WON: 'Gagné', LOST: 'Perdu',
};

const STATUS_VARIANTS: Record<string, string> = {
  PROSPECT: 'neutral', CONTACTED: 'info', QUALIFIED: 'primary',
  PROPOSAL: 'warning', WON: 'success', LOST: 'danger',
};

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [AvatarComponent, BadgeComponent, ButtonComponent],
  providers: [ContactDataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent {
  private readonly contactService = inject(ContactDataService);

  readonly contacts = toSignal(this.contactService.watchContacts(), { initialValue: [] as Contact[] });
  readonly selectedId = signal<string | null>(null);
  readonly editing = signal(false);

  readonly selectedContact = computed(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.contacts().find(c => c.id === id) ?? null;
  });

  // Edit form state
  readonly editName = signal('');
  readonly editCompany = signal('');
  readonly editStatus = signal<ContactStatus>('PROSPECT');
  readonly editNotes = signal('');

  readonly STATUS_LABELS = STATUS_LABELS;
  readonly STATUS_VARIANTS = STATUS_VARIANTS;
  readonly allStatuses = Object.keys(STATUS_LABELS) as ContactStatus[];

  // Create form
  readonly adding = signal(false);
  readonly createName = signal('');
  readonly createCompany = signal('');
  readonly createStatus = signal<ContactStatus>('PROSPECT');
  readonly createNotes = signal('');

  startCreate(): void {
    this.createName.set('');
    this.createCompany.set('');
    this.createStatus.set('PROSPECT');
    this.createNotes.set('');
    this.adding.set(true);
  }

  saveCreate(): void {
    const name = this.createName().trim();
    if (!name) return;
    this.contactService.createContact({
      name,
      company: this.createCompany().trim() || undefined,
      status: this.createStatus(),
      notes: this.createNotes().trim() || undefined,
    }).subscribe(() => this.adding.set(false));
  }

  cancelCreate(): void { this.adding.set(false); }

  openContact(contact: Contact): void {
    this.selectedId.set(contact.id);
    this.editing.set(false);
  }

  closePanel(): void {
    this.selectedId.set(null);
    this.editing.set(false);
  }

  startEdit(contact: Contact): void {
    this.editName.set(contact.name);
    this.editCompany.set(contact.company ?? '');
    this.editStatus.set(contact.status);
    this.editNotes.set(contact.notes ?? '');
    this.editing.set(true);
  }

  saveEdit(contact: Contact): void {
    const input: UpdateContactInput = {
      name: this.editName() || undefined,
      company: this.editCompany() || undefined,
      status: this.editStatus(),
      notes: this.editNotes() || undefined,
    };
    this.contactService.updateContact(contact.id, input).subscribe(() => {
      this.editing.set(false);
    });
  }

  deleteContact(contact: Contact): void {
    this.contactService.deleteContact(contact.id).subscribe(() => {
      this.closePanel();
    });
  }
}
