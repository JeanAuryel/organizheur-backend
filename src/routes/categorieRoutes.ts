import { Router } from 'express';
import { getCategories, getCategorie, createCategorie, deleteCategorieData } from '../controllers/categorieController';

const router = Router();

router.get('/', getCategories); // Récupérer toutes les catégories
router.get('/:id', getCategorie); // Récupérer une catégorie par ID
router.post('/', createCategorie); // Ajouter une catégorie
router.delete('/:id', deleteCategorieData); // Supprimer une catégorie

export default router;
