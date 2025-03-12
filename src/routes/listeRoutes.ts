import { Router } from 'express';
import { getListes, getListe, createListe, deleteListeData } from '../controllers/listeController';

const router = Router();

router.get('/', getListes); // Récupérer toutes les listes
router.get('/:id', getListe); // Récupérer une liste par ID
router.post('/', createListe); // Ajouter une liste
router.delete('/:id', deleteListeData); // Supprimer une liste

export default router;
