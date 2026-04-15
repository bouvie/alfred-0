# saas-patterns

## Scope
BullMQ · Resend · Stripe · Typesense · multi-tenancy patterns · i18n · PDF · PostHog

## BullMQ

Uses existing Redis. `@Global()` `QueueModule`.

```typescript
BullModule.forRootAsync({ useFactory: (config) => ({
  connection: { host: config.get('REDIS_HOST'), port: config.get('REDIS_PORT') },
  defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: { count: 100 } },
}) })
```

Job types defined in `jobs/<domain>.jobs.ts` — centralize queue names + payload types.

```typescript
// Producer
await this.emailQueue.add('welcome', { userId, email } satisfies WelcomeJob, { jobId: `welcome-${userId}` });

// Consumer
@Processor(EMAIL_QUEUE)
export class EmailProcessor {
  @Process('welcome') async handle(job: Job<WelcomeJob>) { await this.email.sendWelcome(job.data); }
  @OnQueueFailed() onFail(job: Job, err: Error) { this.logger.error({ msg: 'Job failed', jobId: job.id, err }); }
}
```

Jobs must be **idempotent**. `jobId` keyed on entity — deduplication.
CRON: `queue.add('task', {}, { repeat: { pattern: '0 3 * * *' } })` in `onModuleInit`.

## Resend + React Email

```typescript
await resend.emails.send({ from: this.from, to, subject, react: WelcomeEmail({ name }) });
```

Templates: `libs/email/src/lib/templates/*.email.tsx` — React Email components.
Preview: `npx email dev` locally.

## Stripe

```typescript
// Checkout session
await stripe.checkout.sessions.create({ customer: tenant.stripeCustomerId, mode: 'subscription', line_items: [{ price: priceId, quantity: 1 }] });

// Customer portal
await stripe.billingPortal.sessions.create({ customer: tenant.stripeCustomerId, return_url: returnUrl });
```

Webhooks — raw body mandatory:
```typescript
@Post('webhooks/stripe')
@HttpCode(200)
async handle(@RawBody() raw: Buffer, @Headers('stripe-signature') sig: string) {
  const event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  switch (event.type) { case 'checkout.session.completed': ... }
}
```

Fastify body parser: exclude webhook route from JSON parsing — receive as Buffer.
Dev: `stripe listen --forward-to localhost:3000/billing/webhooks/stripe`

Schema: `stripeCustomerId` on `Tenant` model.
Plan gating: `PlanGuard` + `@RequiresPlan(Plan.PRO)` on premium endpoints.

## Typesense

```typescript
await client.collections('entities').documents().search({
  q: query,
  query_by: 'name,description',
  filter_by: `tenantId:=${tenantId} && active:=true`,  // tenant isolation mandatory
  per_page: 20,
});
```

`ensureCollections()` in `onModuleInit` — idempotent schema creation.
Index on write events: `await typesense.collections('entities').documents().upsert(doc)`.

## Multi-tenancy plan gating

```typescript
const PLAN_HIERARCHY = { FREE: 0, PRO: 1, ENTERPRISE: 2 };
canActivate: PLAN_HIERARCHY[tenant.plan] >= PLAN_HIERARCHY[requiredPlan]
```

## i18n

```typescript
// app.config.ts
TranslateModule.forRoot({ loader: { provide: TranslateLoader, useFactory: (http) => new TranslateHttpLoader(http, '/assets/i18n/', '.json') } })
```

```html
{{ 'AUTH.LOGIN' | translate }}
{{ 'GREETING' | translate:{ name: user.name } }}
```

All user-facing strings → `| translate`. Zero hardcoded text in templates.
Files: `assets/i18n/en.json` · `assets/i18n/fr.json` etc.

## PDF (Puppeteer)

```typescript
// Single Browser instance per process — reuse, never create per request
private browser: Browser | null = null;
async generate(html: string): Promise<Buffer> {
  const page = await (await this.getBrowser()).newPage();
  try { await page.setContent(html, { waitUntil: 'networkidle0' }); return page.pdf({ format: 'A4', printBackground: true }); }
  finally { await page.close(); }
}
```

Heavy PDFs → BullMQ job, never block HTTP request.
Docker args: `--no-sandbox --disable-setuid-sandbox`

## PostHog

NestJS: `posthog.capture({ distinctId: userId, event, properties })` · `shutdown()` in `OnModuleDestroy`.
Angular: `posthog.identify(userId, properties)` after login · `posthog.capture(event)` on key actions.
Feature flags: `posthog.isFeatureEnabled(flag)` → conditional UI rendering.
Separate `POSTHOG_API_KEY` per environment.

## Rules
- BullMQ jobs idempotent — `jobId` keyed on entity
- Stripe webhook: raw body + signature verification, always
- Typesense `filter_by` always includes `tenantId:=<id>`
- `PlanGuard` on all premium endpoints — not just UI
- PDF via job — never synchronous in HTTP handler
- `| translate` on 100% of user-facing strings
- PostHog `shutdown()` before process exit
