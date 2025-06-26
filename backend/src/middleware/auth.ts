import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import type { User } from '../database/userRepository';
import { UserRepository } from '../database/userRepository';

export interface JWTPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    // Add user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function generateToken(user: { id: number; email: string }): string {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

  const payload = { userId: user.id, email: user.email };
  const options: SignOptions = { expiresIn: expiresIn as any };

  return jwt.sign(payload, secret, options);
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!(req as any).user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
} 