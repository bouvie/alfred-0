# devops-cloud

## Scope
VPS deployment — Docker Compose prod, GitHub Actions CI/CD, Caddy TLS, Watchtower, Capacitor APK build.
NOT: local dev (→ `local-devops`) · app code (→ respective app skills)

## File structure

```
docker/
  docker-compose.prod.yml
  .env.prod.example               never committed
  services/
    caddy/
      Caddyfile                   reverse proxy + TLS Let's Encrypt

apps/
  */Dockerfile                    runtime image only (dist/ copied from CI)

.github/workflows/
  deploy.yml                      build images + APK on push to main

.dockerignore                     excludes everything except dist/
```

## Production architecture

```
Internet
    └── :443 HTTPS/WSS ──→ Caddy ──→ api:3000

Docker internal network:
  api · ingest · analysis
  TimescaleDB · Redis · EMQX  (internal only)
  Watchtower  (polls registry every 5 min)
```

## VPS spec (reference)

| Spec | Value |
|---|---|
| Provider | Hetzner CX32 (or equivalent) |
| RAM / CPU | 8 GB / 4 vCPU |
| OS | Ubuntu 24.04 LTS |
| Firewall | ports 22, 80, 443 only |

## Env vars

Copy `docker/.env.prod.example` → `docker/.env.prod` on VPS (never committed):

```env
APP_DOMAIN=api.yourdomain.com
GITHUB_OWNER=your-github-username
DB_NAME=app
DB_USER=app
DB_PASSWORD=CHANGE_ME
CORS_ORIGIN=capacitor://localhost
```

## Initial deployment

```bash
# On VPS
git clone https://github.com/<owner>/<repo>.git /opt/app
cd /opt/app/docker
cp .env.prod.example .env.prod
# fill .env.prod

# Authenticate Watchtower to registry
echo $GITHUB_TOKEN | docker login ghcr.io -u <owner> --password-stdin

docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## CI/CD — GitHub Actions

Trigger: push to `main`

- **Job `docker`**: `nx build` all apps → `docker build` → push to GHCR
- **Job `apk`**: Angular build + Capacitor sync + Gradle → APK uploaded to GitHub Release

Watchtower polls GHCR every 5 min, restarts containers on new image.

## Dockerfile strategy

Build outside Docker (CI), runtime image only:

```dockerfile
# nx build → dist/apps/<name>/
FROM node:22-alpine
COPY dist/apps/<name>/ .
RUN npm install --omit=dev --ignore-scripts
CMD ["node", "main.js"]
```

API image also embeds Angular frontend:
```
dist/apps/frontend/browser/ → /frontend/browser/
# ServeStaticModule: join(__dirname, '../frontend/browser')
```

## Rules
- `.env.prod` never committed — in `.gitignore`
- EMQX not exposed externally — internal only
- TLS automatic via Caddy + Let's Encrypt — domain must point to VPS before first start
- `CORS_ORIGIN=capacitor://localhost` for Capacitor Android app
- Watchtower reads `/root/.docker/config.json` for registry auth
- APK signing: add keystore config when available (debug build until then)
