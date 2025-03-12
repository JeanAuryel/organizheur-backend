import { Request, Response } from 'express';
import {
    getAllEmployes,
    getEmployeByEmail,
    addEmploye,
    updateEmploye,
    deleteEmploye,
} from '../models/employeModel';

// Récupérer tous les employés
export const getEmployes = async (req: Request, res: Response): Promise<void> => {
    try {
        const employes = await getAllEmployes();
        res.status(200).json(employes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des employés' });
    }
};

// Récupérer un employé par son e-mail
export const getEmploye = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.params;
        const employe = await getEmployeByEmail(email);
        if (!employe) {
            res.status(404).json({ message: 'Employé non trouvé' });
            return;
        }
        res.status(200).json(employe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'employé' });
    }
};

// Ajouter un nouvel employé
export const createEmploye = async (req: Request, res: Response): Promise<void> => {
    try {
        const newEmploye = req.body;
        await addEmploye(newEmploye);
        res.status(201).json({ message: 'Employé ajouté avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'employé' });
    }
};

// Mettre à jour un employé
export const updateEmployeData = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.params;
        const updatedData = req.body;
        await updateEmploye(email, updatedData);
        res.status(200).json({ message: 'Employé mis à jour avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'employé' });
    }
};

// Supprimer un employé
export const deleteEmployeData = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.params;
        await deleteEmploye(email);
        res.status(200).json({ message: 'Employé supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'employé' });
    }
};
