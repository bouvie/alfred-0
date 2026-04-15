# resume — Existing project entry point

## Triggers
Prompt on existing codebase · "continue" · "add feature to" · "fix" · CLAUDE.md already present

## Step 1 — Audit sequence

Read in order:
1. `CLAUDE.md` — `[PROJECT]` block filled?
2. `docs/product-intent.md` — exists?
3. `docs/decisions/` — any prior decisions?
4. `apps/` + `libs/` structure — what exists?
5. `libs/ui/` or design tokens — design system present?
6. `figma-key` in CLAUDE.md — Figma already validated?

## Step 2 — Re-entry decision

| State | Action |
|---|---|
| No PROJECT block, no Figma | → treat as `boot` |
| PROJECT block, no `figma-key` | → `figma-designer` checkpoint |
| `figma-key` present, no `libs/ui/` | → `figma-sync` → `design-system` |
| `libs/ui/` present, no features | → `feature-design` |
| Features present, no API | → `fullstack-conception` |
| Full stack, new feature requested | → identify layer → enter at correct skill |
| Full stack, bug or regression | → diagnose → fix inline (no skill chain) |
| Existing code violates stack conventions | → fix + log to `docs/decisions/` |

## Step 3 — State reconstruction (if PROJECT block missing)

Infer from code:
- Read `package.json` → detect stack
- Read `apps/` dirs → detect app names → fill `entities` approximation
- Read `libs/ui/` or CSS vars → detect `ds-prefix`
- Read `nx.json` → detect monorepo structure

Write inferred state to CLAUDE.md `[PROJECT]` block.
Log inference to `docs/decisions/000-project-reconstruction.md`.

## Step 4 — Execute

Enter chain at detected re-entry point.
Autonomous from here — no gates.

## Rules
- Never rebuild what already exists — audit first, always
- Missing `docs/decisions/` → create retroactively from code inspection
- If design system exists but diverges from stack conventions → fix inline, document
- Figma already validated → skip figma-designer, use existing `figma-key`
