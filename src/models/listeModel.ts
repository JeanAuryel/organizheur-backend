import pool from '../config/dbconfig';
import { RowDataPacket } from 'mysql2';

export interface Liste {
    listeID?: number;
    listeDateCreation: Date;
    listeDateMAJ: Date;
    estPersonnel: boolean;
    estArchivee: boolean;
    listeArchivee?: Date;
    employeMail: number;
    employeMail_1: number;
    employeMail_2: number;
    categorieID: number;
}

// Récupérer toutes les listes
export const getAllListes = async (): Promise<Liste[]> => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM liste');
    return rows as Liste[];
};

// Récupérer une liste par ID
export const getListeById = async (id: number): Promise<Liste | null> => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM liste WHERE listeID = ?', [id]);
    return rows.length > 0 ? (rows[0] as Liste) : null;
};

// Ajouter une liste
export const addListe = async (liste: Liste): Promise<void> => {
    const { listeDateCreation, listeDateMAJ, estPersonnel, estArchivee, employeMail, employeMail_1, employeMail_2, categorieID } = liste;
    await pool.query(
        'INSERT INTO liste (listeDateCreation, listeDateMAJ, estPersonnel, estArchivee, employeMail, employeMail_1, employeMail_2, categorieID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [listeDateCreation, listeDateMAJ, estPersonnel, estArchivee, employeMail, employeMail_1, employeMail_2, categorieID]
    );
};

// Supprimer une liste
export const deleteListe = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM liste WHERE listeID = ?', [id]);
};
