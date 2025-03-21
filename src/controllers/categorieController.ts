import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types'; // ✅ On importe notre type personnalisé
import { getCategoriesByEmploye, getCategorieById, addCategorie, deleteCategorie } from '../models/categorieModel';

// 🔍 Récupérer toutes les catégories accessibles par un employé
export const getCategories = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "⛔ Accès non autorisé." });
            return;
        }

        const categories = await getCategoriesByEmploye(req.user.employeMail);
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

// 🔍 Récupérer une catégorie par ID (avec restriction d'accès)
export const getCategorie = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "⛔ Accès non autorisé." });
            return;
        }

        const { id } = req.params;
        const categorie = await getCategorieById(req.user.employeMail, Number(id));
        if (!categorie) {
            res.status(404).json({ message: "❌ Catégorie non trouvée ou accès refusé." });
            return;
        }

        res.status(200).json(categorie);
    } catch (error) {
        next(error);
    }
};

// ➕ Ajouter une catégorie (ADMIN uniquement)
export const createCategorie = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || !req.user.isAdmin) {
            res.status(403).json({ message: "⛔ Accès interdit. Seuls les administrateurs peuvent créer une catégorie." });
            return;
        }

        const { nomCategorie } = req.body;
        if (!nomCategorie) {
            res.status(400).json({ message: "⛔ Le nom de la catégorie est requis." });
            return;
        }

        await addCategorie(req.user.employeMail, { nomCategorie });
        res.status(201).json({ message: "✅ Catégorie créée avec succès." });
    } catch (error) {
        next(error);
    }
};

// ❌ Supprimer une catégorie (ADMIN uniquement)
export const removeCategorie = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || !req.user.isAdmin) {
            res.status(403).json({ message: "⛔ Accès interdit. Seuls les administrateurs peuvent supprimer une catégorie." });
            return;
        }

        const categorieID = parseInt(req.params.id, 10);
        await deleteCategorie(req.user.employeMail, categorieID);
        res.status(200).json({ message: "✅ Catégorie supprimée avec succès." });
    } catch (error) {
        next(error);
    }
};
