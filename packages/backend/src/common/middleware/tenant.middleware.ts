import { Response, NextFunction } from 'express';
import { AuthRequest } from './jwt.middleware';
import { AppError } from '../utils/errors';

export const tenantMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError(401, 'User authentication required');
  }

  if (!req.user.institutionId) {
    throw new AppError(403, 'Access denied: No institution associated with this user');
  }

  next();
};
