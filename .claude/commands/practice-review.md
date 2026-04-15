# practice-review

## Scope
Evaluate practices listed in `docs/working-practices.md` (section "Under observation").
Measure real session impact. Recommend: validate / abandon / extend observation.
NOT: creating new practices (→ `add-skill` or direct discussion) · session summary (→ `session-review`)

## Position in chain
Meta skill — runs at end of session, after `session-review` if present.
Receives: session experience (what happened, friction, gains)
Produces: updated `docs/working-practices.md`

## Evaluation dimensions

For each "Under observation" practice:

**Quality gain** — Did it prevent concrete errors? Improve final output? Would we have reached the same result without it?

**Reasoning efficiency** — Reduced back-and-forth with human? Reached the right solution faster? Or added friction with no value?

**Context cost** — Additional tool calls generated (WebFetch, Read...)? Token cost justified by gain?

**Applicability** — How many times did it trigger in session? Too broad (triggers on everything) or too narrow (never triggered)?

**Consistency** — Contradicts a validated rule in CLAUDE.md? Duplicates existing rule?

## Decision matrix

| Signal | Recommendation |
|---|---|
| Clear gain + low friction + applicable | **Validate** |
| Never triggered or triggered incorrectly | **Extend** (rewrite trigger condition) |
| Friction > gain, or duplicate | **Abandon** |
| Ambiguous, insufficient data | **Extend** with re-evaluation date |

## Output format

```
### [Practice name]
- Quality: ...
- Efficiency: ...
- Context cost: ...
- Applicability: ...
- Consistency: ...
→ Recommendation: Validate / Abandon / Extend
  Reason: ...
```

Submit changes to human before writing `docs/working-practices.md`.

## Rules
- Never validate after a single session — except unambiguous, obvious gain
- Never remove a practice without documenting why (Abandoned section in file)
- Never create practices during this skill — evaluation session only
