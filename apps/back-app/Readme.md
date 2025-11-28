# Express TypeScript Template

Template basique pour le développement backend avec Express en TypeScript.

## Technologies

- **Express** - Framework web pour Node.js
- **TypeScript** - JavaScript avec typage statique
- **ESLint** - Analyse statique du code
- **Prettier** - Formatage automatique du code
- **Nodemon** - Rechargement automatique en développement

## Prérequis

- Node.js (v18+)
- pnpm (v10+)

## Installation

```bash
pnpm install
```

## Utilisation

### Mode développement

```bash
pnpm run dev
```

Le serveur démarre sur http://localhost:3000

### Build production

```bash
pnpm run build
pnpm start
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm run dev` | Lance le serveur en mode développement |
| `pnpm run build` | Compile TypeScript vers JavaScript |
| `pnpm start` | Lance le serveur compilé |
| `pnpm run lint` | Vérifie le code avec ESLint |
| `pnpm run lint:fix` | Corrige automatiquement les erreurs |
| `pnpm run format` | Formate le code avec Prettier |

## Structure

```
.
├── src/
│   └── index.ts          # Point d'entrée
├── dist/                 # Fichiers compilés
├── .prettierrc           # Config Prettier
├── .prettierignore
├── .gitignore
├── eslint.config.js      # Config ESLint
├── tsconfig.json         # Config TypeScript
└── package.json
```

## API

**GET /** - Retourne "hello" (Status 200)

## Configuration

Changez le port avec la variable d'environnement `PORT`:

```bash
PORT=8080 pnpm run dev
```

## Licence

ISC
