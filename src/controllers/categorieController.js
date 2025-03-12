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
exports.deleteCategorieData = exports.createCategorie = exports.getCategorie = exports.getCategories = void 0;
const categorieModel_1 = require("../models/categorieModel");
// Récupérer toutes les catégories
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield (0, categorieModel_1.getAllCategories)();
        res.status(200).json(categories);
    }
    catch (error) {
        next(error);
    }
});
exports.getCategories = getCategories;
// Récupérer une catégorie par ID
const getCategorie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const categorie = yield (0, categorieModel_1.getCategorieById)(Number(id));
        if (!categorie) {
            res.status(404).json({ message: 'Catégorie non trouvée' });
            return;
        }
        res.status(200).json(categorie);
    }
    catch (error) {
        next(error);
    }
});
exports.getCategorie = getCategorie;
// Ajouter une catégorie
const createCategorie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCategorie = req.body;
        yield (0, categorieModel_1.addCategorie)(newCategorie);
        res.status(201).json({ message: 'Catégorie ajoutée avec succès' });
    }
    catch (error) {
        next(error);
    }
});
exports.createCategorie = createCategorie;
// Supprimer une catégorie
const deleteCategorieData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, categorieModel_1.deleteCategorie)(Number(id));
        res.status(200).json({ message: 'Catégorie supprimée avec succès' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCategorieData = deleteCategorieData;
