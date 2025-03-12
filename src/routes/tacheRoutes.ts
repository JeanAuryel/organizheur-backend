import { Router } from 'express';
import { getTaches, getTache, createTache, deleteTacheData } from '../controllers/tacheController';

const router = Router();

router.get('/', getTaches); // Récupérer toutes les tâches
router.get('/:id', getTache); // Récupérer une tâche par ID
router.post('/', createTache); // Ajouter une tâche
router.delete('/:id', deleteTacheData); // Supprimer une tâche

export default router;
