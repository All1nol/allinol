import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

// Define a User type to extend Request
declare global {
  namespace Express {
    interface User {
      id: string;
      username?: string;
      email?: string;
      role?: UserRole;
    }
    
    interface Request {
      user?: User;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication token required' });
      return;
    }
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.user = { id: decodedToken.id };
    
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

/**
 * Middleware to check user roles
 */
export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    
    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Insufficient permissions' });
      return;
    }
    
    next();
  };
};
