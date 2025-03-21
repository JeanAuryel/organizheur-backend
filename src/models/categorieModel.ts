import pool from '../config/dbconfig';
import { RowDataPacket } from 'mysql2';

export interface Categorie {
    categorieID?: number;
    nomCategorie: string;
}

// Récupérer toutes les catégories
export const getCategoriesByEmploye = async (employeMail: string): Promise<Categorie[]> => {
    const [adminCheck] = await pool.query<RowDataPacket[]>(
        'SELECT isAdmin FROM employe WHERE employeMail = ?', [employeMail]
    );

    if (adminCheck.length === 0) return [];

    if (adminCheck[0].isAdmin) {
        // Admin → voit toutes les catégories
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categorie');
        return rows as Categorie[];
    }

    // Employé classique → voit seulement les catégories auxquelles il est affecté
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT c.* 
         FROM categorie c
         LEFT JOIN affecter a ON c.categorieID = a.categorieID
         WHERE a.employeMail = ?`,
        [employeMail]
    );

    return rows as Categorie[];
};


// Récupérer une catégorie par ID
export const getCategorieById = async (employeMail: string, id: number): Promise<Categorie | null> => {
    // Vérifier si l'utilisateur est admin
    const [adminCheck] = await pool.query<RowDataPacket[]>(
        'SELECT isAdmin FROM employe WHERE employeMail = ?',
        [employeMail]
    );

    if (adminCheck.length > 0 && adminCheck[0].isAdmin) {
        // 🔥 Admin → Il peut voir toutes les catégories
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categorie WHERE categorieID = ?', [id]);
        return rows.length > 0 ? (rows[0] as Categorie) : null;
    }

    // 🔥 Employé classique → Il ne peut voir que les catégories auxquelles il est affecté
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT c.* 
        FROM categorie c
        JOIN affecter a ON c.categorieID = a.categorieID
        WHERE c.categorieID = ? AND a.employeMail = ?`,
        [id, employeMail]
    );

    return rows.length > 0 ? (rows[0] as Categorie) : null;
};


// Ajouter une catégorie
export const addCategorie = async (employeMail: string, categorie: Categorie): Promise<void> => {
    // Vérifier si l'utilisateur est admin
    const [adminCheck] = await pool.query<RowDataPacket[]>(
        'SELECT isAdmin FROM employe WHERE employeMail = ?',
        [employeMail]
    );

    if (adminCheck.length === 0 || !adminCheck[0].isAdmin) {
        console.error(`⛔ Accès refusé : ${employeMail} n'est pas administrateur.`);
        throw new Error("Accès refusé : Seuls les administrateurs peuvent ajouter des catégories.");
    }

    await pool.query('INSERT INTO categorie (nomCategorie) VALUES (?)', [categorie.nomCategorie]);
};


// Supprimer une catégorie
export const deleteCategorie = async (employeMail: string, id: number): Promise<void> => {
    // Vérifier si l'utilisateur est admin
    const [adminCheck] = await pool.query<RowDataPacket[]>(
        'SELECT isAdmin FROM employe WHERE employeMail = ?',
        [employeMail]
    );

    if (adminCheck.length === 0 || !adminCheck[0].isAdmin) {
        console.error(`⛔ Accès refusé : ${employeMail} n'est pas administrateur.`);
        throw new Error("Accès refusé : Seuls les administrateurs peuvent supprimer des catégories.");
    }

    await pool.query('DELETE FROM categorie WHERE categorieID = ?', [id]);
};
