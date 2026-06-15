import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto, Verify2FaDto, RefreshTokenDto } from './auth.dto';
import { validateBody } from '../../common/middleware/validation.middleware';
import { jwtMiddleware, AuthRequest } from '../../common/middleware/jwt.middleware';
import jwt from 'jsonwebtoken';

const router = Router();
const authService = new AuthService();

router.post('/signup', validateBody(SignupDto), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/login', validateBody(LoginDto), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/2fa/setup', jwtMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await authService.setup2FA(req.user!.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/2fa/verify', validateBody(Verify2FaDto), async (req: Request, res: Response, next: NextFunction) => {
  let currentUserId: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      currentUserId = decoded.id;
    } catch (e) {
      // Ignorar error, podría ser un token expirado o un inicio de sesión sin autenticación previa
    }
  }

  try {
    const result = await authService.verify2FA(req.body, currentUserId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', validateBody(RefreshTokenDto), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/logout', validateBody(RefreshTokenDto), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.logout(req.body.refreshToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
