import type { Contact } from './contact.types';

export interface PipelineColumn {
  id: string;
  title: string;
  position: number;
  contacts: Contact[];
}

export interface Pipeline {
  columns: PipelineColumn[];
  totalContacts: number;
}

export interface MoveContactInput {
  contactId: string;
  columnId: string;
  position: number;
}
