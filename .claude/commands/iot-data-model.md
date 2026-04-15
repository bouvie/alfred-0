# iot-data-model

## Scope
TimescaleDB hypertable schema + `telemetry-data-access` lib.
NOT: ingest pipeline (→ `iot-acquisition`) · analysis reads (→ `iot-analysis`)

## Lib structure

```
libs/
  telemetry-data-access/   scope:events   write (ingest) + read (analysis)

docker/
  services/timescaledb/
    01-schema.sql           hypertable + compression + retention
    02-continuous-aggregates.sql
```

## Schema — `telemetry` hypertable

```sql
CREATE TABLE telemetry (
  device_id    TEXT        NOT NULL,
  recorded_at  TIMESTAMPTZ NOT NULL,  -- device clock (source of truth)
  received_at  TIMESTAMPTZ NOT NULL,  -- server audit clock
  latitude     DOUBLE PRECISION,
  longitude    DOUBLE PRECISION,
  -- add domain metric columns here (nullable)
  UNIQUE (device_id, recorded_at)     -- idempotency key
);
SELECT create_hypertable('telemetry', 'recorded_at', chunk_time_interval => INTERVAL '7 days');
SELECT add_compression_policy('telemetry', INTERVAL '7 days');
SELECT add_retention_policy('telemetry', INTERVAL '90 days');
```

## Continuous aggregates

`telemetry_hourly` — Tier 2 baseline input. Retention: 1 year.
`telemetry_daily`  — Activity score. Retention: 2 years.
Both real-time — TimescaleDB computes automatically, no batch job.

## Repository API

```typescript
// Write — buddy-ingest only
telemetryRepository.insertBatch(rows: TelemetryRow[]): Promise<void>  // ON CONFLICT DO NOTHING

// Read — buddy-analysis only
telemetryRepository.findRecent(deviceId, limit?): Promise<TelemetryRow[]>
telemetryRepository.findHourlyBaseline(deviceId, hours?): Promise<TelemetryHourlyRow[]>
```

## pgTyped — type generation

Types generated from `src/lib/queries/telemetry.sql` at build time.

```
src/lib/queries/
  telemetry.sql                     committed SQL source
  __generated__/
    telemetry.queries.ts            committed stub (IDE fallback) — overwritten at build
```

Build sequence:
1. `docker compose up -d` — DB available
2. `nx run telemetry-data-access:pgtyped` — generate types from live DB
3. `nx build telemetry-data-access` — depends on pgtyped (automatic)

Nx cache inputs: `src/lib/queries/**/*.sql` + schema SQL files.
pgTyped uses prepared statements — plan cached after first call.

## NestJS module

```typescript
TelemetryDataAccessModule.forRoot({
  host: process.env['DB_HOST'],
  port: parseInt(process.env['DB_PORT'] ?? '5432'),
  database: process.env['DB_NAME'],
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
})
```

## Rules
- No ORM — raw SQL to leverage TimescaleDB functions (hypertables, aggregates)
- `ON CONFLICT DO NOTHING` on insertBatch — device retransmissions silently ignored
- `recorded_at` is the partition key — always include in WHERE time-range queries
- Never `SELECT *` without `device_id` + time range — defeats partitioning
- All domain metric columns nullable — sensor may be absent on device
