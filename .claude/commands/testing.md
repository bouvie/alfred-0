# testing

## Stack
Angular unit: Vitest + `@testing-library/angular`
NestJS unit: Vitest + mocks
NestJS integration: Vitest + real PostgreSQL (never SQLite)
E2E: Playwright + Page Object Model

## Pyramid

```
e2e (Playwright)        critical paths only
integration (NestJS)    services + DB queries
unit (Vitest)           components + pure logic
```

Test observable behavior. Never test implementation details (private methods, internal state).

## Angular unit

```typescript
// Query by role/text — never By.css or class selectors
await render(ButtonComponent, { inputs: { variant: 'primary' }, template: '<app-btn>Go</app-btn>' });
screen.getByRole('button', { name: 'Go' });
fireEvent.click(button);
expect(spy).toHaveBeenCalledOnce();
```

`@testing-library/jest-dom` matchers: `toBeInTheDocument()` · `toBeDisabled()` · `toBeVisible()`

## NestJS unit

```typescript
const module = await Test.createTestingModule({
  providers: [UsersService, { provide: PrismaService, useValue: { user: { findFirst: vi.fn() } } }],
}).compile();
```

## NestJS integration (real DB)

```typescript
// One module instance for the whole file
beforeAll(async () => { /* boot NestJS with DatabaseModule */ });
afterAll(async () => { await prisma.$disconnect(); });
beforeEach(async () => { await prisma.$transaction([prisma.user.deleteMany()]); }); // clean between tests
```

```env
# .env.test
DATABASE_URL=postgresql://user:password@localhost:5432/appdb_test
```

`vitest.config.ts`: `pool: 'forks'`, `poolOptions: { forks: { singleFork: true } }` — one DB, sequential.

## GraphQL integration

```typescript
await request(app.getHttpServer())
  .post('/graphql')
  .set('Cookie', `access_token=${token}`)
  .send({ query: `query { entities { id } }` })
  .expect(200);
```

## Playwright

```typescript
// playwright.config.ts
webServer: { command: 'nx serve app', url: 'http://localhost:4200' }
projects: [Desktop Chrome, Pixel 5]
retries: process.env.CI ? 2 : 0
```

Page Object pattern:
```typescript
export class AuthPage {
  async login(email: string, password: string) {
    await this.page.goto('/login');
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
    await this.page.waitForURL('/dashboard');
  }
}
```

E2E covers: login/logout/refresh · onboarding · payment flow · primary CRUD · critical notifications.
Never duplicate in E2E what's already covered in integration.

## Coverage thresholds

| Layer | Lines | Functions | Branches |
|---|---|---|---|
| `libs/ui` | 80% | 80% | 70% |
| NestJS services | 75% | 75% | 65% |
| Resolvers | 70% | 70% | 60% |

## CI

```yaml
services:
  postgres: { image: timescale/timescaledb:latest-pg16 }
steps:
  - run: prisma migrate deploy
  - run: nx run-many --target=test --all --coverage
  - run: nx e2e --reporter=github
```

## Rules
- `@testing-library/angular`: queries by role, label, text — never CSS class
- Real DB for integration — never mock Prisma
- `beforeEach` cleans data — no test interdependency
- `data-testid` last resort — prefer accessibility queries
- No `test.only` or `describe.only` committed
- No `page.waitForTimeout()` in Playwright — use `waitForURL` or `waitForSelector`
- `vi.fn()` not `jest.fn()`
