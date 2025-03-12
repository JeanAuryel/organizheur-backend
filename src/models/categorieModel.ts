import pool from '../config/dbconfig';
import { RowDataPacket } from 'mysql2';

export interface Categorie {
    categorieID?: number;
    nomCategorie: string;
}

// Récupérer toutes les catégories
export const getAllCategories = async (): Promise<Categorie[]> => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categorie');
    return rows as Categorie[];
};

// Récupérer une catégorie par ID
export const getCategorieById = async (id: number): Promise<Categorie | null> => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categorie WHERE categorieID = ?', [id]);
    return rows.length > 0 ? (rows[0] as Categorie) : null;
};

// Ajouter une catégorie
export const addCategorie = async (categorie: Categorie): Promise<void> => {
    await pool.query('INSERT INTO categorie (nomCategorie) VALUES (?)', [categorie.nomCategorie]);
};

// Supprimer une catégorie
export const deleteCategorie = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM categorie WHERE categorieID = ?', [id]);
};
