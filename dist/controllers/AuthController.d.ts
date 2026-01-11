import type { Request, Response } from "express";
export declare class AuthController {
    static create: (req: Request, res: Response) => Promise<void>;
    static confirmAccount: (req: Request, res: Response) => Promise<void>;
    static login: (req: Request, res: Response) => Promise<void>;
    static recoverPassword: (req: Request, res: Response) => Promise<void>;
    static valdiateToken: (req: Request, res: Response) => Promise<void>;
    static resetPasswordWithToken: (req: Request, res: Response) => Promise<void>;
    static getAuthUser: (req: Request, res: Response) => Promise<void>;
    static updateCurrentPassword: (req: Request, res: Response) => Promise<void>;
    static checkPassword: (req: Request, res: Response) => Promise<void>;
    static changeUsernameOrEmail: (req: Request, res: Response) => Promise<void>;
}
