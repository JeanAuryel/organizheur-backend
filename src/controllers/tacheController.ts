import { Request, Response, NextFunction } from 'express';
import { getAllTaches, getTacheById, addTache, deleteTache } from '../models/tacheModel';

// Récupérer toutes les tâches
export const getTaches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const taches = await getAllTaches();
        res.status(200).json(taches);
    } catch (error) {
        next(error);
    }
};

// Récupérer une tâche par ID
export const getTache = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const tache = await getTacheById(Number(id));
        if (!tache) {
            res.status(404).json({ message: 'Tâche non trouvée' });
            return;
        }
        res.status(200).json(tache);
    } catch (error) {
        next(error);
    }
};

// Ajouter une tâche
export const createTache = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newTache = req.body;
        await addTache(newTache);
        res.status(201).json({ message: 'Tâche ajoutée avec succès' });
    } catch (error) {
        next(error);
    }
};

// Supprimer une tâche
export const deleteTacheData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        await deleteTache(Number(id));
        res.status(200).json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
        next(error);
    }
};
