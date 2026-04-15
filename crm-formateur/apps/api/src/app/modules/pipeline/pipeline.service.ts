import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/database';
import { ContactStatus } from '@prisma/client';

const COLUMNS = [
  { id: 'new',       slug: 'new',       title: 'Nouveaux',    position: 0 },
  { id: 'contacted', slug: 'contacted', title: 'Contactés',   position: 1 },
  { id: 'proposal',  slug: 'proposal',  title: 'Proposition', position: 2 },
  { id: 'won',       slug: 'won',       title: 'Gagnés',      position: 3 },
  { id: 'lost',      slug: 'lost',      title: 'Perdus',      position: 4 },
];

const STATUS_TO_COLUMN: Record<ContactStatus, string> = {
  PROSPECT:  'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'contacted',
  PROPOSAL:  'proposal',
  WON:       'won',
  LOST:      'lost',
};

const COLUMN_TO_STATUS: Record<string, ContactStatus> = {
  new:       'PROSPECT',
  contacted: 'CONTACTED',
  proposal:  'PROPOSAL',
  won:       'WON',
  lost:      'LOST',
};

@Injectable()
export class PipelineService {
  constructor(private readonly prisma: PrismaService) {}

  async getPipeline() {
    const contacts = await this.prisma.contact.findMany({
      include: { assignee: { select: { id: true, name: true } } },
      orderBy: [{ position: 'asc' }, { updatedAt: 'desc' }],
    });

    const columns = COLUMNS.map(col => ({
      ...col,
      contacts: contacts.filter(c => STATUS_TO_COLUMN[c.status] === col.slug),
    }));

    return { columns, totalContacts: contacts.length };
  }

  async moveContact(contactId: string, columnId: string, position: number) {
    const newStatus = COLUMN_TO_STATUS[columnId];
    if (!newStatus) throw new Error(`Unknown column: ${columnId}`);

    return this.prisma.contact.update({
      where: { id: contactId },
      data: { status: newStatus, position, updatedAt: new Date() },
      include: { assignee: { select: { id: true, name: true } } },
    });
  }
}
