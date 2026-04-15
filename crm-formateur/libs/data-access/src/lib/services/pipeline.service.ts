import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import type { Pipeline, MoveContactInput } from '@org/shared';

const GET_PIPELINE = gql`
  query GetPipeline {
    pipeline {
      columns {
        id title position
        contacts { id name company status tags lastContact }
      }
      totalContacts
    }
  }
`;

const MOVE_CONTACT = gql`
  mutation MoveContact($input: MoveContactInput!) {
    moveContact(input: $input) { id status }
  }
`;

@Injectable()
export class PipelineDataService {
  private readonly apollo = inject(Apollo);

  watchPipeline() {
    return this.apollo.watchQuery<{ pipeline: Pipeline }>({
      query: GET_PIPELINE,
    }).valueChanges.pipe(map(r => (r.data?.pipeline ?? null) as Pipeline | null));
  }

  moveContact(input: MoveContactInput) {
    return this.apollo.mutate({
      mutation: MOVE_CONTACT,
      variables: { input },
      refetchQueries: [{ query: GET_PIPELINE }],
    });
  }

  refetchPipeline() {
    return this.apollo.query<{ pipeline: Pipeline }>({
      query: GET_PIPELINE,
      fetchPolicy: 'network-only',
    });
  }
}
