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
exports.deleteListeData = exports.createListe = exports.getListe = exports.getListes = void 0;
const listeModel_1 = require("../models/listeModel");
// Récupérer toutes les listes
const getListes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listes = yield (0, listeModel_1.getAllListes)();
        res.status(200).json(listes);
    }
    catch (error) {
        next(error);
    }
});
exports.getListes = getListes;
// Récupérer une liste par ID
const getListe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const liste = yield (0, listeModel_1.getListeById)(Number(id));
        if (!liste) {
            res.status(404).json({ message: 'Liste non trouvée' });
            return;
        }
        res.status(200).json(liste);
    }
    catch (error) {
        next(error);
    }
});
exports.getListe = getListe;
// Ajouter une liste
const createListe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newListe = req.body;
        yield (0, listeModel_1.addListe)(newListe);
        res.status(201).json({ message: 'Liste ajoutée avec succès' });
    }
    catch (error) {
        next(error);
    }
});
exports.createListe = createListe;
// Supprimer une liste
const deleteListeData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, listeModel_1.deleteListe)(Number(id));
        res.status(200).json({ message: 'Liste supprimée avec succès' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteListeData = deleteListeData;
