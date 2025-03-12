import pool from '../config/dbconfig';
import { RowDataPacket } from 'mysql2';

export interface Employe {
    employeMail: string;
    employeNom: string;
    employePrenom: string;
    employeMdp: string;
    isAdmin: boolean;
}

// Récupérer tous les employés
export const getAllEmployes = async (): Promise<Employe[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM employe'
    );
    return rows as Employe[];
};

// Récupérer un employé par son e-mail
export const getEmployeByEmail = async (email: string): Promise<Employe | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM employe WHERE employeMail = ?',
        [email]
    );
    return rows.length > 0 ? (rows[0] as Employe) : null;
};

// Ajouter un nouvel employé
export const addEmploye = async (employe: Employe): Promise<void> => {
    const { employeMail, employeNom, employePrenom, employeMdp, isAdmin } = employe;
    await pool.query(
        'INSERT INTO employe (employeMail, employeNom, employePrenom, employeMdp, isAdmin) VALUES (?, ?, ?, ?, ?)',
        [employeMail, employeNom, employePrenom, employeMdp, isAdmin]
    );
};

// Mettre à jour un employé
export const updateEmploye = async (email: string, updatedEmploye: Partial<Employe>): Promise<void> => {
    const { employeNom, employePrenom, employeMdp, isAdmin } = updatedEmploye;
    await pool.query(
        'UPDATE employe SET employeNom = ?, employePrenom = ?, employeMdp = ?, isAdmin = ? WHERE employeMail = ?',
        [employeNom, employePrenom, employeMdp, isAdmin, email]
    );
};

// Supprimer un employé
export const deleteEmploye = async (email: string): Promise<void> => {
    await pool.query('DELETE FROM employe WHERE employeMail = ?', [email]);
};