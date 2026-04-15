# data-model

## Decision matrix

| Need | Store |
|---|---|
| Structured entities, relations, transactions | PostgreSQL + Prisma |
| Time-series, metrics, IoT | TimescaleDB (→ `iot-data-model`) |
| Flexible documents, variable schema | MongoDB + Mongoose |
| Cache, queues, pub/sub | Redis |
| Full-text search | Typesense (→ `saas-patterns`) |

Default: PostgreSQL. Migrate to MongoDB only when schema variability is real.

## PostgreSQL + Prisma

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}

@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class DatabaseModule {}
```

Schema conventions:
```prisma
model Entity {
  id        String   @id @default(cuid())   // cuid — never auto-increment
  tenantId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([tenantId])
  @@map("entities")                          // explicit snake_case table name
}
```

- `cuid()` for all IDs
- `tenantId` + `@@index([tenantId])` on every multi-tenant model
- `@@map()` explicit on every model
- New fields → nullable by default
- `$transaction([...])` for multi-table writes

Migrations:
```bash
prisma migrate dev --name <description>   # dev: generates + applies
prisma migrate deploy                      # prod: applies pending
```
Never edit an applied migration file. Create a corrective migration instead.

Multi-tenancy RLS:
```sql
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON entities USING (tenant_id = current_setting('app.current_tenant_id'));
```

```typescript
// Prisma middleware sets tenant on every request
prisma.$use(async (params, next) => {
  const tenantId = asyncLocalStorage.getStore()?.tenantId;
  if (tenantId) await prisma.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`;
  return next(params);
});
```

## MongoDB + Mongoose

```typescript
@Schema({ timestamps: true, collection: '<name>' })
export class Entity {
  @Prop({ required: true, index: true }) tenantId: string;
  @Prop({ type: Object }) attributes: Record<string, unknown>;
}
export const EntitySchema = SchemaFactory.createForClass(Entity);
EntitySchema.index({ tenantId: 1, active: 1 });
```

- `.lean()` on all read queries — always
- `findOneAndUpdate` with `{ new: true, lean: true }` for updates
- `MongooseModule.forFeature()` per domain lib, not global

## Nx lib structure

```
libs/
  database/               PrismaService (@Global)
    prisma/schema.prisma
    prisma/migrations/
  <domain>-data-access/   one lib per domain
    src/lib/<domain>.service.ts
    src/lib/<domain>.module.ts
```

`type:data-access` → never imports `type:ui`.

## Rules
- `tenantId` in every PostgreSQL `where` — no cross-tenant fetch
- Committed migration files are immutable
- `.lean()` on every Mongoose read
- `DatabaseModule` imported once in `AppModule` (global)
- MongoDB `_id` → mapped to `id: string` before GraphQL exposure
