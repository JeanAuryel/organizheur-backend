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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmploye = exports.updateEmploye = exports.addEmploye = exports.getEmployeByEmail = exports.getAllEmployes = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
// Récupérer tous les employés
const getAllEmployes = () => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield dbconfig_1.default.query('SELECT * FROM employe');
    return rows;
});
exports.getAllEmployes = getAllEmployes;
// Récupérer un employé par son e-mail
const getEmployeByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield dbconfig_1.default.query('SELECT * FROM employe WHERE employeMail = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
});
exports.getEmployeByEmail = getEmployeByEmail;
// Ajouter un nouvel employé
const addEmploye = (employe) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeMail, employeNom, employePrenom, employeMdp, isAdmin } = employe;
    yield dbconfig_1.default.query('INSERT INTO employe (employeMail, employeNom, employePrenom, employeMdp, isAdmin) VALUES (?, ?, ?, ?, ?)', [employeMail, employeNom, employePrenom, employeMdp, isAdmin]);
});
exports.addEmploye = addEmploye;
// Mettre à jour un employé
const updateEmploye = (email, updatedEmploye) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeNom, employePrenom, employeMdp, isAdmin } = updatedEmploye;
    yield dbconfig_1.default.query('UPDATE employe SET employeNom = ?, employePrenom = ?, employeMdp = ?, isAdmin = ? WHERE employeMail = ?', [employeNom, employePrenom, employeMdp, isAdmin, email]);
});
exports.updateEmploye = updateEmploye;
// Supprimer un employé
const deleteEmploye = (email) => __awaiter(void 0, void 0, void 0, function* () {
    yield dbconfig_1.default.query('DELETE FROM employe WHERE employeMail = ?', [email]);
});
exports.deleteEmploye = deleteEmploye;
