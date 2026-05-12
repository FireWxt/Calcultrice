# Calculatrice Angular - Frontend

Application frontend moderne avec Angular 17, communiquant avec l'API Backend.

## Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   └── calculator.service.ts    # Service de communication API
│   │   ├── app.component.ts             # Composant principal
│   │   ├── app.component.html           # Template
│   │   ├── app.component.scss           # Styles
│   │   ├── app.config.ts                # Configuration Angular
│   │   └── app.routes.ts                # Routes
│   ├── index.html                       # Page HTML
│   ├── main.ts                          # Point d'entrée
│   └── styles.scss                      # Styles globaux
├── Dockerfile                           # Build multi-stage (Node.js + Nginx)
├── nginx.conf                           # Configuration Nginx
├── angular.json                         # Configuration Angular CLI
├── tsconfig.json                        # Configuration TypeScript
└── package.json                         # Dépendances
```

## Fonctionnalités

- ✅ Composant Angular standalone
- ✅ Two-way data binding avec FormsModule
- ✅ Service d'API avec HttpClient
- ✅ Gestion des erreurs et loading states
- ✅ Vérification de la connexion backend
- ✅ Interface responsive et moderne avec SCSS
- ✅ Build multi-stage Docker

## Développement local

### Prérequis
- Node.js 18+
- npm

### Installation

```bash
cd frontend
npm install
```

### Développement

```bash
npm start
# http://localhost:4200
```

### Build

```bash
npm run build
# Output: dist/browser/
```

## Docker

Le Dockerfile utilise un build multi-stage:

1. **Stage 1 (Builder)**: Construit l'app Angular avec Node.js
2. **Stage 2 (Runtime)**: Sert l'app avec Nginx

## Dépendances principales

- `@angular/core` - Framework Angular
- `@angular/forms` - Gestion des formulaires
- `@angular/common/http` - Client HTTP
- `rxjs` - Programmation réactive

## Configuration du service API

Le service `CalculatorService` utilise automatiquement:
- Protocol: `window.location.protocol`
- Hostname: `window.location.hostname`
- Port: `3000` (Backend API)

## Auteur

Créé en 2026
