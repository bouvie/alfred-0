# iot-acquisition

## Scope
Ingest service — receive device data, validate, write DB, publish event bus. Zero business logic.
NOT: data model (→ `iot-data-model`) · analysis (→ `iot-analysis`) · contracts (→ `iot-contracts`)

## App structure

```
apps/buddy-ingest/        scope:acquisition
  src/app/modules/
    device-auth/          X-Device-Key guard
    mqtt/                 EMQX connection + topic routing
    ingest/               Validate → Write → Publish
```

## Module graph

```typescript
AppModule
  EventBusModule.forRoot()             // Redis Streams publish
  TelemetryDataAccessModule.forRoot()  // TimescaleDB write
  DeviceAuthModule                     // API key guard
  MqttModule                           // MQTT listener
  IngestModule                         // IngestService
```

## Processing flow

```
EMQX MQTT
  topic: devices/{deviceId}/telemetry
  payload: DeviceBatch (JSON)
       │
  MqttService.handleMessage()
       │  parse JSON → DeviceBatch
  IngestService.processBatch()
       ├─ Validate (did, r non-empty)
       ├─ Normalize DeviceMetric[] → TelemetryRow[]
       ├─ telemetryRepository.insertBatch() → TimescaleDB
       └─ eventBus.publish(TELEMETRY_STREAM_KEY, event) → Redis Streams
```

## Imports

```typescript
import { DeviceBatch, DeviceMetric } from '@[PROJECT]/device-contracts';
import { TelemetryRepository, TelemetryRow } from '@[PROJECT]/telemetry-data-access';
import { EventBusService } from '@[PROJECT]/event-bus';
import { TelemetryEvent, TELEMETRY_STREAM_KEY } from '@[PROJECT]/telemetry-events';
```

## MQTT topic pattern

```
subscribe: devices/+/telemetry
extract deviceId from topic segment
```

## Env vars

```env
MQTT_BROKER_URL=mqtt://localhost:1883
REDIS_HOST=localhost
REDIS_PORT=6379
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app
DB_USER=app
DB_PASSWORD=app_dev
PORT=3001
```

## Rules
- `IngestService` zero business logic — no rules, no interpretation, no domain knowledge
- MQTT lifecycle in `onModuleInit` / `onModuleDestroy` — no constructor side effects
- Auto-reconnect: `reconnectPeriod: 5000`
- Invalid payload → warn + skip — never throw (drops MQTT connection)
- `scope:acquisition` never imports `scope:analysis` — ESLint boundary enforced
