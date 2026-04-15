# feature-design

## Scope
Angular feature anatomy, scaffolding, component decomposition, data patterns.
Reads: `docs/nx-architecture.md` · `docs/components-inventory.md`
NOT: GraphQL schema design (→ `fullstack-conception`) · component implementation (→ `design-system`)

## Feature component = view shell

```typescript
@Component({
  standalone: true,
  imports: [DsComponents..., FeatureDirectives...],
  providers: [DomainService],   // component-scoped DI
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureComponent {
  readonly entityId = input.required<string>();
}
```

Template: pass `entityId` down to directives via host binding. Zero inline logic.

**Never in a feature component:**
`Apollo` · `HttpClient` · data transformation · `ngOnInit` with business logic · hardcoded data

## File anatomy

| File | Role | Required |
|---|---|---|
| `<feature>.component.ts` | Shell: imports, providers, OnPush | ✓ |
| `<feature>.component.html` | Grid layout + DS component composition | ✓ |
| `<feature>.component.css` | CSS Grid, tokens only | ✓ |
| `directives/<name>.directive.ts` | Inject data into DS component | when live data |
| `directives/<name>.graphql` | Co-located fragment + subscription | with directive |
| `components/<name>/` | Feature-local sub-component | if non-reusable |

## Directive pattern

```typescript
@Directive({ selector: '[appFeatureName]', standalone: true })
export class FeatureNameDirective implements OnInit {
  readonly entityId = input.required<string>({ alias: 'appFeatureName' });

  constructor(
    private readonly service: DomainService,
    @Host() private readonly host: DsCardComponent,
  ) {}

  ngOnInit() {
    this.service.getData(this.entityId())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(data => this.host.data.set(data));
  }
}
```

## Data patterns

| Data type | Frequency | Transport |
|---|---|---|
| Current live state | ≥ 1/s | GraphQL subscription |
| Pre-loaded history | On mount | GraphQL query (HTTP) |
| Static aggregates | On mount | GraphQL query (HTTP) |
| Realtime events | Sporadic | GraphQL subscription |
| Mutations | On demand | GraphQL mutation + cache update |

Live pattern: query (pre-fill) + subscription (deltas). Same shape, directive manages transition.

## Nx routing

```typescript
// app.routes.ts
{
  path: 'feature',
  canActivate: [authGuard],
  loadComponent: () => import('./features/feature/feature.component'),
}
```

Route `providers: [provideCharts()]` only on routes that use chart components.
Always `loadComponent` (lazy) — never direct import.

## Nx boundaries

```
type:app-frontend  → type:ui · type:data-access · scope:shared
type:data-access   → scope:shared only (never type:ui)
type:ui            → scope:shared only
```

## Scaffold checklist

- [ ] Feature folder: `apps/<app>/src/app/features/<name>/`
- [ ] Component: shell only, providers, OnPush
- [ ] Route: lazy `loadComponent`, `authGuard`
- [ ] Directives: co-located with `.graphql` files
- [ ] No business logic in component — service or directive
- [ ] CSS Grid responsive layout with token spacing
