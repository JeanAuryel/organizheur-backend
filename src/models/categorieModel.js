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
exports.deleteCategorie = exports.addCategorie = exports.getCategorieById = exports.getAllCategories = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
// Récupérer toutes les catégories
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield dbconfig_1.default.query('SELECT * FROM categorie');
    return rows;
});
exports.getAllCategories = getAllCategories;
// Récupérer une catégorie par ID
const getCategorieById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield dbconfig_1.default.query('SELECT * FROM categorie WHERE categorieID = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
});
exports.getCategorieById = getCategorieById;
// Ajouter une catégorie
const addCategorie = (categorie) => __awaiter(void 0, void 0, void 0, function* () {
    yield dbconfig_1.default.query('INSERT INTO categorie (nomCategorie) VALUES (?)', [categorie.nomCategorie]);
});
exports.addCategorie = addCategorie;
// Supprimer une catégorie
const deleteCategorie = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield dbconfig_1.default.query('DELETE FROM categorie WHERE categorieID = ?', [id]);
});
exports.deleteCategorie = deleteCategorie;
