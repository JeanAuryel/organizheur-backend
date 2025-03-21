import pool from '../config/dbconfig';
import { RowDataPacket } from 'mysql2';

export interface Liste {
    listeID?: number;
    listeDateCreation: Date;
    listeDateMAJ: Date;
    estPersonnel: boolean;
    estArchivee?: boolean;
    listeArchivee?: Date | null;
    employeMail: string; // 🔥 Un seul employé responsable de la liste maintenant
    categorieID: number;
}

// 🔍 Récupérer toutes les listes
export const getAllListes = async (): Promise<Liste[]> => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM liste');
    return rows as Liste[];
};

// 🔍 Récupérer une liste par ID
export const getListeById = async (employeMail: string, id: number): Promise<Liste | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM liste 
        WHERE listeID = ? 
        AND (estPersonnel = TRUE OR employeMail = ?)`,
        [id, employeMail]
    );
    console.log("ID reçu dans getListeById :", id);
    console.log("Type de ID :", typeof id);

    return rows.length > 0 ? (rows[0] as Liste) : null;
};

// 🔍 Récupérer toutes les listes accessibles par un employé
export const getListesByEmploye = async (employeMail: string): Promise<Liste[]> => {
    try {
        const [adminRows] = await pool.query<RowDataPacket[]>(
            'SELECT isAdmin FROM employe WHERE employeMail = ?',
            [employeMail]
        );

        if (adminRows.length === 0) {
            console.warn(`❌ Aucun employé trouvé avec l'e-mail : ${employeMail}`);
            return [];
        }

        const isAdmin = adminRows[0].isAdmin;
        let query = '';
        let params: any[] = [];

        if (isAdmin) {
            query = `
                SELECT * FROM liste 
                WHERE estPersonnel = FALSE OR employeMail = ?`;
            params = [employeMail];
        } else {
            query = `
                SELECT l.* 
                FROM liste l
                LEFT JOIN affecter a ON l.categorieID = a.categorieID
                WHERE l.employeMail = ? OR a.employeMail = ?`;
            params = [employeMail, employeMail];
        }

        const [rows] = await pool.query<RowDataPacket[]>(query, params);
        return rows as Liste[];
    } catch (error) {
        console.error(`❌ Erreur dans getListesByEmploye(${employeMail}) :`, error);
        return [];
    }
};

// ➕ Ajouter une liste
export const addListe = async (liste: Liste): Promise<void> => {
    const { listeDateCreation, listeDateMAJ, estPersonnel, estArchivee, listeArchivee, employeMail, categorieID } = liste;
    await pool.query(
        'INSERT INTO liste (listeDateCreation, listeDateMAJ, estPersonnel, estArchivee, listeArchivee, employeMail, categorieID) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [listeDateCreation, listeDateMAJ, estPersonnel, estArchivee, listeArchivee || null, employeMail, categorieID]
    );
};

// 🔄 Vérifier si toutes les tâches d'une liste sont complètes et archiver la liste si nécessaire
export const verifierEtArchiverListe = async (listeID: number): Promise<void> => {
    try {
        // Vérifier si toutes les tâches sont complètes
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT COUNT(*) AS incompletes FROM tache WHERE listeID = ? AND tacheEtatCompletion = FALSE',
            [listeID]
        );

        const { incompletes } = rows[0]; // Nombre de tâches non complètes

        if (incompletes === 0) {
            // Si aucune tâche incomplète, archiver la liste
            await pool.query(
                'UPDATE liste SET estArchivee = TRUE, listeArchivee = NOW() WHERE listeID = ? AND estArchivee = FALSE',
                [listeID]
            );
            console.log(`✅ Liste ${listeID} archivée.`);
        } else {
            // Sinon, s'assurer que la liste n'est pas archivée
            await pool.query(
                'UPDATE liste SET estArchivee = FALSE, listeArchivee = NULL WHERE listeID = ? AND estArchivee = TRUE',
                [listeID]
            );
            console.log(`🔄 Liste ${listeID} reste active (tâches incomplètes : ${incompletes}).`);
        }
    } catch (error) {
        console.error(`❌ Erreur lors de la vérification d'archivage de la liste ${listeID} :`, error);
    }
};

// ❌ Supprimer une liste
export const deleteListe = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM liste WHERE listeID = ?', [id]);
};