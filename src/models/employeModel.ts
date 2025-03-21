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
export const getAllEmployes = async (employeMail: string): Promise<Employe[]> => {
    // Vérifier si l'utilisateur est admin
    const [adminCheck] = await pool.query<RowDataPacket[]>(
        'SELECT isAdmin FROM employe WHERE employeMail = ?',
        [employeMail]
    );

    if (adminCheck.length === 0) {
        throw new Error("Employé introuvable.");
    }

    const isAdmin = adminCheck[0].isAdmin;

    if (isAdmin) {
        // Si l'utilisateur est admin, il voit tout
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM employe');
        return rows as Employe[];
    } else {
        // Sinon, il ne voit que lui-même
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM employe WHERE employeMail = ?',
            [employeMail]
        );
        return rows as Employe[];
    }
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

    const updates: string[] = [];
    const values: any[] = [];

    if (employeNom !== undefined) { updates.push("employeNom = ?"); values.push(employeNom); }
    if (employePrenom !== undefined) { updates.push("employePrenom = ?"); values.push(employePrenom); }
    if (employeMdp !== undefined) { updates.push("employeMdp = ?"); values.push(employeMdp); }
    if (isAdmin !== undefined) { updates.push("isAdmin = ?"); values.push(isAdmin); }

    if (updates.length === 0) return; // Si aucun champ n'est fourni, on ne fait rien.

    values.push(email); // Ajoute l'ID en dernier

    const sql = `UPDATE employe SET ${updates.join(", ")} WHERE employeMail = ?`;
    await pool.query(sql, values);
};


// Supprimer un employé
export const deleteEmploye = async (email: string): Promise<boolean> => {
    try {
        const employe = await getEmployeByEmail(email);
        if (!employe) {
            console.log(`❌ Suppression annulée : employé ${email} introuvable.`);
            return false;
        }

        await pool.query('DELETE FROM employe WHERE employeMail = ?', [email]);
        console.log(`✅ Employé ${email} supprimé.`);
        return true;
    } catch (error) {
        console.error("❌ Erreur dans deleteEmploye :", error);
        return false;
    }
};
