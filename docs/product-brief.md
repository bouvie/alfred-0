# Product Brief — CRM Formateur Indépendant
_2026-04-15_

## The problem
Un formateur indépendant gère manuellement son pipeline commercial, le suivi de ses clients et ses créneaux de formation via plusieurs outils disparates (suites Microsoft et Google). Il n'a aucune vue consolidée de son activité et ne peut pas piloter sereinement son développement commercial.

## Users
| User type | Primary need | Current workaround |
|---|---|---|
| Formateur (admin) | Vue d'ensemble de l'activité commerciale et des sessions | Fichiers Excel, notes, apps multiples |
| Collaborateur | Accès partagé aux contacts et aux créneaux | Partage de fichiers ad hoc |

## Product vision
Le CRM est l'espace de travail unique du formateur indépendant. Il centralise tout ce qui touche au développement de son activité : les prospects qu'il suit, les clients qu'il accompagne, et les sessions de formation qu'il planifie. Là où d'autres CRM imposent un tunnel de vente rigide, celui-ci adopte une logique de kanban libre — chaque prospect avance à son rythme, sans workflow prédéfini, parce que c'est la réalité du terrain.

Le formateur et ses collaborateurs occasionnels partagent la même vue en temps réel. Plus de fichiers envoyés par email, plus de doublons, plus de version qui traîne. Chaque contact a son historique, chaque session a sa fiche, et l'ensemble forme un tableau de bord vivant de l'activité.

Le reporting n'est pas un module à part — c'est une conséquence naturelle de ce que le formateur saisit au quotidien. Taux de conversion, chiffre d'affaires, charge de sessions : les chiffres émergent sans effort supplémentaire, pour que le formateur puisse décider où concentrer son énergie.

## Core flows
1. **Suivi prospect** : ajouter un contact, le déplacer librement dans le kanban, consulter son historique
2. **Gestion client** : accéder à la fiche d'un client actif, voir ses sessions passées et à venir
3. **Planification de session** : créer un créneau de formation, l'associer à un client, le partager avec un collaborateur
4. **Vue collaborateur** : accéder au pipeline et aux créneaux sans configuration supplémentaire
5. **Reporting passif** : consulter les indicateurs clés sans saisie supplémentaire

## V1 scope
**Must have**
- Pipeline d'acquisition en kanban libre (colonnes personnalisables, drag & drop)
- Fiche contact avec historique des échanges et statut
- Gestion des créneaux de formation (création, association client, vue calendaire)
- Accès multi-utilisateurs avec rôles (admin / collaborateur)

**Nice to have**
- Tableau de bord reporting (CA, taux de conversion, activité par période)
- Vue des relances en attente (sans notification push)

**Out of scope V1**
- Facturation et génération de devis
- Intégration avec Microsoft 365 ou Google Workspace
- Application mobile native
- Automatisations et workflows de relance

## Success criteria
- Le formateur abandonne ses outils actuels (Excel, notes dispersées) dans les 4 semaines suivant le lancement
- Zéro perte d'information entre collaborateurs sur les prospects partagés
- Le formateur peut répondre en moins de 30 secondes à "où en est ce prospect ?"

## Constraints
- Utilisateurs non-techniques — l'interface doit être immédiatement compréhensible sans formation
- Accès collaborateurs occasionnels — pas de gestion RH complexe
- Pas d'intégration externe en V1 — import manuel accepté
