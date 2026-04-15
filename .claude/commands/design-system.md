# design-system

## Scope
Angular 21+ standalone components. CSS-first. Tailwind. Storybook.
Read `ds-prefix` from CLAUDE.md [PROJECT] — never hardcode.
NOT: feature logic, data fetching, routing.

## Signals API — mandatory

| Old | New |
|---|---|
| `@Input() x = v` | `x = input(v)` |
| `@Input() x!: T` | `x = input.required<T>()` |
| `@Output() y = new EventEmitter<T>()` | `y = output<T>()` |
| `@Input()` + `@Output()` pair | `x = model(v)` |
| computed getter | `computed(() => ...)` |
| `@ViewChild` | `viewChild()` |
| `@ContentChild` | `contentChild()` |

## CSS rules

`NgClass` → ✗ · use `[class.x]="bool"` bindings
Hex colors → ✗ · use `var(--<prefix>-*)` only
`::ng-deep` → ✗ · use CSS custom property hooks
`style=""` inline → ✗
`@angular/common` imports → ✗
Token duplication in TS → ✗

CSS override pattern (no `::ng-deep`):
```css
/* child exposes hook */
:host { background: var(--ds-topbar-bg, var(--ds-color-surface)); }
/* parent overrides via hook */
.shell__topbar { --ds-topbar-bg: transparent; }
```

Media query order — mobile overrides AFTER base styles:
```css
.x { padding: var(--ds-space-lg); }           /* base */
@media (max-width: 768px) { .x { padding-top: 8px; } }  /* override last ✓ */
```

## Component structure

```
<name>.types.ts       types + const arrays only, no logic
<name>.component.ts   standalone, OnPush, signals
<name>.component.html no NgClass, no inline styles
<name>.component.css  BEM, var(--prefix-*) only
<name>.stories.ts     autodocs, Default + AllVariants
```

```typescript
@Component({
  selector: '<prefix>-<name>',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameComponent {
  readonly variant = input<Variant>('primary');
  readonly safeVariant = computed<Variant>(() => {
    const v = this.variant();
    return VARIANTS.includes(v) ? v : 'primary';
  });
}
```

CVA disabled pattern:
```typescript
readonly disabledInput = input(false, { alias: 'disabled' });
private readonly _disabledByForm = signal(false);
readonly disabled = computed(() => this.disabledInput() || this._disabledByForm());
setDisabledState(d: boolean) { this._disabledByForm.set(d); }
```

DOM access after render:
```typescript
constructor() {
  afterNextRender(() => {
    const el = this._ref()?.nativeElement;
    const handler = () => { /* ... */ };
    el?.addEventListener('scroll', handler, { passive: true });
    this._cleanup = () => el?.removeEventListener('scroll', handler);
  });
}
ngOnDestroy() { this._cleanup?.(); }
```

## Animations

| Use case | Token | Pattern |
|---|---|---|
| State toggle on/off | `--ds-easing-emphasis` | `transition` |
| Pop / bounce | `--ds-easing-emphasis` | `@keyframes` |
| Persistent glow | `--ds-shadow-primary-glow` | `box-shadow` on active |
| Animated border | `@property` + `conic-gradient` | `::before` + `z-index: -1` |
| Scroll-hide | signal + `transform: translateY(-100%)` | class toggle |

`prefers-reduced-motion` → wrap non-functional animations.

## Storybook

```typescript
const meta: Meta<C> = {
  title: 'Design System / Components / Name',
  component: C,
  tags: ['autodocs'],
  parameters: { layout: 'padded', figmaUrl: '...' },
};
// Required stories: Default (with argsToTemplate) + AllVariants
```

## ECharts (canvas)

CSS cannot target canvas internals. Style via TypeScript options:
- `lineStyle.shadowBlur / shadowColor`
- `areaStyle.shadowBlur`
- `itemStyle.shadowBlur / shadowOffsetY`

Colors → read from CSS vars at runtime. Never hardcode hex in ECharts options.

## Figma

Figma URL provided → delegate to `figma-sync` before any code.
No Figma URL → work from existing tokens + `docs/design-tokens.md`.

## Checklist

- [ ] `<prefix>-` selector
- [ ] `standalone: true` + `OnPush`
- [ ] `imports: []` (no `@angular/common`)
- [ ] Signals: `input()` / `output()` / `model()`
- [ ] `computed()` with fallback for constrained inputs
- [ ] BEM: `.block__element--modifier`
- [ ] `var(--prefix-*)` only — zero hex
- [ ] SVG `stroke="currentColor"`
- [ ] Story: `autodocs` + `figmaUrl` + Default + AllVariants
- [ ] Re-exported in `components/index.ts`
