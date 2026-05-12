# Qu'est-ce que Karma ?

**Karma** est un **test runner** pour Angular - c'est un outil qui lance vos tests unitaires.

## 🧪 Qu'est-ce qu'un test runner ?

Un test runner est un programme qui :
1. Lance votre suite de tests
2. Ouvre un navigateur (Chrome, Firefox, etc.)
3. Exécute vos tests dans ce navigateur
4. Rapporte les résultats

## 📦 Fichier karma.conf.js

Ce fichier configure **comment** Karma doit exécuter les tests :

```javascript
// Configuration de Karma
{
  frameworks: ['jasmine'],        // Utilise Jasmine (framework de test)
  browsers: ['Chrome'],           // Lance les tests dans Chrome
  port: 9876,                     // Port de Karma
  autoWatch: true,                // Observe les changements de fichiers
  singleRun: false               // Reste en attente pour relancer les tests
}
```

## 🔴 Pourquoi le Docker build échouait ?

### Le problème 

```dockerfile
FROM node:18-alpine AS builder
RUN npm install        # ← Installe Karma
RUN npm run build      # ← Essaie de build
```

**Karma a besoin de Chrome/Chromium** qui n'existe pas en Alpine ! 🚫

Alpine est une image Linux minimale sans navigateur.

### La solution

J'ai retiré les dépendances de test du `package.json` :

```diff
- "karma": "~6.4.0",
- "karma-chrome-launcher": "~3.2.0",
- "karma-coverage": "~2.2.0",
- "karma-jasmine": "~5.1.0",
- "karma-jasmine-html-reporter": "~2.1.0",
```

Maintenant le build ne cherche plus Chrome ! ✅

## 📝 Quand utilise-t-on Karma ?

### ✅ Développement LOCAL

```bash
npm test
# Lance Karma avec Chrome sur votre ordinateur
# Les tests s'exécutent et se relancent auto
```

### ❌ Build Docker (production)

Le build Docker NE L'UTILISE PAS car :
- Pas de navigateur en Alpine
- Pas besoin de tests en production
- Ralentit le build inutilement

## 🎯 Cas d'usage Karma

```
┌─────────────────────────────┐
│  npm test (LOCAL)           │  ← Utilise Karma
│  - Développement            │
│  - Vérifier les tests       │
└─────────────────────────────┘

┌─────────────────────────────┐
│  docker-compose up (PROD)   │  ← N'utilise PAS Karma
│  - Build optimisé           │
│  - Pas de dépendances test  │
└─────────────────────────────┘
```

## 🔧 Relation Karma ↔ Build Angular

```
Angular CLI (ng build)
    ↓
1. Compile TypeScript → JavaScript
2. Bundle les modules
3. Minify le code
4. Crée dist/browser/
    ↓
Karma NE PARTICIPE PAS À ÇA ! ❌

Karma intervient SEULEMENT pour :
ng test → Lance des tests avec Jasmine
```

## ✨ Maintenant, tu peux :

```bash
# En LOCAL (sur ton PC avec Node.js)
npm test                 # Lance les tests avec Karma

# EN DOCKER (build production)
docker-compose up --build   # Pas de Karma, build rapide ! 🚀
```

## 📚 Ressources

- [Karma documentation](https://karma-runner.github.io/)
- [Jasmine (framework test)](https://jasmine.github.io/)
- [Angular Testing Guide](https://angular.io/guide/testing)
