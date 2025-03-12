import { Router } from 'express';
import {
    getEmployes,
    getEmploye,
    createEmploye,
    updateEmployeData,
    deleteEmployeData,
} from '../controllers/employeController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const employees = Router();

employees.get('/', authenticateJWT, getEmployes); // Récupérer tous les employés
employees.get('/:email', authenticateJWT , getEmploye); // Récupérer un employé par e-mail
employees.post('/', createEmploye); // Ajouter un nouvel employé
employees.put('/:email', updateEmployeData); // Mettre à jour un employé
employees.delete('/:email', deleteEmployeData); // Supprimer un employé

export default employees;
