import { Request, Response, NextFunction } from 'express';
import { getAllCategories, getCategorieById, addCategorie, deleteCategorie } from '../models/categorieModel';

// Récupérer toutes les catégories
export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const categories = await getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

// Récupérer une catégorie par ID
export const getCategorie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const categorie = await getCategorieById(Number(id));
        if (!categorie) {
            res.status(404).json({ message: 'Catégorie non trouvée' });
            return;
        }
        res.status(200).json(categorie);
    } catch (error) {
        next(error);
    }
};

// Ajouter une catégorie
export const createCategorie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newCategorie = req.body;
        await addCategorie(newCategorie);
        res.status(201).json({ message: 'Catégorie ajoutée avec succès' });
    } catch (error) {
        next(error);
    }
};

// Supprimer une catégorie
export const deleteCategorieData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        await deleteCategorie(Number(id));
        res.status(200).json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        next(error);
    }
};
