import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

// Middleware to check if user has one of the allowed roles
export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized, no user' });
      return;
    }

    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ 
        message: `Not authorized. Required role: ${allowedRoles.join(' or ')}`
      });
    }
  };
}; 