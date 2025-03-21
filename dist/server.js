"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
// Import des routes
const authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
const employeRoutes_1 = __importDefault(require("./src/routes/employeRoutes"));
const categorieRoutes_1 = __importDefault(require("./src/routes/categorieRoutes"));
const listeRoutes_1 = __importDefault(require("./src/routes/listeRoutes"));
const tacheRoutes_1 = __importDefault(require("./src/routes/tacheRoutes"));
// Import du middleware de gestion des erreurs
const errorMiddleware_1 = require("./src/middlewares/errorMiddleware");
// Charger les variables d'environnement
dotenv_1.default.config();
// Initialisation de l'application Express
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares globaux
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // 🔥 Autorise uniquement le frontend
    credentials: true, // 🔥 Permet d'envoyer les cookies & tokens
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('Welcome to Organizheur Backend API');
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/employes', employeRoutes_1.default); // Route pour les employés
app.use('/api/categories', categorieRoutes_1.default); // Route pour les catégories
app.use('/api/listes', listeRoutes_1.default); // Route pour les listes
app.use('/api/taches', tacheRoutes_1.default); // Route pour les tâches
// Middleware de gestion des erreurs
app.use(errorMiddleware_1.errorHandler);
// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
