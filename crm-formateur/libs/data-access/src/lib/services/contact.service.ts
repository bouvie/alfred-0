import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import type { Contact, CreateContactInput, UpdateContactInput, ContactStatus } from '@org/shared';

const CONTACT_ROW_FRAGMENT = gql`
  fragment ContactRow on Contact {
    id name company status tags lastContact
  }
`;

const GET_CONTACTS = gql`
  ${CONTACT_ROW_FRAGMENT}
  query GetContacts($status: ContactStatus, $search: String) {
    contacts(status: $status, search: $search) { ...ContactRow }
  }
`;

const CREATE_CONTACT = gql`
  ${CONTACT_ROW_FRAGMENT}
  mutation CreateContact($input: CreateContactInput!) {
    createContact(input: $input) { ...ContactRow }
  }
`;

const UPDATE_CONTACT = gql`
  ${CONTACT_ROW_FRAGMENT}
  mutation UpdateContact($id: ID!, $input: UpdateContactInput!) {
    updateContact(id: $id, input: $input) { ...ContactRow }
  }
`;

const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) { deleteContact(id: $id) }
`;

@Injectable()
export class ContactDataService {
  private readonly apollo = inject(Apollo);

  watchContacts(status?: ContactStatus, search?: string) {
    return this.apollo.watchQuery<{ contacts: Contact[] }>({
      query: GET_CONTACTS,
      variables: { status, search },
    }).valueChanges.pipe(map(r => (r.data?.contacts ?? []) as Contact[]));
  }

  createContact(input: CreateContactInput) {
    return this.apollo.mutate<{ createContact: Contact }>({
      mutation: CREATE_CONTACT,
      variables: { input },
      update(cache, { data }) {
        const existing = cache.readQuery<{ contacts: Contact[] }>({ query: GET_CONTACTS, variables: {} });
        if (!data?.createContact || !existing) return;
        cache.writeQuery({
          query: GET_CONTACTS,
          variables: {},
          data: { contacts: [...existing.contacts, data.createContact] },
        });
      },
    });
  }

  updateContact(id: string, input: UpdateContactInput) {
    return this.apollo.mutate<{ updateContact: Contact }>({
      mutation: UPDATE_CONTACT,
      variables: { id, input },
    });
  }

  deleteContact(id: string) {
    return this.apollo.mutate<{ deleteContact: boolean }>({
      mutation: DELETE_CONTACT,
      variables: { id },
      update(cache) {
        cache.evict({ id: cache.identify({ __typename: 'Contact', id }) });
        cache.gc();
      },
    });
  }
}
