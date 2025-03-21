"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categorieController_1 = require("../controllers/categorieController");
const router = (0, express_1.Router)();
router.get('/', categorieController_1.getCategories); // Récupérer toutes les catégories
router.get('/:id', categorieController_1.getCategorie); // Récupérer une catégorie par ID
router.post('/', categorieController_1.createCategorie); // Ajouter une catégorie
router.delete('/:id', categorieController_1.deleteCategorieData); // Supprimer une catégorie
exports.default = router;
