"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployeData = exports.updateEmployeData = exports.createEmploye = exports.getEmploye = exports.getEmployes = void 0;
const employeModel_1 = require("../models/employeModel");
// Récupérer tous les employés
const getEmployes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employes = yield (0, employeModel_1.getAllEmployes)();
        res.status(200).json(employes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des employés' });
    }
});
exports.getEmployes = getEmployes;
// Récupérer un employé par son e-mail
const getEmploye = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const employe = yield (0, employeModel_1.getEmployeByEmail)(email);
        if (!employe) {
            res.status(404).json({ message: 'Employé non trouvé' });
            return;
        }
        res.status(200).json(employe);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'employé' });
    }
});
exports.getEmploye = getEmploye;
// Ajouter un nouvel employé
const createEmploye = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEmploye = req.body;
        yield (0, employeModel_1.addEmploye)(newEmploye);
        res.status(201).json({ message: 'Employé ajouté avec succès' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'employé' });
    }
});
exports.createEmploye = createEmploye;
// Mettre à jour un employé
const updateEmployeData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const updatedData = req.body;
        yield (0, employeModel_1.updateEmploye)(email, updatedData);
        res.status(200).json({ message: 'Employé mis à jour avec succès' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'employé' });
    }
});
exports.updateEmployeData = updateEmployeData;
// Supprimer un employé
const deleteEmployeData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        yield (0, employeModel_1.deleteEmploye)(email);
        res.status(200).json({ message: 'Employé supprimé avec succès' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'employé' });
    }
});
exports.deleteEmployeData = deleteEmployeData;
