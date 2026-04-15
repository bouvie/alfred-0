# add-skill

## Trigger
- User requests a new skill for a recurring task category
- A task is mis-routed or refused due to missing skill coverage

## Qualification checklist (before writing)

1. Skill name (kebab-case)?
2. What does it do exactly?
3. When does it trigger? (keywords, request types)
4. Position in bottom-up? (UI / feature / data / infra / deploy)
5. Does it chain with other skills? What does it receive / hand off?
6. Example requests that would have triggered it?

## What a skill contains

- Scope: what it does, what it doesn't (with pointers to other skills)
- Patterns, rules, code snippets — no prose, no narrative
- Position in execution chain + handoff format

## What a skill does NOT contain

- Component inventories → `docs/components-inventory.md`
- CSS tokens / Tailwind classes → `docs/design-tokens.md`
- Route or provider config → `docs/nx-architecture.md`
- Data-access patterns → `docs/apollo-data-access.md`
- NestJS config or SDL → `docs/nestjs-config.md`

Skills read these files at runtime via `Read` — they don't embed snapshots.

## File format

Create `~/.claude/commands/<skill-name>.md`:

```markdown
# <skill-name>

## Scope
<what it covers — 1-2 lines>
NOT: <what it doesn't cover + pointer skill>

## <Section>
<patterns, rules, code — directive only>

## Rules
- rule 1
- rule 2
```

## CLAUDE.md integration (after human approval)

1. Add row to **Skills** table
2. Add row to **Routing** table with bottom-up position
3. Add handoff pattern if it chains with other skills

## Rules
- Never create a skill for a one-time task
- Never embed docs content in skill — read at runtime
- Submit CLAUDE.md update to human before saving
- Skill files are internal — not user-facing, not shared
