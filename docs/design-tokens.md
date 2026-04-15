# Design Tokens — CRM Formateur (Direction "Cockpit")
_Généré le 2026-04-15 — Source de vérité pour design-system_

## Identité visuelle

**Nom de code :** Cockpit  
**Préfixe DS :** `ft` (formateur)  
**Mode :** Dark exclusif  
**Accent :** Cyan électrique — outil de pilotage, focus, données

---

## Color — Élévation (6 niveaux)

| Token | Valeur | Rôle |
|---|---|---|
| `--ft-bg-deep` | `#080C12` | Fond absolu, derrière tout |
| `--ft-bg` | `#0F1419` | Fond standard des vues |
| `--ft-surface` | `#151E2A` | Cards, panneaux niveau 1 |
| `--ft-surface-2` | `#1C2A3A` | Inputs filled, dropdown bg |
| `--ft-surface-3` | `#243347` | Modaux, sidebars, drawers |
| `--ft-surface-4` | `#2C3D55` | Overlays temporaires, toasts |

---

## Color — Rôles sémantiques (6 états chacun)

### Primary — Cyan électrique
| Token | Valeur | Rôle |
|---|---|---|
| `--ft-primary` | `#00C8E8` | Teinte de base |
| `--ft-primary-text` | `#0A1A20` | Texte sur fond primary |
| `--ft-primary-hover` | `rgba(0,200,232,0.10)` | Hover |
| `--ft-primary-pressed` | `rgba(0,200,232,0.20)` | Pressed |
| `--ft-primary-focus` | `rgba(0,200,232,0.35)` | Focus ring |
| `--ft-primary-subtle` | `rgba(0,200,232,0.06)` | Fond très léger |

### Success — Vert jade
| Token | Valeur | Rôle |
|---|---|---|
| `--ft-success` | `#10C07A` | Teinte de base |
| `--ft-success-text` | `#0A1A14` | Texte sur fond success |
| `--ft-success-hover` | `rgba(16,192,122,0.10)` | Hover |
| `--ft-success-pressed` | `rgba(16,192,122,0.20)` | Pressed |
| `--ft-success-focus` | `rgba(16,192,122,0.35)` | Focus ring |
| `--ft-success-subtle` | `rgba(16,192,122,0.06)` | Fond très léger |

### Warning — Ambre doux
| Token | Valeur | Rôle |
|---|---|---|
| `--ft-warning` | `#F5A623` | Teinte de base |
| `--ft-warning-text` | `#1A1200` | Texte sur fond warning |
| `--ft-warning-hover` | `rgba(245,166,35,0.10)` | Hover |
| `--ft-warning-pressed` | `rgba(245,166,35,0.20)` | Pressed |
| `--ft-warning-focus` | `rgba(245,166,35,0.35)` | Focus ring |
| `--ft-warning-subtle` | `rgba(245,166,35,0.06)` | Fond très léger |

### Danger — Rouge corail
| Token | Valeur | Rôle |
|---|---|---|
| `--ft-danger` | `#E8445A` | Teinte de base |
| `--ft-danger-text` | `#1A0408` | Texte sur fond danger |
| `--ft-danger-hover` | `rgba(232,68,90,0.10)` | Hover |
| `--ft-danger-pressed` | `rgba(232,68,90,0.20)` | Pressed |
| `--ft-danger-focus` | `rgba(232,68,90,0.35)` | Focus ring |
| `--ft-danger-subtle` | `rgba(232,68,90,0.06)` | Fond très léger |

### Info — Bleu ardoise
| Token | Valeur | Rôle |
|---|---|---|
| `--ft-info` | `#4A90D9` | Teinte de base |
| `--ft-info-text` | `#08101A` | Texte sur fond info |
| `--ft-info-hover` | `rgba(74,144,217,0.10)` | Hover |
| `--ft-info-pressed` | `rgba(74,144,217,0.20)` | Pressed |
| `--ft-info-focus` | `rgba(74,144,217,0.35)` | Focus ring |
| `--ft-info-subtle` | `rgba(74,144,217,0.06)` | Fond très léger |

---

## Color — Texte

| Token | Valeur | Rôle |
|---|---|---|
| `--ft-text` | `#E8EDF2` | Texte principal |
| `--ft-text-secondary` | `#8B9BB4` | Texte secondaire, descriptions |
| `--ft-text-disabled` | `#4A5568` | Texte désactivé |
| `--ft-text-inverse` | `#0F1419` | Texte sur fond clair |

## Color — Bordures

| Token | Valeur | Rôle |
|---|---|---|
| `--ft-border` | `rgba(255,255,255,0.08)` | Bordure standard |
| `--ft-border-strong` | `rgba(255,255,255,0.16)` | Bordure accentuée |
| `--ft-border-focus` | `var(--ft-primary)` | Bordure focus/active |

---

## Spacing — Scale 4px base

| Token | Valeur |
|---|---|
| `--ft-space-1` | `4px` |
| `--ft-space-2` | `8px` |
| `--ft-space-3` | `12px` |
| `--ft-space-4` | `16px` |
| `--ft-space-5` | `20px` |
| `--ft-space-6` | `24px` |
| `--ft-space-8` | `32px` |
| `--ft-space-10` | `40px` |
| `--ft-space-12` | `48px` |
| `--ft-space-16` | `64px` |

---

## Typography — Scale K-10

**Font family :** `'Inter', system-ui, sans-serif`

| Token style | Taille | Poids | Letter-spacing | Rôle |
|---|---|---|---|---|
| `display` | `72px` | `400` | `-5%` | Héros onboarding |
| `h1` | `32px` | `700` | `-2%` | Titre de page |
| `h2` | `24px` | `600` | `-1%` | Titre de section |
| `h3` | `20px` | `600` | `0` | Sous-titre, card title |
| `body-lg` | `18px` | `400` | `0` | Corps lecture |
| `body` | `15px` | `400` | `0` | UI standard |
| `body-sm` | `13px` | `400` | `0` | Descriptions, secondaire |
| `label` | `11px` | `700` | `+1.5px` | UPPERCASE — étiquettes |
| `caption` | `10px` | `400` | `+0.5px` | Timestamps, métadonnées |
| `data-lg` | `36px` | `800` | `-3%` | Métrique hero |
| `data-md` | `28px` | `700` | `-2%` | Métrique standard |
| `data-sm` | `20px` | `600` | `-1%` | Métrique compacte |
| `mono` | `13px` | `400` | `0` | Codes, IDs |

---

## Radius

| Token | Valeur | Rôle |
|---|---|---|
| `--ft-radius-sm` | `4px` | Badges, chips internes |
| `--ft-radius-md` | `8px` | Nav items, tooltips, data cards |
| `--ft-radius-lg` | `12px` | Cards génériques, icon-wraps |
| `--ft-radius-xl` | `16px` | Boutons, inputs, modaux |
| `--ft-radius-2xl` | `20px` | Grands boutons |
| `--ft-radius-full` | `9999px` | FAB, pills, badges |

---

## Shadow

| Token | Valeur | Rôle |
|---|---|---|
| `--ft-shadow-sm` | `0 1px 3px rgba(0,0,0,0.4)` | Card, input |
| `--ft-shadow-md` | `0 4px 12px rgba(0,0,0,0.5)` | Dropdown, tooltip |
| `--ft-shadow-lg` | `0 8px 32px rgba(0,0,0,0.6)` | Modal, bottom-sheet |
| `--ft-shadow-xl` | `0 16px 48px rgba(0,0,0,0.7)` | FAB, toast |
| `--ft-shadow-glow-primary` | `0 0 12px 2px rgba(0,200,232,0.15)` | Halo actif primary |
| `--ft-shadow-glow-success` | `0 0 12px 2px rgba(16,192,122,0.15)` | Halo actif success |
| `--ft-shadow-glow-danger` | `0 0 12px 2px rgba(232,68,90,0.15)` | Halo actif danger |

---

## Motion

| Token | Valeur |
|---|---|
| `--ft-duration-instant` | `0ms` |
| `--ft-duration-fast` | `120ms` |
| `--ft-duration-normal` | `200ms` |
| `--ft-duration-slow` | `300ms` |
| `--ft-duration-slower` | `500ms` |
| `--ft-duration-lazy` | `800ms` |
| `--ft-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--ft-ease-decelerate` | `cubic-bezier(0, 0, 0, 1)` |
| `--ft-ease-accelerate` | `cubic-bezier(0.3, 0, 1, 1)` |
| `--ft-ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

---

## Glassmorphisme

| Token | Valeur | Rôle |
|---|---|---|
| `--ft-glass-nav` | `rgba(21,30,42,0.65)` + `blur(20px)` | Bottom-Nav, FAB |
| `--ft-glass-sheet` | `rgba(21,30,42,0.70)` + `blur(16px)` | Bottom-Sheet handle |
| `--ft-glass-overlay` | `rgba(8,12,18,0.80)` + `blur(24px)` | Scrim derrière modaux |
| `--ft-glass-border` | `rgba(255,255,255,0.08)` | Bordure glass |

---

## Composants prioritaires V1

1. **KanbanBoard** — pipeline principal (drag & drop, colonnes libres)
2. **ContactCard** — fiche contact avec statut et historique
3. **SessionSlot** — créneau de formation (date, client, durée, statut)
4. **MetricCard** — indicateur chiffré (reporting passif)
5. **TopBar** — navigation et identité utilisateur
6. **SideNav** — navigation principale desktop

_Handoff → design-system pour implémentation Angular/CSS_
