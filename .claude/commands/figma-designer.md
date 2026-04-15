# figma-designer

## Scope
Design system creation and visual identity in Figma. Triggered by `boot` with domain context.
Produces: 2–3 visual directions → human picks one → handoff to `figma-sync`.
NOT: component implementation (→ `design-system`) · token extraction (→ `figma-sync`)

## Output format

For each direction, produce in Figma:
- Color palette (primary, accent, neutral, semantic)
- 2 representative screens (main dashboard + key action)
- Typography scale
- One card or data component

Present to user:
```
Direction A — [name]: [1-line personality]
Direction B — [name]: [1-line personality]
Direction C — [name]: [1-line personality]

Which direction?
```

Wait for answer. This is the only human gate.

## Direction archetypes

| Personality | Palette tendency | Radius | Motion |
|---|---|---|---|
| Enterprise dark | Deep navy, sage, low saturation | sm-md | Minimal |
| Consumer bright | White, vibrant accent, high contrast | lg-xl | Spring emphasis |
| Technical dashboard | Near-black, cyan/amber data colors | sm | None |
| Creative platform | White or off-white, expressive accent | xl | Elastic |
| Warm B2B | Warm grey, moss/terracotta | md | Subtle |

## Design principles

Mobile-first: design at 375px. Adapt for 768px+.
Touch targets: min 44×44px. Gap between targets: min 8px.
Thumb zone: primary actions at bottom. Secondary nav at top.
Safe areas: `safe-area-inset-top` + `safe-area-inset-bottom` on shells.

Motion hierarchy:
- State toggle → spring easing, 200ms
- Sheet/modal appear → 300ms ease-decelerate
- Sheet dismiss → 200ms ease-accelerate
- Persistent glow → no duration (CSS `box-shadow`)

## Token structure to produce

```
color: primary · primary-text · accent · accent-text
       surface · surface-raised · bg
       text · text-secondary · text-disabled
       border · danger · success · warning · info
spacing: xs(4) sm(8) md(12) lg(16) xl(24) 2xl(32) 3xl(48)
radius: sm(4) md(8) lg(12) xl(16) 2xl(24) full(999)
shadow: sm · md · lg · primary-glow
duration: fastest(100) fast(150) normal(200) slow(300) slower(400)
easing: standard · accelerate · decelerate · emphasis(spring)
```

## Handoff to figma-sync

On human selection:
- Note the Figma file key
- Note the frame node IDs for the selected direction
- Pass to `figma-sync` with: fileKey, nodeIds, selected direction name
