# figma-sync

## Scope
Figma ↔ code bridge. Transversal — can precede or follow any skill.
Reads Figma via MCP tools. Extracts tokens, components, specs.
NOT: component implementation (→ `design-system`) · design creation (→ `figma-designer`)

## Modes

| Trigger | Mode | Action |
|---|---|---|
| Figma URL provided | Inspect | Extract specs → hand to `design-system` |
| Post-`figma-designer` validation | Lock | Extract tokens → fill `ds-prefix` + `figma-key` in CLAUDE.md |
| "audit drift" | Drift | Compare existing code vs Figma → list deltas |
| Designer updated Figma | Figma-first | Re-extract → update code to match |

## Extraction steps

1. `get_design_context(fileKey, nodeId)` — primary call
2. From result extract:
   - Color tokens (hex + role)
   - Spacing values
   - Radius values
   - Shadow definitions
   - Typography scale
   - Component variants and states
3. Map to CSS custom properties: `--<prefix>-<category>-<name>`
4. Write to `libs/ui/src/lib/tokens/variables.css`
5. Update `docs/design-tokens.md`

## URL parsing

`figma.com/design/:fileKey/:name?node-id=:nodeId` → nodeId: replace `-` with `:`
`figma.com/board/:fileKey/` → FigJam → use `get_figjam`

## Token naming convention

```css
--<prefix>-color-primary
--<prefix>-color-primary-text
--<prefix>-space-lg
--<prefix>-radius-md
--<prefix>-shadow-md
--<prefix>-duration-normal
--<prefix>-easing-emphasis
```

Prefix = `ds-prefix` from CLAUDE.md [PROJECT].

## Handoff to design-system

After extraction, pass:
```
Extracted tokens: <count> CSS vars written to variables.css
Component specs:
  <name>: variants=[...], states=[...], dimensions={...}
  <name>: ...
ds-prefix: <value>
figma-key: <value>
```

## Rules
- Never assume token values — always read from Figma
- Never invent a component spec — extract or skip
- Drift mode → list only, do not auto-fix without explicit instruction
- `figma-key` written to CLAUDE.md [PROJECT] after lock mode
