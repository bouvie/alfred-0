# session-review

## Trigger
- Session with 3+ substantial exchanges, multiple skills activated, or structural decisions made
- Explicit: "session review", "what should we add", "what skills are missing"

## Analysis scope

From current session history:
1. **Domains covered** — which technical areas were worked (UI, GraphQL, Nx, NestJS, tests, CI...)
2. **Friction points** — tasks with no adequate skill coverage, recurring arbitration, repeated questions
3. **Emerging patterns** — conventions established in session worth encoding in a skill
4. **Bottom-up deviations** — cases where execution order was wrong or needed a variant

## Output format

```
## Session Review — [YYYY-MM-DD]

### Domains covered
<list>

### Skills activated
<skill → how it was used>

### Recommendations — new skills
For each:
- Name (kebab-case)
- Trigger: when to invoke
- Coverage
- Bottom-up position
- Priority: High / Medium / Low

### Recommendations — CLAUDE.md updates
<execution rules, handoff patterns, routing additions>

### Recommendations — docs/ updates
<docs to create or update from session decisions>

### Uncovered recurring patterns
<behaviors or conventions that appeared without a skill>
```

## Persistent output

Write report to: `docs/session-reviews/session-[YYYY-MM-DD].md`

```yaml
---
date: YYYY-MM-DD
skills-activated: [list]
---
```

## Recommendation criteria

**New skill:** need appeared 2+ times without coverage · transverse/reusable domain · established pattern worth encapsulating

**CLAUDE.md update:** applied rule not yet documented · new handoff pattern emerged · structural project decision taken

**docs/ update:** existing doc recognized as stale · new reference category emerged

## Rules
- Does not create skills directly — recommends, human decides
- Does not modify CLAUDE.md without explicit validation — use `add-skill` for integration
- No report for short sessions (1-2 simple exchanges, no skill activated)
