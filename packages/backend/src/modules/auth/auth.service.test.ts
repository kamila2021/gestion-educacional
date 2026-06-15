import { AppDataSource } from '../../database/connection';
import { AuthService } from './auth.service';
import { User } from '../../entities/User';
import { UserRole } from '@edumanager/shared';

describe('AuthService Integration Tests', () => {
  let authService: AuthService;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    authService = new AuthService();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(async () => {
    const rtRepo = AppDataSource.getRepository('refresh_tokens');
    const tfaRepo = AppDataSource.getRepository('two_factor_secrets');
    const userRepo = AppDataSource.getRepository(User);
    
    await rtRepo.createQueryBuilder().delete().execute();
    await tfaRepo.createQueryBuilder().delete().execute();
    await userRepo.createQueryBuilder().delete().execute();
  });

  it('should register a new user successfully and hash password', async () => {
    const signupData = {
      email: 'test@edumanager.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.PROFESSOR,
    };

    const result = await authService.signup(signupData);

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('refreshToken');
    expect(result.user.email).toBe(signupData.email);
    expect(result.user.firstName).toBe(signupData.firstName);
    expect(result.user.role).toBe(signupData.role);
    expect(result.user).not.toHaveProperty('passwordHash');

    const userRepo = AppDataSource.getRepository(User);
    const dbUser = await userRepo.findOneBy({ email: signupData.email });
    expect(dbUser).toBeDefined();
    expect(dbUser!.passwordHash).not.toBe(signupData.password);
  });

  it('should not allow registering an already registered email', async () => {
    const signupData = {
      email: 'duplicate@edumanager.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    await authService.signup(signupData);

    await expect(authService.signup(signupData)).rejects.toThrow('Email already registered');
  });

  it('should login successfully with correct credentials', async () => {
    const signupData = {
      email: 'login@edumanager.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    await authService.signup(signupData);

    const loginResult = await authService.login({
      email: signupData.email,
      password: signupData.password,
    });

    expect(loginResult).toHaveProperty('token');
    expect(loginResult).toHaveProperty('refreshToken');
    expect((loginResult as any).user.email).toBe(signupData.email);
  });

  it('should reject login with incorrect password', async () => {
    const signupData = {
      email: 'wrongpass@edumanager.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    await authService.signup(signupData);

    await expect(authService.login({
      email: signupData.email,
      password: 'wrongpassword',
    })).rejects.toThrow('Invalid email or password');
  });
});
