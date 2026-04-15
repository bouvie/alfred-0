export type ContactStatus = 'PROSPECT' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'LOST';

export interface Contact {
  id: string;
  name: string;
  company?: string | null;
  status: ContactStatus;
  tags: string[];
  lastContact?: string | null;
  notes?: string | null;
  assignee?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInput {
  name: string;
  company?: string;
  status?: ContactStatus;
  tags?: string[];
  notes?: string;
  assigneeId?: string;
}

export interface UpdateContactInput {
  name?: string;
  company?: string;
  status?: ContactStatus;
  tags?: string[];
  notes?: string;
  lastContact?: string;
  assigneeId?: string;
}
