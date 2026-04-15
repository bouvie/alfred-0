import { InMemoryCache } from '@apollo/client/core';

export const SCHEMA_VERSION = '1';

export function createCache(): InMemoryCache {
  return new InMemoryCache({
    typePolicies: {
      Pipeline: {
        keyFields: false,
      },
      PipelineColumn: {
        keyFields: ['id'],
      },
      Contact: {
        keyFields: ['id'],
      },
      Session: {
        keyFields: ['id'],
      },
    },
  });
}
