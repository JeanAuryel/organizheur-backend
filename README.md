# 🧠 Organizheur – Backend

Ce dépôt contient l'API de gestion des tâches, utilisateurs, catégories et listes pour l'application **Organizheur**.

> 🔗 [Frontend associé](https://github.com/jeanauryel/organizheur-frontend)

## 🎯 Fonctionnalités
- Authentification avec rôles (admin, user)
- Gestion des listes, tâches, utilisateurs, catégories
- API REST structurée avec NestJS
- Contrôle d'accès basé sur les rôles (RBAC)
- Validation des données avec DTOs
- Architecture modulaire et scalable

## 🛠️ Stack
- **Node.js** - Environnement d'exécution JavaScript
- **NestJS** - Framework progressif pour applications serveur
- **TypeScript** - Langage de programmation typé
- **TypeORM** - ORM pour TypeScript et JavaScript
- **MySQL** - Base de données relationnelle
- **JWT** - Authentification par tokens
- **Passport** - Middleware d'authentification

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- MySQL (v8.0 ou supérieur)
- npm ou yarn

## 🚀 Installation

```bash
npm install
```

## ⚙️ Configuration

Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example`.

### Option 1 : Utiliser DATABASE_URL (Railway, Heroku, etc.)

Pour les services cloud comme Railway, utilisez directement la variable `DATABASE_URL` :

```env
# Database Configuration
DATABASE_URL=mysql://user:password@host:port/database

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=24h

# Application
PORT=3000
NODE_ENV=production
```

### Option 2 : Configuration locale avec variables individuelles

Pour le développement local :

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=organizheur

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=24h

# Application
PORT=3000
NODE_ENV=development
```

## 💾 Base de données

Assurez-vous que MySQL est installé et en cours d'exécution, puis créez la base de données :

```sql
CREATE DATABASE organizheur CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Ou via la ligne de commande :

```bash
mysql -u root -p -e "CREATE DATABASE organizheur CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

L'application créera automatiquement les tables au démarrage grâce à TypeORM.

## ▶️ Démarrage

```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

L'API sera accessible sur `http://localhost:3000`

## 📡 API Endpoints

### Authentification
- `POST /auth/login` - Connexion utilisateur
- `GET /auth/profile` - Récupération du profil utilisateur (protégé)

### Employés
- `GET /employes` - Liste des employés (admin uniquement)
- `GET /employes/me` - Profil de l'utilisateur connecté
- `GET /employes/:mailEmploye` - Détails d'un employé
- `GET /employes/categorie/:idCategorie` - Employés par catégorie
- `POST /employes` - Créer un employé (admin uniquement)
- `PATCH /employes/:mailEmploye` - Modifier un employé
- `DELETE /employes/:mailEmploye` - Supprimer un employé (admin uniquement)

### Catégories
- `GET /categories` - Liste des catégories
- `GET /categories/:id` - Détails d'une catégorie
- `POST /categories` - Créer une catégorie (admin uniquement)
- `PATCH /categories/:id` - Modifier une catégorie (admin uniquement)
- `DELETE /categories/:id` - Supprimer une catégorie (admin uniquement)

### Listes
- `GET /listes` - Toutes les listes accessibles
- `GET /listes/personnelles` - Listes personnelles
- `GET /listes/categorie/:idCategorie` - Listes par catégorie
- `GET /listes/:id` - Détails d'une liste
- `POST /listes` - Créer une liste
- `PATCH /listes/:id` - Modifier une liste
- `DELETE /listes/:id` - Supprimer une liste

### Tâches
- `GET /taches` - Toutes les tâches accessibles
- `GET /taches/liste/:idListe` - Tâches d'une liste
- `GET /taches/:id` - Détails d'une tâche
- `POST /taches` - Créer une tâche
- `PATCH /taches/:id` - Modifier une tâche
- `PATCH /taches/:id/toggle` - Basculer l'état d'une tâche
- `DELETE /taches/:id` - Supprimer une tâche

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture de tests
npm run test:cov
```

## 📁 Structure du projet

```
src/
├── auth/           # Module d'authentification (JWT, Passport)
├── dto/            # Data Transfer Objects (validation)
├── entities/       # Entités TypeORM (modèles de données)
├── employe/        # Module employés
├── categorie/      # Module catégories
├── liste/          # Module listes
├── tache/          # Module tâches
└── main.ts         # Point d'entrée
```

## 📝 Licence

Ce projet est sous licence MIT.
