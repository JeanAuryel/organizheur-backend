import { Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../config/dbconfig';
import { AuthenticatedRequest } from '../types'; // ✅ Import du type personnalisé
import { getTacheById, getTachesByEmploye, addTache, deleteTache } from '../models/tacheModel';

// 🔍 Récupérer toutes les tâches accessibles par un employé
export const getTaches = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "⛔ Accès non autorisé." });
            return;
        }

        const taches = await getTachesByEmploye(req.user.employeMail);
        res.status(200).json(taches);
    } catch (error) {
        next(error);
    }
};

// 🔍 Récupérer une tâche par ID (avec restriction d'accès)
export const getTache = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "⛔ Accès non autorisé." });
            return;
        }

        const { id } = req.params;
        const tacheID = Number(id);

        if (isNaN(tacheID)) {
            res.status(400).json({ message: "❌ Id de tâche invalide." });
            return;
        }

        const tache = await getTacheById(req.user.employeMail, Number(id));
        if (!tache) {
            res.status(404).json({ message: "❌ Tâche non trouvée ou accès refusé." });
            return;
        }

        res.status(200).json(tache);
    } catch (error) {
        next(error);
    }
};

// ➕ Ajouter une tâche (ADMIN uniquement pour les listes non personnelles)
export const createTache = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "⛔ Accès non autorisé." });
            return;
        }

        const { tacheLibelle, tacheEtatCompletion, tacheEcheance, tacheCreation, tacheMAJ, listeID } = req.body;
        const employeMail = req.user.employeMail;

        // Vérifier si la liste est personnelle
        const [listCheck] = await pool.query<RowDataPacket[]>(
            'SELECT estPersonnel FROM liste WHERE listeID = ?',
            [listeID]
        );

        if (listCheck.length === 0) {
            res.status(404).json({ message: "❌ Liste introuvable." });
            return;
        }

        const estPersonnel = listCheck[0].estPersonnel;

        // Seuls les admins peuvent ajouter des tâches dans des listes non personnelles
        if (!estPersonnel && !req.user.isAdmin) {
            res.status(403).json({ message: "⛔ Accès interdit. Seuls les administrateurs peuvent ajouter des tâches aux listes non personnelles." });
            return;
        }

        await addTache({ tacheLibelle, tacheEtatCompletion, tacheEcheance, tacheCreation, tacheMAJ, listeID, employeMail });
        res.status(201).json({ message: "✅ Tâche ajoutée avec succès." });
    } catch (error) {
        next(error);
    }
};

// ❌ Supprimer une tâche (ADMIN uniquement pour les listes non personnelles)
export const removeTache = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "⛔ Accès non autorisé." });
            return;
        }

        const { id } = req.params;

        // Vérifier si la tâche appartient à une liste personnelle
        const [taskCheck] = await pool.query<RowDataPacket[]>(
            `SELECT l.estPersonnel FROM tache t
            JOIN liste l ON t.listeID = l.listeID
            WHERE t.tacheID = ?`,
            [id]
        );

        if (taskCheck.length === 0) {
            res.status(404).json({ message: "❌ Tâche introuvable." });
            return;
        }

        const estPersonnel = taskCheck[0].estPersonnel;

        // Seuls les admins peuvent supprimer des tâches dans des listes non personnelles
        if (!estPersonnel && !req.user.isAdmin) {
            res.status(403).json({ message: "⛔ Accès interdit. Seuls les administrateurs peuvent supprimer des tâches des listes non personnelles." });
            return;
        }

        await deleteTache(Number(id));
        res.status(200).json({ message: "✅ Tâche supprimée avec succès." });
    } catch (error) {
        next(error);
    }
};

export const getTachesForUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const employeMail = req.user?.employeMail;

        if (!employeMail) {
            res.status(401).json({ message: "Non autorisé" });
            return;
        }

        console.log("📩 Tache - utilisateur connecté :", employeMail);

        const taches = await getTachesByEmploye(employeMail);
        res.status(200).json(taches);
    } catch (error) {
        console.error("❌ Erreur dans getTachesForUser :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};
