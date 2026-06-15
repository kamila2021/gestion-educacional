import { AppDataSource } from '../../database/connection';
import { User } from '../../entities/User';
import { TwoFactorSecret } from '../../entities/TwoFactorSecret';
import { RefreshToken } from '../../entities/RefreshToken';
import { SignupDto, LoginDto, Verify2FaDto } from './auth.dto';
import { hashPassword, comparePassword } from '../../common/utils/crypto';
import { AppError } from '../../common/utils/errors';
import { UserRole } from '@edumanager/shared';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);
  private tfaRepo = AppDataSource.getRepository(TwoFactorSecret);
  private tokenRepo = AppDataSource.getRepository(RefreshToken);

  private generateTokens(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      institutionId: user.institutionId,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any,
    });

    const refreshToken = jwt.sign({ id: user.id, jti: uuidv4() }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });

    return { token, refreshToken };
  }

  async signup(dto: SignupDto) {
    const existing = await this.userRepo.findOneBy({ email: dto.email });
    if (existing) {
      throw new AppError(400, 'Email already registered');
    }

    const passwordHash = await hashPassword(dto.password);
    const user = this.userRepo.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role || UserRole.ADMIN,
    });

    await this.userRepo.save(user);
    const { token, refreshToken } = this.generateTokens(user);

    // Guardar refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const rt = this.tokenRepo.create({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });
    await this.tokenRepo.save(rt);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { token, refreshToken, user: userWithoutPassword };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user || !(await comparePassword(dto.password, user.passwordHash))) {
      throw new AppError(401, 'Invalid email or password');
    }

    if (user.twoFactorEnabled) {
      return { twoFactorRequired: true, userId: user.id };
    }

    const { token, refreshToken } = this.generateTokens(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const rt = this.tokenRepo.create({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });
    await this.tokenRepo.save(rt);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { token, refreshToken, user: userWithoutPassword };
  }

  async setup2FA(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const secret = speakeasy.generateSecret({
      name: `EduManager (${user.email})`,
      issuer: 'EduManager',
    });

    let tfa = await this.tfaRepo.findOneBy({ userId });
    if (tfa) {
      tfa.secret = secret.base32;
      tfa.enabled = false;
    } else {
      tfa = this.tfaRepo.create({
        userId,
        secret: secret.base32,
        enabled: false,
      });
    }

    await this.tfaRepo.save(tfa);
    const qrCode = await qrcode.toDataURL(secret.otpauth_url!);

    return { secret: secret.base32, qrCode };
  }

  async verify2FA(dto: Verify2FaDto, currentUserId?: string) {
    const targetUserId = dto.userId || currentUserId;
    if (!targetUserId) {
      throw new AppError(400, 'User identification required');
    }

    const user = await this.userRepo.findOneBy({ id: targetUserId });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const tfa = await this.tfaRepo.findOneBy({ userId: targetUserId });
    if (!tfa) {
      throw new AppError(400, '2FA has not been set up for this user');
    }

    const verified = speakeasy.totp.verify({
      secret: tfa.secret,
      encoding: 'base32',
      token: dto.code,
      window: 2,
    });

    if (!verified) {
      throw new AppError(400, 'Invalid 2FA code');
    }

    if (!tfa.enabled) {
      tfa.enabled = true;
      await this.tfaRepo.save(tfa);
      user.twoFactorEnabled = true;
      await this.userRepo.save(user);
    }

    const { token, refreshToken } = this.generateTokens(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const rt = this.tokenRepo.create({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });
    await this.tokenRepo.save(rt);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { token, refreshToken, user: userWithoutPassword };
  }

  async refresh(tokenStr: string) {
    const rt = await this.tokenRepo.findOne({
      where: { token: tokenStr },
      relations: ['user'],
    });

    if (!rt || rt.expiresAt < new Date()) {
      if (rt) await this.tokenRepo.remove(rt);
      throw new AppError(401, 'Invalid or expired refresh token');
    }

    const { token } = this.generateTokens(rt.user);
    return { token };
  }

  async logout(tokenStr: string) {
    const rt = await this.tokenRepo.findOneBy({ token: tokenStr });
    if (rt) {
      await this.tokenRepo.remove(rt);
    }
    return { success: true };
  }
}
