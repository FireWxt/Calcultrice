# Architecture et Décisions Techniques

## Vue d'ensemble

Cette application est une calculatrice web avec une architecture microservices moderne:

```
┌─────────────────────────────┐
│  Frontend (Angular 17)      │ Port 80 (Nginx)
│  - Standalone Components    │
│  - Two-way Data Binding     │
│  - RxJS/HttpClient          │
└──────────────┬──────────────┘
               │ REST API
               ↓
┌─────────────────────────────┐
│  Backend (Express.js)       │ Port 3000
│  - REST Endpoints           │
│  - CORS Enabled             │
│  - Health Checks            │
└─────────────────────────────┘
```

## Frontend - Angular 17

### Pourquoi Angular?

- **Standalone Components**: Pas besoin de NgModule, plus simple
- **TypeScript**: Type-safe, meilleur DX
- **Built-in features**: Routing, HTTP, Forms
- **Performance**: AOT compilation, tree-shaking
- **Scalabilité**: Facile d'ajouter des features

### Structure Angular

```
src/
├── app/
│   ├── services/
│   │   └── calculator.service.ts    # Communication API
│   ├── app.component.ts             # Composant principal
│   ├── app.component.html           # Template
│   ├── app.component.scss           # Styles
│   ├── app.config.ts                # Configuration
│   └── app.routes.ts                # Routes
├── main.ts                          # Bootstrap
└── styles.scss                      # Styles globaux
```

### Composant App

- **Standalone**: `standalone: true`
- **Imports**: `CommonModule`, `FormsModule`
- **Services**: Injecte `CalculatorService`
- **State**: Variables locales pour `num1`, `num2`, `operation`, `result`, `error`

### Service API

- Détecte automatiquement l'URL backend
- Utilise `HttpClient` avec `withCors()`
- Gère les erreurs HTTP

### Build Multi-stage Docker

```dockerfile
# Stage 1: Build avec Node.js
# - npm install
# - ng build --prod

# Stage 2: Runtime avec Nginx
# - Copie dist/ depuis stage 1
# - Sert les fichiers statiques
```

**Avantages:**
- Image finale petite (Nginx only)
- Pas de Node.js dans la production
- Compilation optimisée

## Backend - Express.js

### Routes

- `POST /calculate` - Effectue un calcul
- `GET /health` - Vérification de santé

### Middleware

- **CORS**: Accepte requêtes du frontend
- **JSON**: Parse les requêtes JSON

### Validations

- Vérification des opérateurs
- Protection division par zéro

## Docker & Orchestration

### Docker Compose

Deux services coordonnés:
1. **Backend**: Build depuis `./backend`
2. **Frontend**: Build depuis `./frontend` (multi-stage)

### Réseau

- Les deux services sur le réseau `calculatrice-network`
- Frontend communique avec backend via hostname `backend:3000`
- Le frontend expose le port 80 (Nginx)
- Le backend expose le port 3000

### Health Checks

- Backend: Vérification HTTP `/health`
- Frontend attend que backend soit healthy avant démarrage

## Communication Frontend-Backend

### Flow

1. Utilisateur remplit le formulaire
2. Click "Calculer" ou Enter
3. Frontend valide les entrées
4. `CalculatorService.calculate()` envoie POST à l'API
5. Backend traite et retourne le résultat
6. Frontend affiche le résultat

### Protocole

- **Method**: POST
- **Endpoint**: `http://backend:3000/calculate`
- **Content-Type**: `application/json`
- **CORS**: Activé sur backend

## Sécurité

- **Validation des entrées**: Frontend + Backend
- **CORS**: Limité aux requêtes légitimes
- **Gestion d'erreurs**: Messages clairs sans exposition technique
- **Division par zéro**: Vérifié et rapporté

## Performance

### Frontend

- Standalone components = bundle plus petit
- SCSS au lieu de CSS = nesting et variables
- Compression Gzip dans Nginx
- Cache des assets: 1 an

### Backend

- Algorithmes simples et directs
- Pas de DB, juste du calcul
- CORS minimal

### Docker

- Multi-stage build = image petite
- Alpine = image de base minimale (Node & Nginx)
- `.dockerignore` = build plus rapide

## Scalabilité future

### Frontend

- Ajouter routing avec Angular Router
- Ajouter des modules pour différentes features
- État global avec NgRx

### Backend

- Ajouter base de données pour historique
- Authentification utilisateur
- Plus d'opérations mathématiques
- WebSockets pour temps réel

### Infrastructure

- Load balancing avec plusieurs instances
- Monitoring et logging centralisé
- CI/CD avec GitHub Actions

## Dépendances

### Frontend (Angular)
- `@angular/core` v17
- `@angular/common` v17
- `@angular/forms` v17
- `@angular/platform-browser` v17
- `rxjs` ~7.8
- `zone.js` ~0.14

### Backend (Node.js)
- `express` ^4.18
- `cors` ^2.8

### Infra
- `node:18-alpine` (Frontend & Backend)
- `nginx:alpine` (Frontend)
- `docker-compose` v3.8

## Auteur

Créé en 2026

## Historique

### v1.0 - Initial
- Calculatrice HTML/CSS/JS simple

### v2.0 - Microservices
- Séparation Frontend/Backend

### v3.0 - Angular
- Frontend refactorisé en Angular 17
- Architecture moderne et scalable
