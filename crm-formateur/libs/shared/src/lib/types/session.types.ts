export type SessionStatus = 'PLANNED' | 'CONFIRMED' | 'DONE' | 'CANCELLED';

export interface Session {
  id: string;
  title: string;
  contact: { id: string; name: string; company?: string | null };
  date: string;
  duration: number;
  status: SessionStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionInput {
  title: string;
  contactId: string;
  date: string;
  duration: number;
  status?: SessionStatus;
  notes?: string;
}

export interface UpdateSessionInput {
  title?: string;
  contactId?: string;
  date?: string;
  duration?: number;
  status?: SessionStatus;
  notes?: string;
}
