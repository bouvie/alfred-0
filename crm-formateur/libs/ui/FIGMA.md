# Convention Figma ↔ Design System — CRM Formateur

## Préfixe
- **CSS tokens :** `--ft-*`
- **Sélecteur Angular :** `ft-*`
- **BEM prefix :** (aucun — BEM standard)

## Nommage Figma
`composant/variant/état` en kebab-case strict.
Ex: `button/primary/default`, `badge/success/default`, `kanban-card/default/hover`

## Description field format
```
selector: ft-[composant]
status: stable | beta | planned | deprecated
tokens: --ft-[token], ...
storybook: /story/design-system-components-[nom]--default
inputs: [input1: type], [input2: type], ...
```

## Tokens source de vérité
`libs/ui/src/lib/tokens/variables.css`

## Radius par rôle
| Rôle | Token | Valeur |
|---|---|---|
| Boutons actions | `--ft-radius-xl` | 16px |
| FAB circulaire | `--ft-radius-full` | 9999px |
| Inputs, selects | `--ft-radius-xl` | 16px |
| Cards génériques | `--ft-radius-lg` | 12px |
| Data cards (metric, chart) | `--ft-radius-md` | 8px |
| Pills, badges, tags | `--ft-radius-full` | 9999px |
| Nav items | `--ft-radius-md` | 8px |
| Icon-wraps | `--ft-radius-lg` | 12px |
| Kanban colonnes | `--ft-radius-lg` | 12px |
| Tooltips | `--ft-radius-md` | 8px |
