# Local Setup — CRM Formateur

## Prérequis
- Docker Desktop
- Node.js 22+
- npm 10+

## Démarrage en 3 commandes

```bash
# 1. Démarrer la base de données
npm run db:up

# 2. Appliquer les migrations
npm run db:migrate

# 3. Seed initial (données d'exemple)
npm run db:seed
```

## Développement

```bash
# Angular (port 4200)
npx nx serve web

# NestJS API (port 3000)
npx nx serve @org/api

# Les deux en parallèle
npx nx run-many --target=serve --projects=web,@org/api
```

## GraphQL Playground
http://localhost:3000/graphql

## Variables d'environnement
Copier `.env.example` → `.env` (déjà configuré pour le Docker Compose local)

## Outils DB
```bash
# Adminer (UI PostgreSQL)
npm run db:tools
# → http://localhost:8080

# Prisma Studio
npm run db:studio
```

## Stack local

| Service | Port | Usage |
|---|---|---|
| Angular | 4200 | Frontend |
| NestJS API | 3000 | Backend GraphQL |
| PostgreSQL | 5432 | Base de données |
| Adminer | 8080 | UI DB (profil tools) |

## Migrations

```bash
# Créer une nouvelle migration
npx prisma migrate dev --name <description> --schema=libs/database/prisma/schema.prisma

# Appliquer en prod
npx prisma migrate deploy --schema=libs/database/prisma/schema.prisma

# Regénérer le client Prisma après changement de schema
npm run db:generate
```
