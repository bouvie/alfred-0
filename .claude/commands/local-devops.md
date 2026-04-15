# local-devops

## Scope
Local dev environment — Docker Compose, infrastructure services, debug ports.
NOT: prod deployment (→ `devops-cloud`) · app code (→ respective app skills)

## File structure

```
docker/
  docker-compose.yml
  services/
    timescaledb/
      01-schema.sql
      02-continuous-aggregates.sql
    emqx/
      emqx.conf
    redis/
      redis.conf
```

## Services

| Service | Port | Purpose |
|---|---|---|
| TimescaleDB | 5432 | Telemetry persistence + aggregates |
| Redis | 6379 | Event bus (Redis Streams) |
| EMQX | 1883 / 18083 | MQTT broker + dashboard |
| Adminer | 8080 | PostgreSQL UI (profile: tools) |
| RedisInsight | 5540 | Redis Streams UI (profile: tools) |

## Commands

```bash
# Standard startup
docker compose -f docker/docker-compose.yml up -d

# With debug UIs
docker compose -f docker/docker-compose.yml --profile tools up -d

# Stop
docker compose -f docker/docker-compose.yml down

# Via Nx
nx run <app>:docker:up
nx run <app>:docker:down
```

## Dev credentials

```
PostgreSQL : user / password / db: appdb
Redis      : no password
EMQX       : admin / public (dashboard)
```

## Node.js debug ports (NestJS apps)

Configure in `serve.options.port` in `project.json` (NOT in `configurations.development`).

| App | Debug port |
|---|---|
| api | 9229 |
| ingest | 9230 |
| analysis | 9231 |

`inspect: false` in `configurations.production`.

Port conflict: `netstat -ano | grep :<port>` → kill orphan process.
Nx cache issue: `npx nx reset` + delete `.nx/cache/terminalOutputs/` + `.nx/workspace-data/*.db`

## Rules
- Never commit prod credentials — `.env.local` for overrides
- SQL schema auto-applied at first start via `docker-entrypoint-initdb.d/`
- Redis Streams: no TTL in dev — messages persist until restart
- EMQX: auth disabled in dev — mandatory in prod
- TimescaleDB compression activates at 7 days — no dev impact (recent data only)
