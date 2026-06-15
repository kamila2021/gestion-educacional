import { Router, Response, NextFunction } from 'express';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto, UpdateInstitutionDto, InviteProfessorDto } from './institution.dto';
import { validateBody } from '../../common/middleware/validation.middleware';
import { jwtMiddleware, AuthRequest } from '../../common/middleware/jwt.middleware';
import { AppError } from '../../common/utils/errors';
import { UserRole } from '@edumanager/shared';

const router = Router();
const institutionService = new InstitutionService();

// POST /api/v1/institutions (Solo Admin)
router.post(
  '/',
  jwtMiddleware,
  validateBody(CreateInstitutionDto),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== UserRole.ADMIN) {
        throw new AppError(403, 'Access denied: Only administrators can create institutions');
      }
      const result = await institutionService.createInstitution(req.body, req.user.id);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/institutions (Solo Admin)
router.get(
  '/',
  jwtMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== UserRole.ADMIN) {
        throw new AppError(403, 'Access denied: Only administrators can view all institutions');
      }
      const result = await institutionService.getAllInstitutions();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/institutions/:id (Admin o Profesor perteneciente)
router.get(
  '/:id',
  jwtMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const isUserAdmin = req.user?.role === UserRole.ADMIN;
      const isProfessorPerteneciente =
        req.user?.role === UserRole.PROFESSOR && req.user.institutionId === id;

      if (!isUserAdmin && !isProfessorPerteneciente) {
        throw new AppError(403, 'Access denied: You are not authorized to view this institution');
      }

      const result = await institutionService.getInstitutionById(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/v1/institutions/:id (Solo Admin de la institucion o global admin)
router.patch(
  '/:id',
  jwtMiddleware,
  validateBody(UpdateInstitutionDto),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (req.user?.role !== UserRole.ADMIN) {
        throw new AppError(403, 'Access denied: Only administrators can update institutions');
      }

      // Validar que si el administrador ya está asociado a una institución, solo pueda actualizar la suya
      if (req.user.institutionId && req.user.institutionId !== id) {
        throw new AppError(403, 'Access denied: You can only update your own institution');
      }

      const result = await institutionService.updateInstitution(id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/institutions/:id/invite-professor (Solo Admin perteneciente a esta institucion)
router.post(
  '/:id/invite-professor',
  jwtMiddleware,
  validateBody(InviteProfessorDto),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      if (req.user?.role !== UserRole.ADMIN) {
        throw new AppError(403, 'Access denied: Only administrators can invite professors');
      }

      if (req.user.institutionId !== id) {
        throw new AppError(403, 'Access denied: You can only invite professors to your own institution');
      }

      const result = await institutionService.inviteProfessor(id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
