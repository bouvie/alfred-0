# observability

## Stack
Pino (`nestjs-pino`) · Sentry (NestJS + Angular) · OpenTelemetry → Prometheus + Tempo · Grafana + Loki

## Pino setup

```typescript
// app.module.ts
LoggerModule.forRootAsync({ useFactory: (config) => ({
  pinoHttp: {
    level: config.get('NODE_ENV') === 'production' ? 'info' : 'debug',
    transport: config.get('NODE_ENV') !== 'production' ? { target: 'pino-pretty' } : undefined,
    redact: { paths: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.accessToken'], remove: true },
    customProps: (req) => ({ tenantId: req.user?.tenantId, userId: req.user?.id }),
  },
}) })
```

Logs = structured objects. Never string concatenation.
```typescript
this.logger.log({ msg: 'User created', userId, tenantId }); // ✓
this.logger.log('User created: ' + userId);                 // ✗
```

## Sentry NestJS

```typescript
// main.ts — before bootstrap
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [Sentry.prismaIntegration()],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});
// app.module.ts
{ provide: APP_FILTER, useClass: SentryGlobalFilter }
```

## Sentry Angular

```typescript
Sentry.init({
  dsn: environment.sentryDsn,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration({ maskAllText: true })],
  replaysOnErrorSampleRate: 1.0,
});
// app.config.ts
{ provide: ErrorHandler, useValue: Sentry.createErrorHandler() }
```

`maskAllText: true` — mandatory (GDPR).
Source maps uploaded in CI deploy job.

## OpenTelemetry

```typescript
// tracing.ts — FIRST import in main.ts
const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT }),
  metricReader: new PrometheusExporter({ port: 9464 }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();
```

Custom metrics:
```typescript
const meter = metrics.getMeter('app');
const counter = meter.createCounter('user_registrations_total');
counter.add(1, { tenantId });
```

## Grafana stack (Docker Compose prod)

Services: `loki` · `promtail` · `prometheus` · `tempo` · `grafana`
Datasources provisioned via `services/grafana/datasources.yml` — never configured manually.
Grafana access: private only (never public-facing).

Essential dashboard panels:
- HTTP requests/s · P99 latency · 5xx rate
- Business counters (registrations, payments)
- CPU/RAM per container · DB connections
- Error log stream (Loki: `{level="error"}`)

## Alerts

```yaml
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
  for: 2m
- alert: HighLatency
  expr: histogram_quantile(0.99, http_request_duration_ms_bucket) > 2000
  for: 5m
- alert: DBConnectionsHigh
  expr: pg_stat_activity_count > 80
  for: 1m
```

## Rules
- `tracing.ts` first import — before NestJS bootstrap
- Pino JSON in prod, `pino-pretty` in dev only
- `redact` mandatory — no credentials/tokens in logs
- `replaysOnErrorSampleRate: 1.0` — full replay on errors
- Sentry environment: `'production'` in prod, never `'development'` in prod
- Custom metrics on every significant business operation
