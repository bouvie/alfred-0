# iot-analysis

## Scope
`apps/buddy-analysis` + `libs/rules-engine` — consume telemetry events, run Tier1/Tier2 rules, publish notifications.
NOT: data model (→ `iot-data-model`) · ingest (→ `iot-acquisition`) · contracts (→ `iot-contracts`)

## App structure

```
libs/rules-engine/        scope:analysis    Tier1/Tier2 interfaces
apps/buddy-analysis/      scope:analysis
  src/app/modules/
    consumer/             Redis Streams consumer group
    analysis/             Tier1 + Tier2 orchestration + rules
    notification/         NotificationEvent publisher
```

## Module graph

```typescript
AppModule
  EventBusModule.forRoot()             // Redis Streams consume + publish
  TelemetryDataAccessModule.forRoot()  // TimescaleDB read baseline
  NotificationModule                   // NotificationService
  AnalysisModule                       // AnalysisService + rules
  ConsumerModule                       // ConsumerService (polling)
```

## Analysis flow

```
Redis Streams (TELEMETRY_STREAM_KEY)
  consumer group: "analysis"
       │
  ConsumerService.poll()  →  xReadGroup → TelemetryEvent
       │
  AnalysisService.analyze(event)
       ├─ Tier1 — Stateless, synchronous, no DB
       │   └── rules[].evaluate(event, context) → NotificationEvent | null
       │
       └─ Tier2 — Async, DB access
           ├── findHourlyBaseline(deviceId, 24h)
           └── rules[].evaluate(event, context) → NotificationEvent | null
                    │
           NotificationService.send(event)
                    │
           Redis Streams (NOTIFICATION_STREAM_KEY)
```

## Rule interfaces

```typescript
// Tier 1 — synchronous, no DB
interface Tier1Rule {
  readonly name: string;
  evaluate(event: TelemetryEvent, context: Tier1Context): NotificationEvent | null;
}

// Tier 2 — async, DB access allowed
interface Tier2Rule {
  readonly name: string;
  evaluate(event: TelemetryEvent, context: Tier2Context): Promise<NotificationEvent | null>;
}
```

## Adding a rule

**Tier 1:**
1. Create `modules/analysis/rules/tier1/<name>.rule.ts`
2. Implement `Tier1Rule`
3. Register in `AnalysisService.tier1Rules[]`

**Tier 2:**
1. Create `modules/analysis/rules/tier2/<name>.rule.ts`
2. Implement `Tier2Rule`
3. Register in `AnalysisService.tier2Rules[]`

Adding a `NotificationType` value → update `notification-contracts` + rules engine in same PR.

## Env vars

```env
REDIS_HOST=localhost
REDIS_PORT=6379
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app
DB_USER=app
DB_PASSWORD=app_dev
PORT=3002
HOSTNAME=analysis-1    # consumer group member ID
```

## Rules
- Tier 1 = synchronous, zero DB — context loaded in memory at startup
- Tier 2 = async — may query TimescaleDB for baseline data
- Consumer lifecycle in `onModuleInit` / `onModuleDestroy` — no constructor side effects
- `xAck` on every message — even on error (prevents infinite retry loop)
- `scope:analysis` never imports `scope:acquisition` — ESLint boundary enforced
