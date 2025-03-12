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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const employeModel_1 = require("../models/employeModel");
const SECRET_KEY = process.env.JWT_SECRET || '1A2B3C4D5E6F7G8H9I0J';
// Connexion de l'utilisateur avec redirection selon le rôle
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeMail, employeMdp } = req.body;
        // Vérifier si l'utilisateur existe
        const employe = yield (0, employeModel_1.getEmployeByEmail)(employeMail);
        if (!employe) {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            return;
        }
        // Vérifier le mot de passe
        const isMatch = yield bcrypt_1.default.compare(employeMdp, employe.employeMdp);
        if (!isMatch) {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            return;
        }
        // Déterminer l'URL de redirection selon le rôle
        const dashboardUrl = employe.isAdmin
            ? '/dashboard/admin' // URL pour les admins
            : '/dashboard/user'; // URL pour les utilisateurs classiques
        // Générer le token JWT
        const token = jsonwebtoken_1.default.sign({ employeMail: employe.employeMail, isAdmin: employe.isAdmin }, SECRET_KEY, { expiresIn: '2h' });
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
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
