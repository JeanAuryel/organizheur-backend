import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware'; // ✅ Ajout du middleware
import { getCategories, getCategorie, createCategorie, removeCategorie } from '../controllers/categorieController';

const categorie = Router();

categorie.get('/', authenticateJWT, getCategories); // ✅ Récupérer les catégories accessibles
categorie.get('/:id', authenticateJWT, getCategorie); // ✅ Récupérer une catégorie par ID
categorie.post('/', authenticateJWT, createCategorie); // ✅ Ajouter une catégorie (ADMIN)
categorie.delete('/:id', authenticateJWT, removeCategorie); // ✅ Supprimer une catégorie (ADMIN)

export default categorie;
