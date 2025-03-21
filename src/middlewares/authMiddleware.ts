import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types"; // Import de notre type

const SECRET_KEY = process.env.JWT_SECRET || "1A2B3C4D5E6F7G8H9I0J";

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "⛔ Accès non autorisé. Token manquant." });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { employeMail: string; isAdmin: boolean };
        req.user = decoded; // ✅ On attache l'utilisateur à `req.user`
        next();
    } catch (error) {
        res.status(403).json({ message: "⛔ Token invalide." });
    }
};
