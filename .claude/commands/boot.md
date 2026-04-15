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

For each entity, enumerate user actions:

| Entity | Actions |
|---|---|
| <entity> | list · detail · create · edit · delete · [domain-specific: share, archive, export…] |

Think features, not presentation. Every entity has at minimum: list view, detail view, create, edit, delete, and at least one domain-specific action (assign, activate, export, share…).
If an entity has no domain-specific action beyond CRUD, it is likely a sub-entity of another.

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

## Step 4 — Figma checkpoint [ONLY HUMAN GATE — HARD BLOCK]

Trigger `figma-designer` with:
- domain
- detected personality (enterprise/consumer/technical/creative)
- primary entities + their action matrix
- mobile: yes/no

`figma-designer` MUST produce 2–3 real Figma frames via MCP tool (`mcp__figma__generate_figma_design` or equivalent).
A markdown mock, a text description, or a wireframe in code is NOT valid — the output must be a real `figma.com` URL shared with the user.

**BLOCK here.** Alfred shares the Figma URL and waits for the human to validate.
Accepted confirmation: any explicit selection or approval ("option 2", "the dark one", "go with this", "looks good").
Not accepted: silence, ambiguity, or a new unrelated request.

On confirmed selection → `figma-sync` → fill `figma-key` and `ds-prefix` in CLAUDE.md.

## Step 5 — Autonomous execution

Execute skill chain from CLAUDE.md `skill-chain` field.
No further human gates.
Every structural decision → `docs/decisions/NNN-<slug>.md`.

## Rules
- Never ask about tech stack — it's fixed
- Never propose architecture alternatives to the user — pick and document
- If prompt is too vague to extract entities → use domain defaults, log assumption
- `docs/` is the only user-facing output
