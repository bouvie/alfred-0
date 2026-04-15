---
decision: Standard CRUD — Nx monorepo Angular + NestJS + GraphQL + PostgreSQL
options:
  - IoT pipeline (écarté — pas de devices/capteurs)
  - SaaS platform (écarté — mono-tenant, pas d'organisations multiples)
  - Realtime dashboard (écarté — pas de données temps-réel requises)
  - Standard CRUD (retenu — entités stables, pipeline kanban, sessions)
rationale: Le CRM Formateur est un outil de gestion d'entités (contacts, sessions, créneaux) sans contrainte temps-réel ni multi-tenant. Standard CRUD est le pattern le plus simple qui couvre tous les besoins V1. PostgreSQL pour les données relationnelles (contacts → sessions → créneaux). GraphQL pour la flexibilité des queries côté Angular.
---
