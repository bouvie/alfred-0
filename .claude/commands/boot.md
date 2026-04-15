# boot — New project entry point

## Triggers
First prompt on blank project · "build X" · "create a [product]" · no CLAUDE.md identity block

## Step 1 — Intent parsing

Extract from prompt:

| Signal | Field |
|---|---|
| What it does | `domain` |
| Core nouns | `entities` |
| Who uses it | `users` |
| Live data / events | `realtime: yes/no` |
| Native app needed | `mobile: yes/no` |
| Multiple orgs / accounts | `multi-tenant: yes/no` |
| Payment flow | `payments: yes/no` |

Write `docs/product-intent.md`:
```markdown
# Product Intent
domain:
entities:
users:
realtime:
mobile:
multi-tenant:
payments:
architecture:
skill-chain:
```

## Step 2 — Architecture selection

| Pattern | Triggers | Skill chain |
|---|---|---|
| IoT pipeline | devices · sensors · MQTT · telemetry | `iot-contracts` → `iot-data-model` → `iot-acquisition` → `iot-analysis` → `fullstack-conception` |
| SaaS platform | multi-tenant · subscriptions · orgs | `auth` + `data-model` + `saas-patterns` → `fullstack-conception` |
| Realtime dashboard | live data · no physical devices | `fullstack-conception` (subscriptions path) |
| Standard CRUD | entities · no realtime | `data-model` → `fullstack-conception` |
| Marketplace | buyers/sellers · payments · listings | `data-model` + `saas-patterns` → `fullstack-conception` |
| Content platform | CMS · articles · search | `data-model` (MongoDB) + `saas-patterns` (Typesense) → `fullstack-conception` |

Ambiguous → pick simplest · log to `docs/decisions/001-architecture.md`

## Step 3 — Fill CLAUDE.md [PROJECT] block

```
name: <project name from prompt>
domain: <detected>
entities: <list>
users: <list>
realtime: <yes|no>
mobile: <yes|no>
multi-tenant: <yes|no>
figma-key: (pending)
ds-prefix: (pending)
architecture-pattern: <selected>
skill-chain: <ordered list>
```

## Step 4 — Figma checkpoint [ONLY HUMAN GATE]

Trigger `figma-designer` with:
- domain
- detected personality (enterprise/consumer/technical/creative)
- primary entities
- mobile: yes/no

`figma-designer` produces 2–3 visual directions in Figma.
Wait for human selection.
On selection → trigger `figma-sync` → fill `figma-key` and `ds-prefix` in CLAUDE.md.

## Step 5 — Autonomous execution

Execute skill chain from CLAUDE.md `skill-chain` field.
No further human gates.
Every structural decision → `docs/decisions/NNN-<slug>.md`.

## Rules
- Never ask about tech stack — it's fixed
- Never propose architecture alternatives to the user — pick and document
- If prompt is too vague to extract entities → use domain defaults, log assumption
- `docs/` is the only user-facing output
