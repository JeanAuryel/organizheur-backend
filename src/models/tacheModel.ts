import pool from '../config/dbconfig';
import { RowDataPacket } from 'mysql2';

export interface Tache {
    tacheID?: number;
    tacheLibelle: string;
    tacheEtatCompletion: boolean;
    tacheDateCompletion?: Date;
    tacheEcheance: Date;
    tacheCreation: Date;
    tacheMAJ: Date;
    employeMail: number;
    employeMail_1: number;
    employeMail_2: number;
    listeID: number;
}

// Récupérer toutes les tâches
export const getAllTaches = async (): Promise<Tache[]> => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tache');
    return rows as Tache[];
};

// Récupérer une tâche par ID
export const getTacheById = async (id: number): Promise<Tache | null> => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tache WHERE tacheID = ?', [id]);
    return rows.length > 0 ? (rows[0] as Tache) : null;
};

// Ajouter une tâche
export const addTache = async (tache: Tache): Promise<void> => {
    const { tacheLibelle, tacheEtatCompletion, tacheEcheance, tacheCreation, tacheMAJ, employeMail, employeMail_1, employeMail_2, listeID } = tache;
    await pool.query(
        'INSERT INTO tache (tacheLibelle, tacheEtatCompletion, tacheEcheance, tacheCreation, tacheMAJ, employeMail, employeMail_1, employeMail_2, listeID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [tacheLibelle, tacheEtatCompletion, tacheEcheance, tacheCreation, tacheMAJ, employeMail, employeMail_1, employeMail_2, listeID]
    );
};

// Supprimer une tâche
export const deleteTache = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM tache WHERE tacheID = ?', [id]);
};
