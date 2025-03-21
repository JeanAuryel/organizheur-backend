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
exports.deleteListe = exports.addListe = exports.getListeById = exports.getAllListes = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
// Récupérer toutes les listes
const getAllListes = () => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield dbconfig_1.default.query('SELECT * FROM liste');
    return rows;
});
exports.getAllListes = getAllListes;
// Récupérer une liste par ID
const getListeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield dbconfig_1.default.query('SELECT * FROM liste WHERE listeID = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
});
exports.getListeById = getListeById;
// Ajouter une liste
const addListe = (liste) => __awaiter(void 0, void 0, void 0, function* () {
    const { listeDateCreation, listeDateMAJ, estPersonnel, estArchivee, employeMail, employeMail_1, employeMail_2, categorieID } = liste;
    yield dbconfig_1.default.query('INSERT INTO liste (listeDateCreation, listeDateMAJ, estPersonnel, estArchivee, employeMail, employeMail_1, employeMail_2, categorieID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [listeDateCreation, listeDateMAJ, estPersonnel, estArchivee, employeMail, employeMail_1, employeMail_2, categorieID]);
});
exports.addListe = addListe;
// Supprimer une liste
const deleteListe = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield dbconfig_1.default.query('DELETE FROM liste WHERE listeID = ?', [id]);
});
exports.deleteListe = deleteListe;
