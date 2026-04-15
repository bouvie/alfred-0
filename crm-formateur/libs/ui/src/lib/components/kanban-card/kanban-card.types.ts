export type ContactStatus = 'prospect' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

export const CONTACT_STATUSES = ['prospect', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const;

export interface KanbanCardData {
  id: string;
  name: string;
  company?: string;
  status: ContactStatus;
  lastContact?: Date;
  tags?: string[];
  assignee?: string;
}
