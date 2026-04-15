# iot-contracts

## Scope
Inter-service TypeScript contracts for IoT pipelines. Payload types, event types, notification types, event bus.
NOT: DB schema (→ `iot-data-model`) · service implementation (→ `iot-acquisition`, `iot-analysis`)

## Lib structure

```
libs/
  device-contracts/       scope:acquisition  device → ingest (MQTT payload)
  event-contracts/        scope:events       ingest → analysis (Redis Streams)
  notification-contracts/ scope:events       analysis → notify (Redis Streams)
  event-bus/              scope:events       Redis Streams client
```

## Contracts

Device payload (MQTT, size-optimized for IoT bandwidth):
```typescript
interface DeviceBatch { did: string; r: DeviceMetric[]; }
interface DeviceMetric { ts: number; gps?: [number, number]; [metric: string]: unknown; }
// Short keys intentional — minimize NB-IoT/LTE-M payload
```

Event (ingest → analysis, full names for readability):
```typescript
interface TelemetryEvent {
  deviceId: string; recordedAt: number; receivedAt: number;
  [metric: string]: unknown;  // typed per domain
}
```

Notification (analysis → notify):
```typescript
interface NotificationEvent { type: NotificationType; userId: string; deviceId: string; triggeredAt: number; context: Record<string, unknown>; }
enum NotificationType { /* closed enum — adding a type = update this file + analysis rules */ }
```

Stream keys = exported constants. Never string literals in services.

## Rules
- `scope:acquisition` and `scope:analysis` never import each other — `scope:events` only
- `scope:events` libs import nothing outside `scope:events`
- New field on DeviceBatch → coordinate with device firmware team
- New field on TelemetryEvent/NotificationEvent → update all consumers in same PR
- `NotificationType` closed enum — adding a value requires updating the rules engine
- All new fields nullable — device may not have the sensor
- `recordedAt` = device clock (source of truth) · `receivedAt` = server audit
