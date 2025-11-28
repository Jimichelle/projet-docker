# TaskFlow - Documentation Docker

Application de gestion de tâches avec Next.js, Express et PostgreSQL, containerisée avec Docker.

---

## Table des matières

1. [Prérequis](#prérequis)
2. [Instructions de construction et démarrage](#instructions-de-construction-et-démarrage)
3. [Architecture Docker](#architecture-docker)
4. [Tests et validation](#tests-et-validation)
5. [Commandes utiles](#commandes-utiles)

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Docker** (version 20.10 ou supérieure)
- **Docker Compose** (version 2.0 ou supérieure)
- **Git** (pour cloner le repository)

Vérifiez vos installations :

```bash
docker --version
docker-compose --version
```

---

## Instructions de construction et démarrage

### Option 1 : Utiliser Docker Compose (Recommandé)

Cette méthode utilise les images pré-construites depuis Docker Hub.

#### 1. Cloner le repository

```bash
git clone <repository-url>
cd projet-docker
```

#### 2. Lancer l'application

```bash
docker-compose up -d
```

Cette commande va :
- Télécharger les images depuis Docker Hub
- Créer les conteneurs
- Configurer le réseau interne
- Démarrer tous les services dans l'ordre (database → backend → frontend)

#### 3. Vérifier que les services sont démarrés

```bash
docker-compose ps
```

Vous devriez voir les 3 services avec le statut `Up` :
- `database-application`
- `back-application`
- `front-application`

#### 4. Accéder à l'application

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3008
- **Database** : localhost:5432

---

### Option 2 : Construire les images localement

Si vous souhaitez construire les images vous-même avant de les utiliser :

#### 1. Construire l'image de la base de données

```bash
docker build -t jimichelle/bdd-application:latest ./apps/database
```

#### 2. Construire l'image du backend

```bash
docker build -t jimichelle/back-application:latest ./apps/back-app
```

#### 3. Construire l'image du frontend

```bash
# Depuis la racine du projet
docker build -t jimichelle/front-application:latest -f ./apps/front-app/Dockerfile .
```

#### 4. Lancer avec Docker Compose

```bash
docker-compose up -d
```

---

### Option 3 : Push vers Docker Hub

Si vous avez modifié les images et souhaitez les publier :

```bash
# Se connecter à Docker Hub
docker login

# Push les images
docker push jimichelle/bdd-application:latest
docker push jimichelle/back-application:latest
docker push jimichelle/front-application:latest
```

---

## Architecture Docker

### Vue d'ensemble

L'application est composée de **3 services** qui communiquent via un **réseau Docker automatique** :

```
┌─────────────────────────────────────────────────┐
│         Réseau Docker (automatique)              │
│                                                  │
│  ┌──────────────┐    ┌──────────────┐           │
│  │  Frontend    │───▶│   Backend    │           │
│  │  :3000       │    │   :3008      │           │
│  └──────────────┘    └──────┬───────┘           │
│                             │                    │
│                             ▼                    │
│                      ┌──────────────┐            │
│                      │  Database    │            │
│                      │  :5432       │            │
│                      └──────────────┘            │
└─────────────────────────────────────────────────┘
```

### Services détaillés

#### 1. Database (`database-application`)

**Image** : `jimichelle/bdd-application:latest`  
**Port** : `5432:5432`  
**Base de données** : PostgreSQL 16 Alpine

**Configuration** :
- **Base de données** : `taskdb`
- **Utilisateur** : `postgres`
- **Mot de passe** : `postgres`
- **Volume** : `postgres_data` (persistance des données)
- **Healthcheck** : Vérifie que PostgreSQL est prêt à accepter des connexions

**Rôle** : Stocke toutes les données de l'application (tâches, tags, etc.)

#### 2. Backend (`back-application`)

**Image** : `jimichelle/back-application:latest`  
**Port** : `3008:3008`  
**Framework** : Express.js avec TypeScript

**Variables d'environnement** :
- `PORT=3008` : Port d'écoute du serveur
- `DB_HOST=database` : Nom du service database (résolution DNS automatique)
- `DB_PORT=5432` : Port de la base de données
- `DB_NAME=taskdb` : Nom de la base de données
- `DB_USER=postgres` : Utilisateur PostgreSQL
- `DB_PASSWORD=postgres` : Mot de passe PostgreSQL
- `FRONTEND_URL=http://localhost:3000` : URL du frontend pour CORS

**Dépendances** : Attend que la database soit `healthy` avant de démarrer

**Rôle** : API REST qui gère les opérations CRUD sur les tâches

#### 3. Frontend (`front-application`)

**Image** : `jimichelle/front-application:latest`  
**Port** : `3000:3000`  
**Framework** : Next.js 16

**Variables d'environnement** :
- `NEXT_PUBLIC_API_URL=http://localhost:3008` : URL de l'API backend

**Dépendances** : Attend que le backend soit démarré

**Rôle** : Interface utilisateur pour gérer les tâches

---

### Volumes

#### `postgres_data`

- **Type** : Volume Docker nommé
- **Montage** : `/var/lib/postgresql/data` dans le conteneur database
- **Rôle** : Persiste les données PostgreSQL même après l'arrêt des conteneurs
- **Persistance** : Les données restent disponibles après `docker-compose down` (sauf si vous utilisez `-v`)

**Gestion du volume** :
```bash
# Voir les volumes
docker volume ls

# Inspecter le volume
docker volume inspect projet-docker_postgres_data

# Supprimer le volume (supprime toutes les données)
docker volume rm projet-docker_postgres_data
```

---

### Réseaux

Docker Compose crée automatiquement un **réseau bridge** pour tous les services. Ce réseau permet :

- **Résolution DNS automatique** : Les services peuvent se trouver par leur nom (`database`, `backend`, `frontend`)
- **Isolation** : Les conteneurs sont isolés du réseau hôte
- **Communication interne** : Les services communiquent via leurs noms de service

**Exemple** : Le backend utilise `DB_HOST=database` au lieu de `localhost` car Docker résout automatiquement `database` vers l'IP du conteneur database.

**Voir le réseau** :
```bash
docker network ls
docker network inspect projet-docker_default
```

---

### Ordre de démarrage

Docker Compose respecte les dépendances définies :

1. **Database** démarre en premier
2. **Backend** attend que la database soit `healthy` (healthcheck)
3. **Frontend** attend que le backend soit démarré

Cela garantit que chaque service trouve ses dépendances prêtes.

---

## Tests et validation

### 1. Vérifier que les conteneurs sont en cours d'exécution

```bash
docker-compose ps
```

Tous les services doivent avoir le statut `Up` et un temps de fonctionnement.

---

### 2. Tester la communication entre conteneurs

#### Test 1 : Backend → Database

```bash
# Se connecter au conteneur backend
docker exec -it back-application sh

# Tester la connexion à la database (depuis le conteneur)
# Installer psql si nécessaire ou utiliser une commande Node
node -e "const { Pool } = require('pg'); const pool = new Pool({ host: 'database', port: 5432, database: 'taskdb', user: 'postgres', password: 'postgres' }); pool.query('SELECT NOW()', (err, res) => { console.log(err || res.rows[0]); process.exit(0); });"
```

**Résultat attendu** : Affiche la date/heure actuelle sans erreur.

#### Test 2 : Frontend → Backend

```bash
# Depuis votre machine (pas dans un conteneur)
curl http://localhost:3008/task
```

**Résultat attendu** : Retourne un tableau JSON (vide ou avec des tâches).

#### Test 3 : Accès web Frontend → Backend

1. Ouvrir http://localhost:3000 dans votre navigateur
2. Ouvrir la console développeur (F12)
3. Vérifier qu'il n'y a pas d'erreurs CORS ou de connexion
4. Créer une tâche et vérifier qu'elle apparaît

---

### 3. Tester la persistance des données

#### Test 1 : Créer des données

```bash
# Démarrer l'application
docker-compose up -d

# Créer une tâche via l'API
curl -X POST http://localhost:3008/task \
  -H "Content-Type: application/json" \
  -d '{"title": "Test persistance", "description": "Vérifier que les données persistent"}'

# Vérifier que la tâche existe
curl http://localhost:3008/task
```

#### Test 2 : Arrêter et redémarrer

```bash
# Arrêter tous les conteneurs (sans supprimer les volumes)
docker-compose down

# Redémarrer
docker-compose up -d

# Vérifier que la tâche existe toujours
curl http://localhost:3008/task
```

**Résultat attendu** : La tâche créée précédemment doit toujours être présente.

#### Test 3 : Supprimer le volume (supprime toutes les données)

```bash
# Arrêter et supprimer les volumes
docker-compose down -v

# Redémarrer (crée un nouveau volume vide)
docker-compose up -d

# Vérifier que les données ont été supprimées
curl http://localhost:3008/task
```

**Résultat attendu** : Tableau vide `[]`.

---

### 4. Vérifier les logs

#### Logs de tous les services

```bash
docker-compose logs -f
```

#### Logs d'un service spécifique

```bash
# Logs de la database
docker-compose logs -f database

# Logs du backend
docker-compose logs -f backend

# Logs du frontend
docker-compose logs -f frontend
```

**À vérifier** :
- Database : `Connected to PostgreSQL database`
- Backend : `Server is running on port 3008`
- Frontend : Pas d'erreurs de build ou de connexion

---

### 5. Tester les endpoints de l'API

```bash
# GET - Lister toutes les tâches
curl http://localhost:3008/task

# POST - Créer une tâche
curl -X POST http://localhost:3008/task \
  -H "Content-Type: application/json" \
  -d '{"title": "Nouvelle tâche", "status": "todo", "priority": "normal"}'

# PATCH - Mettre à jour le statut d'une tâche
# Remplacez {task-id} par un ID réel
curl -X PATCH http://localhost:3008/task/{task-id} \
  -H "Content-Type: application/json" \
  -d '{"status": "doing"}'

# DELETE - Supprimer une tâche
# Remplacez {task-id} par un ID réel
curl -X DELETE http://localhost:3008/task/{task-id}
```

---

## Commandes utiles

### Gestion des services

```bash
# Démarrer tous les services
docker-compose up -d

# Démarrer un service spécifique
docker-compose up -d database

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (supprime les données)
docker-compose down -v

# Redémarrer un service spécifique
docker-compose restart backend

# Rebuild et redémarrer
docker-compose up -d --build
```

### Logs et monitoring

```bash
# Voir les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend

# Voir les 100 dernières lignes
docker-compose logs --tail=100

# Statut des services
docker-compose ps

# Utilisation des ressources
docker stats
```

### Accès aux conteneurs

```bash
# Se connecter au conteneur backend
docker exec -it back-application sh

# Se connecter au conteneur database
docker exec -it database-application psql -U postgres -d taskdb

# Exécuter une commande dans un conteneur
docker exec back-application node -v
```

### Nettoyage

```bash
# Supprimer les conteneurs arrêtés
docker-compose rm

# Supprimer les images non utilisées
docker image prune

# Nettoyage complet (supprime tout sauf les volumes)
docker system prune -a
```

---

## Liens utiles

- **Docker Hub** : https://hub.docker.com/u/jimichelle
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3008
- **Documentation Docker** : https://docs.docker.com/

---

## Dépannage

### Les conteneurs ne démarrent pas

```bash
# Vérifier les logs
docker-compose logs

# Vérifier que les ports ne sont pas déjà utilisés
lsof -i :3000
lsof -i :3008
lsof -i :5432
```

### Erreur de connexion à la database

- Vérifier que le service `database` est `healthy` : `docker-compose ps`
- Vérifier les logs : `docker-compose logs database`
- Vérifier que `DB_HOST=database` dans le backend (pas `localhost`)

### Le frontend ne peut pas joindre le backend

- Vérifier que `NEXT_PUBLIC_API_URL=http://localhost:3008` est correct
- Vérifier que le backend écoute sur le port 3008 : `curl http://localhost:3008`
- Vérifier les logs CORS dans le backend

### Les données disparaissent après redémarrage

- Vérifier que le volume `postgres_data` existe : `docker volume ls`
- Ne pas utiliser `docker-compose down -v` (supprime les volumes)

---

## Notes

- Les images sont disponibles sur Docker Hub et sont automatiquement téléchargées lors du premier `docker-compose up`
- Les données sont persistées dans le volume Docker `postgres_data`
- Le réseau Docker est créé automatiquement par Docker Compose
- Les services communiquent via leurs noms (résolution DNS automatique)
