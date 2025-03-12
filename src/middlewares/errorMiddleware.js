"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// Middleware global pour gérer les erreurs
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log de l'erreur côté serveur
    res.status(err.status || 500).json({
        message: err.message || 'Erreur interne du serveur',
        details: err.details || null,
    });
};
exports.errorHandler = errorHandler;
