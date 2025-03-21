import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import pool from '../config/dbconfig';
import { RowDataPacket } from 'mysql2';
import {
    getAllEmployes,
    getEmployeByEmail,
    addEmploye,
    updateEmploye,
    deleteEmploye,
} from '../models/employeModel';

// 🔍 Récupérer tous les employés (ADMIN uniquement)
export const getEmployes = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "⛔ Accès non autorisé." });
            return;
        }

        // Passer l'email de l'utilisateur pour vérifier ses permissions
        const employes = await getAllEmployes(req.user.employeMail);
        res.status(200).json(employes);
    } catch (error) {
        next(error);
    }
};


// 🔍 Récupérer un employé par son e-mail (LUI-MÊME OU ADMIN)
export const getEmploye = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.params;

        if (!req.user || (!req.user.isAdmin && req.user.employeMail !== email)) {
            res.status(403).json({ message: "⛔ Accès interdit. Vous ne pouvez voir que votre propre profil." });
            return;
        }

        const employe = await getEmployeByEmail(email);
        if (!employe) {
            res.status(404).json({ message: "❌ Employé non trouvé." });
            return;
        }

        res.status(200).json(employe);
    } catch (error) {
        next(error);
    }
};

// ➕ Ajouter un nouvel employé (ADMIN uniquement)
export const createEmploye = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || !req.user.isAdmin) {
            res.status(403).json({ message: "⛔ Accès interdit. Seuls les administrateurs peuvent ajouter des employés." });
            return;
        }

        const newEmploye = req.body;
        await addEmploye(newEmploye);
        res.status(201).json({ message: "✅ Employé ajouté avec succès." });
    } catch (error) {
        next(error);
    }
};

// ✏️ Mettre à jour un employé (ADMIN ou SOI-MÊME)
export const updateEmployeData = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.params;

        if (!req.user || (!req.user.isAdmin && req.user.employeMail !== email)) {
            res.status(403).json({ message: "⛔ Accès interdit. Vous ne pouvez modifier que votre propre profil." });
            return;
        }

        const updatedData = req.body;
        await updateEmploye(email, updatedData);
        res.status(200).json({ message: "✅ Employé mis à jour avec succès." });
    } catch (error) {
        next(error);
    }
};

// ❌ Supprimer un employé (ADMIN uniquement)
export const deleteEmployeData = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || !req.user.isAdmin) {
            res.status(403).json({ message: "⛔ Accès interdit. Seuls les administrateurs peuvent supprimer des employés." });
            return;
        }

        const { email } = req.params;
        await deleteEmploye(email);
        res.status(200).json({ message: "✅ Employé supprimé avec succès." });
    } catch (error) {
        next(error);
    }
};

// 🔄 Affecter un employé à une catégorie (ADMIN uniquement)
export const affecterCategorie = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            res.status(403).json({ message: "⛔ Accès interdit. Seuls les administrateurs peuvent gérer les affectations." });
            return;
        }

        const { employeMail, categorieID } = req.body;
        await pool.query(
            'INSERT INTO affecter (employeMail, categorieID) VALUES (?, ?) ON DUPLICATE KEY UPDATE categorieID = categorieID',
            [employeMail, categorieID]
        );

        res.status(201).json({ message: "✅ Employé affecté à la catégorie." });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur serveur" });
    }
};

// 🗑️ Supprimer une affectation employé -> catégorie (ADMIN uniquement)
export const retirerCategorie = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            res.status(403).json({ message: "⛔ Accès interdit. Seuls les administrateurs peuvent gérer les affectations." });
            return;
        }

        const { employeMail, categorieID } = req.body;
        await pool.query('DELETE FROM affecter WHERE employeMail = ? AND categorieID = ?', [employeMail, categorieID]);

        res.status(200).json({ message: "✅ Affectation supprimée." });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur serveur" });
    }
};

// 📩 Récupérer les catégories d'un employé (LUI-MÊME OU ADMIN)
export const getCategoriesByEmploye = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const employeMail = req.params.employeMail;

        if (!req.user || (!req.user.isAdmin && req.user.employeMail !== employeMail)) {
            res.status(403).json({ message: "⛔ Accès interdit. Vous ne pouvez voir que vos propres catégories." });
            return;
        }

        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT categorieID FROM affecter WHERE employeMail = ?', 
            [employeMail]
        );

        if (!Array.isArray(rows)) {
            throw new Error("Résultat inattendu : la requête ne retourne pas un tableau.");
        }

        res.status(200).json(rows.map(row => row.categorieID));
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur serveur" });
    }
};
