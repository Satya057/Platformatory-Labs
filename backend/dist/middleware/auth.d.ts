import { Request, Response, NextFunction } from 'express';
export interface JWTPayload {
    userId: number;
    email: string;
    iat: number;
    exp: number;
}
export declare function authenticateToken(req: Request, res: Response, next: NextFunction): void;
export declare function generateToken(user: {
    id: number;
    email: string;
}): string;
export declare function requireAuth(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map