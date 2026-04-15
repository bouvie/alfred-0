# fullstack-conception

## Scope
GraphQL schema, fragments, subscriptions, Apollo cache, NestJS resolvers, data-access libs.
NOT: UI components (→ `design-system`) · DB schema (→ `data-model`)

## Principle
Fragments defined by frontend needs. Schema satisfies fragments — not the reverse.

## Fragment ownership

| Artifact | Owner | Location |
|---|---|---|
| Data fragment | Directive or component consuming it | Co-located with `.ts` |
| Composition query | Feature component | `<feature>.graphql` |
| Live subscription | Directive managing the stream | Co-located with `.ts` |
| Shared identity fragment | `libs/graphql-client` | `graphql/fragments/` |
| Type policy / keyFields | `libs/graphql-client` | `graphql/cache.config.ts` |
| Generated TS types | graphql-codegen | `libs/graphql-client/src/generated/` |

Fragment → never imported from another directive. Shared fragments → elevate to `libs/graphql-client`.

## File structure

```
features/<feature>/
  <feature>.graphql          composition query + feature fragment
  directives/
    <name>.graphql           data fragment + subscription
    <name>.directive.ts
```

Directive `.graphql`:
```graphql
fragment WidgetName_Entity on Entity {
  id
  fieldA
  fieldB
}
subscription WidgetNameLive($id: ID!) {
  entityUpdated(id: $id) { fieldA fieldB }
}
```

Feature `.graphql`:
```graphql
#import "./directives/widget.graphql"
fragment Feature_Entity on Entity { id ...WidgetName_Entity }
query FeatureData($id: ID!) { entity(id: $id) { ...Feature_Entity } }
```

## Subscription vs Query

| Data | Frequency | Use |
|---|---|---|
| Live state (BPM, GPS) | ≥ 1/s | Subscription WS |
| Pre-loaded history | Mount | Query HTTP |
| Static aggregates | Mount | Query HTTP |
| Realtime events | Sporadic | Subscription WS |
| Mutation result | On demand | Mutation + cache update |

Live pattern: query (pre-fill) → subscription (deltas). Same shape.

## Apollo cache

`keyFields: false` on ephemeral live types (no stable ID).
`cache-and-network` fetch policy on live queries.
Apollo cache = source of truth. Never `signal.set()` after mutation.

Cache versioning (Capacitor):
```typescript
const VERSION = '1'; // increment on every breaking schema change
const stored = await AsyncStorage.getItem('SCHEMA_VERSION');
if (stored !== VERSION) { await cache.reset(); await AsyncStorage.setItem('SCHEMA_VERSION', VERSION); }
```

## Schema rules

- Ephemeral types (streams, GPS points) → `keyFields: false`, no `id` field
- List args reflect frontend needs: `series(last: Int! = 30)` — the `30` is the chart window
- Display-ready labels → frontend transforms ISO dates, backend never sends formatted strings
- New field → nullable by default. `!` only when contractually guaranteed
- Deprecation: `@deprecated(reason: "...")` before removal

## NestJS rules

`@Req()/@Res()` in resolvers → ✗ · use `@Context()` only
`new PubSub()` directly → ✗ · always inject via token
Side effects in constructor → ✗ · use `onModuleInit()` / `onModuleDestroy()`

Module structure:
```
modules/<domain>/
  <domain>.tokens.ts     injection token constants (prevents circular dep)
  <domain>.module.ts     providers, imports, exports
  <domain>.resolver.ts   @Query, @ResolveField, @Subscription — zero business logic
  <domain>.service.ts    business logic, lifecycle
```

PubSub pattern:
```typescript
// tokens.ts
export const DOMAIN_PUB_SUB = 'DOMAIN_PUB_SUB';
// module.ts
{ provide: DOMAIN_PUB_SUB, useFactory: () => new PubSub() }
// service.ts
constructor(@Inject(DOMAIN_PUB_SUB) private pubSub: PubSub) {}
```

Subscription payload key must match GraphQL field name exactly.

## Stack decisions

| Decision | Choice |
|---|---|
| HTTP platform | `@nestjs/platform-fastify` |
| GraphQL transport | `@nestjs/apollo` + `ApolloDriver` |
| WebSocket | `graphql-ws` |
| Schema approach | Schema-first (SDL) |
| PubSub | `graphql-subscriptions` in-memory |

## Checklist — new module

- [ ] `<domain>.tokens.ts` with PubSub token
- [ ] Provider `useFactory: () => new PubSub()` in module
- [ ] Service injects via `@Inject(TOKEN)`
- [ ] Effects in `onModuleInit()`, cleanup in `onModuleDestroy()`
- [ ] Resolver uses `@Context()`, never `@Req()`
- [ ] New fields nullable by default

## Checklist — new live widget

- [ ] Co-located `.graphql`: fragment + subscription same shape
- [ ] `keyFields: false` for ephemeral type in `cache.config.ts`
- [ ] Query pre-fill → subscription deltas pattern
- [ ] `takeUntilDestroyed()` on subscription
- [ ] `SCHEMA_VERSION` incremented on breaking change
