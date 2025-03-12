"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employeController_1 = require("../controllers/employeController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const employees = (0, express_1.Router)();
employees.get('/', authMiddleware_1.authenticateJWT, employeController_1.getEmployes); // Récupérer tous les employés
employees.get('/:email', authMiddleware_1.authenticateJWT, employeController_1.getEmploye); // Récupérer un employé par e-mail
employees.post('/', employeController_1.createEmploye); // Ajouter un nouvel employé
employees.put('/:email', employeController_1.updateEmployeData); // Mettre à jour un employé
employees.delete('/:email', employeController_1.deleteEmployeData); // Supprimer un employé
exports.default = employees;
