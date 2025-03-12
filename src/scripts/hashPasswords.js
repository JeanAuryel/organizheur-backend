"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
const bcrypt = __importStar(require("bcrypt"));
const updatePasswords = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Récupérer tous les employés avec leur mot de passe actuel
        const [rows] = yield dbconfig_1.default.query('SELECT employeMail, employeMdp FROM employé');
        for (const employe of rows) {
            const { employeMail, employeMdp } = employe;
            // Vérifier si le mot de passe est déjà haché (bcrypt commence par "$2b$")
            if (employeMdp.startsWith('$2b$')) {
                console.log(`✅ Mot de passe déjà haché pour ${employeMail}, aucun changement.`);
                continue;
            }
            // Hacher le mot de passe
            const saltRounds = 10;
            const hashedPassword = yield bcrypt.hash(employeMdp, saltRounds);
            // Mettre à jour le mot de passe en base
            yield dbconfig_1.default.query('UPDATE employé SET employeMdp = ? WHERE employeMail = ?', [hashedPassword, employeMail]);
            console.log(`🔄 Mot de passe mis à jour pour ${employeMail}`);
        }
        console.log('✅ Tous les mots de passe ont été mis à jour avec succès.');
        process.exit(); // Quitter le script proprement
    }
    catch (error) {
        console.error('❌ Erreur lors de la mise à jour des mots de passe :', error);
        process.exit(1);
    }
});
// Exécuter le script
updatePasswords();
