GROUPE : Basil Brulé, Simon Daconceicao-Semiao, Guillome Mignon

# Calculatrice JavaScript avec Docker & Angular

Une calculatrice web complète avec architecture microservices utilisant **Angular 17** pour le frontend et **Express.js** pour le backend, avec supervision **Prometheus + Grafana**.

## 🎯 Fonctionnalités

- ✅ Addition, soustraction, multiplication, division
- ✅ Frontend moderne avec **Angular 17** (Standalone Components)
- ✅ Backend API avec **Express.js** et CORS
- ✅ Frontend servé avec **Nginx**
- ✅ Build multi-stage Docker optimisé
- ✅ Supervision Docker avec **Prometheus** et **Grafana**
- ✅ Interface responsive et animée
- ✅ Communication REST API
- ✅ Vérification de la connexion au backend
- ✅ Gestion des erreurs complète

## 📁 Structure du projet

```
.
├── backend/
│   ├── Dockerfile
│   ├── server.js           # API Express avec routes /calculate et /health
│   ├── package.json
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile          # Build multi-stage (Node.js + Nginx)
│   ├── nginx.conf
│   ├── src/
│   │   ├── app/
│   │   │   ├── services/
│   │   │   │   └── calculator.service.ts    # Service API
│   │   │   ├── app.component.ts             # Composant principal
│   │   │   ├── app.component.html
│   │   │   └── app.component.scss
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── angular.json        # Configuration Angular CLI
│   ├── tsconfig.json
│   ├── karma.conf.js
│   ├── package.json
│   └── README.md
├── docker-compose.yml      # Orchestration 2 conteneurs
└── README.md
```

## 🏗️ Architecture

```
┌────────────────────────────────────────────┐
│       Frontend (Nginx + Angular 17)        │
│         http://localhost:8080              │
├────────────────────────────────────────────┤
│   Backend (Express API - Node.js)          │
│    http://localhost:3002                   │
├────────────────────────────────────────────┤
│   Prometheus (scraping backend metrics)     │
│         http://localhost:9090              │
├────────────────────────────────────────────┤
│   Grafana (dashboards)                     │
│         http://localhost:3001              │
└────────────────────────────────────────────┘
```

### Communication

- **Frontend**: Effectue des requêtes HTTP POST vers `/calculate`
- **Backend**: Traite les calculs et retourne les résultats
- **Réseau**: Utilise un réseau Docker bridge pour la communication

## 🚀 Démarrage rapide avec Docker

### Prérequis
- Docker et Docker Compose installés

### Lancer l'application

```bash
# Construire et démarrer tous les services
docker-compose up --build

# En arrière-plan
docker-compose up -d --build

# Voir les logs
docker-compose logs -f
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Accéder à l'application

- **Frontend (Angular)**: http://localhost:8080
- **Backend API**: http://localhost:3002
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001

### Arrêt

```bash
# Arrêter tous les services
docker-compose down

# Supprimer aussi les images
docker-compose down --rmi all
```

## 💻 Développement local

### Backend (Express)

```bash
cd backend
npm install
npm start
# Serveur sur http://localhost:3000
```

### Frontend (Angular)

```bash
cd frontend
npm install
npm start
# Application sur http://localhost:4200
```

## 📚 API Backend

### POST `/calculate`

Effectue un calcul mathématique.

**Requête:**
```json
{
  "operation": "+",
  "num1": 5,
  "num2": 3
}
```

**Réponse (succès):**
```json
{
  "result": 8
}
```

**Réponse (erreur):**
```json
{
  "error": "Division par zéro impossible"
}
```

**Opérations supportées:**
- `+` : Addition
- `-` : Soustraction
- `*` : Multiplication
- `/` : Division

### GET `/health`

Vérifie que le backend est fonctionnel.

**Réponse:**
```json
{
  "status": "Backend OK"
}
```

## 🛠️ Utilisation de l'application

1. Entrez le premier nombre
2. Sélectionnez l'opération (+, -, ×, ÷)
3. Entrez le deuxième nombre
4. Cliquez sur "Calculer" ou appuyez sur Entrée
5. Le résultat s'affiche

## 🐳 Détails Docker

### Frontend Dockerfile (Multi-stage)

```dockerfile
# Stage 1: Build Angular avec Node.js
# Stage 2: Servir avec Nginx
```

Avantages:
- Image finale petite (seulement Nginx)
- Aucune dépendance Node.js dans le conteneur final
- Compilation optimisée

### Backend Dockerfile

Image Node.js 18 Alpine servant l'API Express.

## 🔧 Configuration Nginx

- **Compression Gzip** activée
- **Routing Angular**: Redirige vers `index.html` pour les routes
- **Cache des assets**: 1 an pour les fichiers statiques
- **Health checks**: Vérification du backend avant démarrage

## 📦 Stack technologique

**Frontend:**
- Angular 17 (Standalone Components)
- TypeScript
- SCSS
- HttpClient (RxJS)

**Backend:**
- Node.js 18
- Express.js
- CORS

**Infra:**
- Docker
- Docker Compose
- Nginx

## 🎨 Features Frontend

- ✅ Composants Angular standalone (pas de NgModule)
- ✅ Two-way data binding avec FormsModule
- ✅ Service injectable avec communication API
- ✅ Gestion des états (loading, error, résultat)
- ✅ Validation des entrées
- ✅ Indicateur de connexion backend
- ✅ Animations fluides
- ✅ Responsive design (mobile, tablet, desktop)

## 📝 Fichiers clés

- [frontend/src/app/app.component.ts](frontend/src/app/app.component.ts) - Composant principal Angular
- [frontend/src/app/services/calculator.service.ts](frontend/src/app/services/calculator.service.ts) - Service API
- [backend/server.js](backend/server.js) - Serveur Express
- [docker-compose.yml](docker-compose.yml) - Configuration Docker
- [frontend/Dockerfile](frontend/Dockerfile) - Build multi-stage
- [frontend/nginx.conf](frontend/nginx.conf) - Configuration Nginx

## 🔌 Variables d'environnement

### Backend
- `NODE_ENV` - Mode de l'application (production)

### Frontend
- Aucune variable spécifique (URL de l'API détectée automatiquement)

## 📱 Responsive

L'interface s'adapte automatiquement à:
- 📱 Téléphones (< 600px)
- 📱 Tablettes (600px - 900px)
- 🖥️ Desktop (> 900px)

## 🐛 Dépannage

### Le frontend ne peut pas se connecter au backend

1. Vérifier que les deux conteneurs sont en cours d'exécution: `docker-compose ps`
2. Vérifier les logs: `docker-compose logs backend`
3. S'assurer que le backend est sur le port 3000

### Les styles ne s'appliquent pas

- Vider le cache du navigateur (Ctrl+Shift+Del ou Cmd+Shift+Delete)
- Recharger la page (Ctrl+F5 ou Cmd+Shift+R)

## 📄 Auteur

Créé en 2026

---

**Besoin d'aide?** Consultez les README.md dans les dossiers `frontend/` et `backend/` pour plus de détails.

