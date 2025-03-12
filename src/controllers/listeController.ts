import { Request, Response, NextFunction } from 'express';
import { getAllListes, getListeById, addListe, deleteListe } from '../models/listeModel';

// Récupérer toutes les listes
export const getListes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const listes = await getAllListes();
        res.status(200).json(listes);
    } catch (error) {
        next(error);
    }
};

// Récupérer une liste par ID
export const getListe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const liste = await getListeById(Number(id));
        if (!liste) {
            res.status(404).json({ message: 'Liste non trouvée' });
            return;
        }
        res.status(200).json(liste);
    } catch (error) {
        next(error);
    }
};

// Ajouter une liste
export const createListe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newListe = req.body;
        await addListe(newListe);
        res.status(201).json({ message: 'Liste ajoutée avec succès' });
    } catch (error) {
        next(error);
    }
};

// Supprimer une liste
export const deleteListeData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        await deleteListe(Number(id));
        res.status(200).json({ message: 'Liste supprimée avec succès' });
    } catch (error) {
        next(error);
    }
};
