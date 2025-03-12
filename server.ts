import express, { Application } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';

// Import des routes
import authRoutes from './src/routes/authRoutes';
import employeRoutes from './src/routes/employeRoutes';
import categorieRoutes from './src/routes/categorieRoutes';
import listeRoutes from './src/routes/listeRoutes';
import tacheRoutes from './src/routes/tacheRoutes';



// Import du middleware de gestion des erreurs
import { errorHandler } from './src/middlewares/errorMiddleware';

// Charger les variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(helmet());
app.use(cors(
    {
        origin: "http://localhost:5173", // 🔥 Autorise uniquement le frontend
        credentials: true, // 🔥 Permet d'envoyer les cookies & tokens
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }
));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to Organizheur Backend API');
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employes', employeRoutes); // Route pour les employés
app.use('/api/categories', categorieRoutes); // Route pour les catégories
app.use('/api/listes', listeRoutes); // Route pour les listes
app.use('/api/taches', tacheRoutes); // Route pour les tâches

// Middleware de gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
