import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import type { Session, CreateSessionInput, UpdateSessionInput, SessionStatus } from '@org/shared';

const SESSION_ROW_FRAGMENT = gql`
  fragment SessionRow on Session {
    id title date duration status
    contact { id name company }
  }
`;

const GET_SESSIONS = gql`
  ${SESSION_ROW_FRAGMENT}
  query GetSessions($status: SessionStatus) {
    sessions(status: $status) { ...SessionRow }
  }
`;

const CREATE_SESSION = gql`
  ${SESSION_ROW_FRAGMENT}
  mutation CreateSession($input: CreateSessionInput!) {
    createSession(input: $input) { ...SessionRow }
  }
`;

const UPDATE_SESSION = gql`
  ${SESSION_ROW_FRAGMENT}
  mutation UpdateSession($id: ID!, $input: UpdateSessionInput!) {
    updateSession(id: $id, input: $input) { ...SessionRow }
  }
`;

@Injectable()
export class SessionDataService {
  private readonly apollo = inject(Apollo);

  watchSessions(status?: SessionStatus) {
    return this.apollo.watchQuery<{ sessions: Session[] }>({
      query: GET_SESSIONS,
      variables: { status },
    }).valueChanges.pipe(map(r => (r.data?.sessions ?? []) as Session[]));
  }

  createSession(input: CreateSessionInput) {
    return this.apollo.mutate<{ createSession: Session }>({
      mutation: CREATE_SESSION,
      variables: { input },
      refetchQueries: [{ query: GET_SESSIONS, variables: {} }],
    });
  }

  updateSession(id: string, input: UpdateSessionInput) {
    return this.apollo.mutate<{ updateSession: Session }>({
      mutation: UPDATE_SESSION,
      variables: { id, input },
    });
  }
}
