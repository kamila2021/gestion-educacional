import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const validateBody = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(dtoClass, req.body);
    const errors = await validate(instance);
    
    if (errors.length > 0) {
      const details = errors.map(err => ({
        property: err.property,
        constraints: err.constraints ? Object.values(err.constraints) : [],
      }));
      return res.status(400).json({ error: 'Validation failed', details });
    }
    
    req.body = instance;
    next();
  };
};
