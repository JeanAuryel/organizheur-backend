"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tacheController_1 = require("../controllers/tacheController");
const router = (0, express_1.Router)();
router.get('/', tacheController_1.getTaches); // Récupérer toutes les tâches
router.get('/:id', tacheController_1.getTache); // Récupérer une tâche par ID
router.post('/', tacheController_1.createTache); // Ajouter une tâche
router.delete('/:id', tacheController_1.deleteTacheData); // Supprimer une tâche
exports.default = router;
