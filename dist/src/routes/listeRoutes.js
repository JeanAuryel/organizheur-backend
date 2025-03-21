"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const listeController_1 = require("../controllers/listeController");
const router = (0, express_1.Router)();
router.get('/', listeController_1.getListes); // Récupérer toutes les listes
router.get('/:id', listeController_1.getListe); // Récupérer une liste par ID
router.post('/', listeController_1.createListe); // Ajouter une liste
router.delete('/:id', listeController_1.deleteListeData); // Supprimer une liste
exports.default = router;
