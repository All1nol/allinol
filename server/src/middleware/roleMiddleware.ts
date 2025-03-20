import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

/**
 * Middleware to check if user has required roles
 */
export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized, no user found' });
      return;
    }

    // Check if user has a role and if the role is in the allowed roles
    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Not authorized, insufficient permissions' });
      return;
    }

    next();
  };
};