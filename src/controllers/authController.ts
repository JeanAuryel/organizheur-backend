import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getEmployeByEmail } from '../models/employeModel';

const SECRET_KEY = process.env.JWT_SECRET || '1A2B3C4D5E6F7G8H9I0J';

// Connexion de l'utilisateur avec redirection selon le rôle
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { employeMail, employeMdp } = req.body;

        // Vérifier si l'utilisateur existe
        const employe = await getEmployeByEmail(employeMail);
        if (!employe) {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            return;
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(employeMdp, employe.employeMdp);
        if (!isMatch) {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            return;
        }

        // Déterminer l'URL de redirection selon le rôle
        const dashboardUrl = employe.isAdmin
            ? '/dashboard/admin' // URL pour les admins
            : '/dashboard/user'; // URL pour les utilisateurs classiques

        // Générer le token JWT
        const token = jwt.sign(
            { employeMail: employe.employeMail, isAdmin: employe.isAdmin },
            SECRET_KEY,
            { expiresIn: '2h' }
        );

        // Retourner l'URL de redirection avec le token
        res.status(200).json({
            message: 'Connexion réussie',
            token,
            employe: {
                employeMail: employe.employeMail,
                employeNom: employe.employeNom,
                employePrenom: employe.employePrenom,
                isAdmin: employe.isAdmin
            },
            redirectUrl: dashboardUrl
        });
    } catch (error) {
        next(error);
    }
};
