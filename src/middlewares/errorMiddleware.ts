import { Request, Response, NextFunction } from 'express';

// Middleware global pour gérer les erreurs
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error(err.stack); // Log de l'erreur côté serveur
    res.status(err.status || 500).json({
        message: err.message || 'Erreur interne du serveur',
        details: err.details || null,
    });
};
