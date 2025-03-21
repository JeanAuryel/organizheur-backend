import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { RowDataPacket } from 'mysql2';
import pool from '../config/dbconfig';
import { getAllListes, getListeById, getListesByEmploye, addListe, deleteListe } from '../models/listeModel';

// 🔍 Récupérer toutes les listes accessibles par un employé
export const getListes = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "⛔ Accès non autorisé." });
            return;
        }

        const listes = await getListesByEmploye(req.user.employeMail);
        res.status(200).json(listes);
    } catch (error) {
        next(error);
    }
};

// 🔍 Récupérer une liste par ID
export const getListe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "⛔ Accès non autorisé." });
            return;
        }

        const { id } = req.params;
        const listeID = Number(id);

        if (isNaN(listeID)) {
            res.status(400).json({ message: "❌ ID de liste invalide." });
            return;
        }

        const liste = await getListeById(req.user.employeMail, Number(id)); // ✅ Passer `employeMail` en premier argument

        if (!liste) {
            res.status(404).json({ message: "❌ Liste non trouvée ou accès refusé." });
            return;
        }

        res.status(200).json(liste);
    } catch (error) {
        next(error);
    }
};


// ➕ Ajouter une liste (Restriction ADMIN pour les listes non personnelles)
export const createListe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "⛔ Accès non autorisé." });
            return;
        }

        const { listeDateCreation, listeDateMAJ, estPersonnel, categorieID } = req.body;
        const employeMail = req.user.employeMail;

        // Seuls les admins peuvent créer des listes non personnelles
        if (!estPersonnel && !req.user.isAdmin) {
            res.status(403).json({ message: "⛔ Accès interdit. Seuls les administrateurs peuvent créer des listes non personnelles." });
            return;
        }

        await addListe({
            listeDateCreation,
            listeDateMAJ,
            estPersonnel,
            employeMail,
            categorieID
        });

        res.status(201).json({ message: "✅ Liste créée avec succès." });
    } catch (error) {
        next(error);
    }
};

// ❌ Supprimer une liste (Restriction ADMIN pour les listes non personnelles)
export const removeListe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "⛔ Accès non autorisé." });
            return;
        }

        const { id } = req.params;

        // Vérifier si la liste est personnelle
        const [listCheck] = await pool.query<RowDataPacket[]>(
            'SELECT estPersonnel FROM liste WHERE listeID = ?',
            [id]
        );

        if (listCheck.length === 0) {
            res.status(404).json({ message: "❌ Liste introuvable." });
            return;
        }

        const estPersonnel = listCheck[0].estPersonnel;

        // Seuls les admins peuvent supprimer des listes non personnelles
        if (!estPersonnel && !req.user.isAdmin) {
            res.status(403).json({ message: "⛔ Accès interdit. Seuls les administrateurs peuvent supprimer des listes non personnelles." });
            return;
        }

        await deleteListe(Number(id));
        res.status(200).json({ message: "✅ Liste supprimée avec succès." });
    } catch (error) {
        next(error);
    }
};

// 🔄 Mettre à jour la dernière personne ayant modifié une liste
export const mettreAJourListe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "⛔ Accès non autorisé." });
            return;
        }

        const { listeID } = req.body;
        const employeMail = req.user.employeMail;

        if (!listeID) {
            res.status(400).json({ message: "⛔ Paramètre listeID manquant." });
            return;
        }

        await pool.query(
            'INSERT INTO mettre_a_jour (listeID, employeMail) VALUES (?, ?) ON DUPLICATE KEY UPDATE employeMail = VALUES(employeMail)',
            [listeID, employeMail]
        );

        res.status(200).json({ message: "✅ Liste mise à jour" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 📩 Récupérer le dernier employé ayant mis à jour une liste
export const getDernierEmployeMiseAJour = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const listeID = parseInt(req.params.listeID, 10);
        if (isNaN(listeID)) {
            res.status(400).json({ message: "⛔ ID de liste invalide." });
            return;
        }

        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT employeMail FROM mettre_a_jour WHERE listeID = ? ORDER BY listeID DESC LIMIT 1',
            [listeID]
        );

        if (!Array.isArray(rows) || rows.length === 0) {
            res.status(404).json({ message: "❌ Aucune mise à jour enregistrée." });
            return;
        }

        res.status(200).json({ dernierEmploye: rows[0].employeMail });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getListesForUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const employeMail = req.user?.employeMail;

    if (!employeMail) {
        res.status(401).json({ message: "Non autorisé" });
        return;
    }

    console.log("📩 Liste - utilisateur connecté :", employeMail);

    const listes = await getListesByEmploye(employeMail);
    res.status(200).json(listes);
  } catch (error) {
    console.error("❌ Erreur dans getListesForUser :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


