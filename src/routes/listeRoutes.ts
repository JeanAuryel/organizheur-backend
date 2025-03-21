import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { getListes, getListe, getListesForUser, createListe, removeListe, mettreAJourListe, getDernierEmployeMiseAJour } from '../controllers/listeController';

const liste = Router();

liste.get('/', authenticateJWT, getListes); // ✅ Récupérer les listes accessibles
liste.get('/:id', authenticateJWT, getListe); // ✅ Récupérer une liste par ID
liste.get('/mine', authenticateJWT, getListesForUser);
liste.get('/mise-a-jour/:listeID', authenticateJWT, getDernierEmployeMiseAJour); // ✅ Récupérer la dernière mise à jour
liste.post('/mettre-a-jour', authenticateJWT, mettreAJourListe); // ✅ Mettre à jour une liste
liste.post('/', authenticateJWT, createListe); // ✅ Ajouter une liste
liste.delete('/:id', authenticateJWT, removeListe); // ✅ Supprimer une liste

export default liste;
