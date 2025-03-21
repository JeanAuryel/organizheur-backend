import pool from '../config/dbconfig';
import { RowDataPacket } from 'mysql2';
import { verifierEtArchiverListe } from '../models/listeModel';

export interface Tache {
    tacheID?: number;
    tacheLibelle: string;
    tacheEtatCompletion: boolean;
    tacheDateCompletion?: Date | null;
    tacheEcheance: Date;
    tacheCreation: Date;
    tacheMAJ: Date;
    employeMail: string; // 🔥 Un seul employé responsable de la tâche maintenant
    listeID: number;
}

// 🔍 Récupérer toutes les tâches
export const getAllTaches = async (): Promise<Tache[]> => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tache');
    return rows as Tache[];
};

// 🔍 Récupérer une tâche par ID
export const getTacheById = async (employeMail: string, tacheID: number): Promise<Tache | null> => {
    // Vérifier si l'utilisateur est admin
    const [adminCheck] = await pool.query<RowDataPacket[]>(
        'SELECT isAdmin FROM employe WHERE employeMail = ?',
        [employeMail]
    );

    if (adminCheck.length > 0 && adminCheck[0].isAdmin) {
        // 🔥 Admin → Il peut voir toutes les tâches sauf celles des listes personnelles des autres employés
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT t.* 
            FROM tache t 
            JOIN liste l ON t.listeID = l.listeID
            WHERE t.tacheID = ? AND (l.estPersonnel = FALSE OR l.employeMail = ?)`,
            [tacheID, employeMail]
        );
        return rows.length > 0 ? (rows[0] as Tache) : null;
    }

    // 🔥 Employé classique → Il ne peut voir que les tâches des listes auxquelles il a accès
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT t.*
        FROM tache t
        JOIN liste l ON t.listeID = l.listeID
        LEFT JOIN affecter a ON l.categorieID = a.categorieID
        WHERE t.tacheID = ? AND (l.employeMail = ? OR a.employeMail = ?)`,
        [tacheID, employeMail, employeMail]
    );

    return rows.length > 0 ? (rows[0] as Tache) : null;
};

// 🔍 Récupérer toutes les tâches accessibles par un employé
export const getTachesByEmploye = async (employeMail: string): Promise<Tache[]> => {
    try {
        const [adminRows] = await pool.query<RowDataPacket[]>(
            'SELECT isAdmin FROM employe WHERE employeMail = ?',
            [employeMail]
        );

        if (adminRows.length === 0) {
            console.warn(`❌ Employé ${employeMail} non trouvé`);
            return [];
        }

        const isAdmin = adminRows[0].isAdmin;
        let query = '';
        let params: any[] = [];

        if (isAdmin) {
            query = `
                SELECT t.* 
                FROM tache t
                JOIN liste l ON t.listeID = l.listeID
                WHERE l.estPersonnel = FALSE OR l.employeMail = ?`;
            params = [employeMail];
        } else {
            query = `
                SELECT t.* 
                FROM tache t
                JOIN liste l ON t.listeID = l.listeID
                LEFT JOIN affecter a ON l.categorieID = a.categorieID
                WHERE l.employeMail = ? OR a.employeMail = ?`;
            params = [employeMail, employeMail];
        }

        const [rows] = await pool.query<RowDataPacket[]>(query, params);
        return rows as Tache[];
    } catch (error) {
        console.error(`❌ Erreur dans getTachesByEmploye(${employeMail}) :`, error);
        return [];
    }
};



// ➕ Ajouter une tâche et vérifier si la liste doit être archivée
export const addTache = async (tache: Tache): Promise<void> => {
    try {
        const { tacheLibelle, tacheEtatCompletion, tacheDateCompletion, tacheEcheance, tacheCreation, tacheMAJ, employeMail, listeID } = tache;

        await pool.query(
            'INSERT INTO tache (tacheLibelle, tacheEtatCompletion, tacheDateCompletion, tacheEcheance, tacheCreation, tacheMAJ, employeMail, listeID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [tacheLibelle, tacheEtatCompletion, tacheDateCompletion || null, tacheEcheance, tacheCreation, tacheMAJ, employeMail, listeID]
        );

        console.log(`✅ Tâche ajoutée pour la liste ${listeID}.`);

        // Vérifier si la liste doit être archivée
        await verifierEtArchiverListe(listeID);
    } catch (error) {
        console.error("❌ Erreur dans addTache :", error);
    }
};

// 🔄 Mettre à jour une tâche et vérifier l'archivage de la liste
export const updateTache = async (tacheID: number, updatedTache: Partial<Tache>): Promise<void> => {
    try {
        const { tacheEtatCompletion } = updatedTache;

        // Récupérer listeID associé à la tâche
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT listeID FROM tache WHERE tacheID = ?',
            [tacheID]
        );

        if (rows.length === 0) {
            console.log(`❌ Tâche ${tacheID} introuvable.`);
            return;
        }

        const { listeID } = rows[0];

        // Mettre à jour la tâche
        await pool.query(
            'UPDATE tache SET tacheEtatCompletion = ? WHERE tacheID = ?',
            [tacheEtatCompletion, tacheID]
        );

        console.log(`✅ Tâche ${tacheID} mise à jour.`);

        // Vérifier si la liste associée doit être archivée
        await verifierEtArchiverListe(listeID);
    } catch (error) {
        console.error(`❌ Erreur dans updateTache pour la tâche ${tacheID} :`, error);
    }
};

// ❌ Supprimer une tâche et vérifier l'archivage de la liste
export const deleteTache = async (tacheID: number): Promise<void> => {
    try {
        // Récupérer listeID avant de supprimer la tâche
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT listeID FROM tache WHERE tacheID = ?',
            [tacheID]
        );

        if (rows.length === 0) {
            console.log(`❌ Tâche ${tacheID} introuvable.`);
            return;
        }

        const { listeID } = rows[0];

        // Supprimer la tâche
        await pool.query('DELETE FROM tache WHERE tacheID = ?', [tacheID]);
        console.log(`✅ Tâche ${tacheID} supprimée.`);

        // Vérifier si la liste associée doit être archivée
        await verifierEtArchiverListe(listeID);
    } catch (error) {
        console.error(`❌ Erreur dans deleteTache pour la tâche ${tacheID} :`, error);
    }
};
