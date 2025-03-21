import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware'; // ✅ Protection des routes
import { getTaches, getTache, getTachesForUser, createTache, removeTache } from '../controllers/tacheController';

const tache = Router();

tache.get('/', authenticateJWT, getTaches); // ✅ Récupérer les tâches accessibles
tache.get('/:id', authenticateJWT, getTache); // ✅ Récupérer une tâche par ID
tache.get('/mine', authenticateJWT, getTachesForUser);
tache.post('/', authenticateJWT, createTache); // ✅ Ajouter une tâche (ADMIN pour non personnelles)
tache.delete('/:id', authenticateJWT, removeTache); // ✅ Supprimer une tâche (ADMIN pour non personnelles)

export default tache;
