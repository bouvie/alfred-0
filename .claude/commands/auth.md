# auth

## Stack
Keycloak (OIDC, social login, self-hosted) · NestJS Passport · Angular interceptors
Tokens: httpOnly cookies · Capacitor: Secure Storage
Service-to-service: hashed API keys (bcrypt)

## JWT strategy

```typescript
new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.['access_token'] ?? null]),
  secretOrKeyProvider: passportJwtSecret({ jwksUri: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/certs` }),
})
validate(payload): AuthUser {
  return { id: payload.sub, email: payload.email, roles: payload.realm_access?.roles ?? [], tenantId: payload['tenant_id'] };
}
```

## Cookie rules

`access_token`: httpOnly · secure · sameSite:strict · maxAge:900
`refresh_token`: httpOnly · secure · sameSite:strict · path:/auth/refresh · maxAge:604800
Never `localStorage`. Never `sessionStorage`.

## Refresh flow (Angular interceptor)

```typescript
catchError((err: HttpErrorResponse) => {
  if (err.status === 401 && !req.url.includes('/auth/refresh'))
    return inject(AuthService).refresh().pipe(switchMap(() => next(req)));
  return throwError(() => err);
})
```

## Social login

Keycloak handles OAuth2 Authorization Code + PKCE.
Angular → redirect to Keycloak with `kc_idp_hint: 'google'|'github'|'apple'`
Keycloak → callback NestJS `/auth/callback/:provider` → set cookies → redirect to app.
Providers configured in Keycloak admin UI only.

## OAuth as API consumer

Third-party API access (Google Calendar, GitHub, Slack, Stripe Connect):

```prisma
model OAuthConnection {
  userId    String
  provider  OAuthProvider
  accessToken  String   // AES-256-GCM encrypted
  refreshToken String?  // AES-256-GCM encrypted
  expiresAt DateTime
  scopes    String[]
  @@unique([userId, provider])
}
```

Token refresh: proactive at `expiresAt - 5min`. Never on 401.
Tokens → always encrypted (AES-256-GCM). Key in env vars, never in DB.
State param → always validate CSRF on callback.
Scopes → minimal required only. Document in `docs/decisions/`.

## RBAC

Roles in Keycloak realm. Read from `payload.realm_access.roles`.

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>('roles', [ctx.getHandler(), ctx.getClass()]);
    return !roles?.length || roles.some(r => ctx.switchToHttp().getRequest().user.roles.includes(r));
  }
}
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
```

Angular directive: `hasRole` input → show/hide via `ViewContainerRef`.

## Multi-tenant

`tenant_id` → custom Keycloak claim (Mapper in admin UI).
`TenantGuard`: reject tokens without `tenantId`.
Prisma middleware: auto-inject `tenantId` in all `where` clauses.

## API keys

Generate: `sk_${crypto.randomBytes(32).toString('hex')}` → bcrypt hash stored, raw shown once.
Validate: lookup by prefix (first 16 chars indexed) → bcrypt compare.

## Rules
- `@Req()/@Res()` in resolvers → ✗ · use `@Context()`
- `refresh_token` cookie: `path:/auth/refresh` only
- JWKS validation, never HS256 in prod
- `revokeToken()` on logout — not just cookie clear
- OAuth consumer tokens encrypted — never plaintext in DB
