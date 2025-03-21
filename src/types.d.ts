import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: {
        employeMail: string;
        isAdmin: boolean;
    };
}
