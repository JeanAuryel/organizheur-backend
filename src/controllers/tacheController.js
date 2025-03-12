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
exports.deleteTacheData = exports.createTache = exports.getTache = exports.getTaches = void 0;
const tacheModel_1 = require("../models/tacheModel");
// Récupérer toutes les tâches
const getTaches = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taches = yield (0, tacheModel_1.getAllTaches)();
        res.status(200).json(taches);
    }
    catch (error) {
        next(error);
    }
});
exports.getTaches = getTaches;
// Récupérer une tâche par ID
const getTache = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const tache = yield (0, tacheModel_1.getTacheById)(Number(id));
        if (!tache) {
            res.status(404).json({ message: 'Tâche non trouvée' });
            return;
        }
        res.status(200).json(tache);
    }
    catch (error) {
        next(error);
    }
});
exports.getTache = getTache;
// Ajouter une tâche
const createTache = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTache = req.body;
        yield (0, tacheModel_1.addTache)(newTache);
        res.status(201).json({ message: 'Tâche ajoutée avec succès' });
    }
    catch (error) {
        next(error);
    }
});
exports.createTache = createTache;
// Supprimer une tâche
const deleteTacheData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, tacheModel_1.deleteTache)(Number(id));
        res.status(200).json({ message: 'Tâche supprimée avec succès' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTacheData = deleteTacheData;
