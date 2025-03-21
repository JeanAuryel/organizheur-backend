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
exports.deleteTache = exports.addTache = exports.getTacheById = exports.getAllTaches = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
// Récupérer toutes les tâches
const getAllTaches = () => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield dbconfig_1.default.query('SELECT * FROM tache');
    return rows;
});
exports.getAllTaches = getAllTaches;
// Récupérer une tâche par ID
const getTacheById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield dbconfig_1.default.query('SELECT * FROM tache WHERE tacheID = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
});
exports.getTacheById = getTacheById;
// Ajouter une tâche
const addTache = (tache) => __awaiter(void 0, void 0, void 0, function* () {
    const { tacheLibelle, tacheEtatCompletion, tacheEcheance, tacheCreation, tacheMAJ, employeMail, employeMail_1, employeMail_2, listeID } = tache;
    yield dbconfig_1.default.query('INSERT INTO tache (tacheLibelle, tacheEtatCompletion, tacheEcheance, tacheCreation, tacheMAJ, employeMail, employeMail_1, employeMail_2, listeID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [tacheLibelle, tacheEtatCompletion, tacheEcheance, tacheCreation, tacheMAJ, employeMail, employeMail_1, employeMail_2, listeID]);
});
exports.addTache = addTache;
// Supprimer une tâche
const deleteTache = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield dbconfig_1.default.query('DELETE FROM tache WHERE tacheID = ?', [id]);
});
exports.deleteTache = deleteTache;
