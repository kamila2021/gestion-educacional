import { AppDataSource } from '../../database/connection';
import { InstitutionService } from './institution.service';
import { User } from '../../entities/User';
import { Institution } from '../../entities/Institution';
import { UserRole } from '@edumanager/shared';

describe('InstitutionService Integration Tests', () => {
  let institutionService: InstitutionService;
  let adminUser: User;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    institutionService = new InstitutionService();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(async () => {
    const userRepo = AppDataSource.getRepository(User);
    const instRepo = AppDataSource.getRepository(Institution);
    
    await userRepo.createQueryBuilder().delete().execute();
    await instRepo.createQueryBuilder().delete().execute();

    adminUser = userRepo.create({
      email: 'admin@edumanager.com',
      firstName: 'Admin',
      lastName: 'EduManager',
      role: UserRole.ADMIN,
      passwordHash: 'dummyhash',
    });
    await userRepo.save(adminUser);
  });

  it('should create an institution and update admin association', async () => {
    const createData = { name: 'Colegio San Jose' };
    const inst = await institutionService.createInstitution(createData, adminUser.id);

    expect(inst).toHaveProperty('id');
    expect(inst.name).toBe(createData.name);
    expect(inst.slug).toBe('colegio-san-jose');
    expect(inst.logoUrl).toBeNull();

    const userRepo = AppDataSource.getRepository(User);
    const dbAdmin = await userRepo.findOneBy({ id: adminUser.id });
    expect(dbAdmin!.institutionId).toBe(inst.id);
  });

  it('should not allow creating an institution with duplicate slug', async () => {
    const createData = { name: 'Colegio San Jose' };
    await institutionService.createInstitution(createData, adminUser.id);

    await expect(
      institutionService.createInstitution({ name: 'Colegio San Jose' }, adminUser.id)
    ).rejects.toThrow('Institution with this slug already exists');
  });

  it('should retrieve an institution by ID', async () => {
    const inst = await institutionService.createInstitution({ name: 'Colegio San Jose' }, adminUser.id);
    const found = await institutionService.getInstitutionById(inst.id);

    expect(found).toBeDefined();
    expect(found.id).toBe(inst.id);
    expect(found.name).toBe(inst.name);
  });

  it('should update institution details', async () => {
    const inst = await institutionService.createInstitution({ name: 'Colegio San Jose' }, adminUser.id);
    const updateData = { name: 'Colegio San Jose Renovado', logoUrl: 'http://example.com/logo.png' };

    const updated = await institutionService.updateInstitution(inst.id, updateData);

    expect(updated.name).toBe(updateData.name);
    expect(updated.slug).toBe('colegio-san-jose-renovado');
    expect(updated.logoUrl).toBe(updateData.logoUrl);
  });

  it('should invite a professor successfully', async () => {
    const inst = await institutionService.createInstitution({ name: 'Colegio San Jose' }, adminUser.id);
    const inviteData = { email: 'profesor@sanjose.cl' };

    const result = await institutionService.inviteProfessor(inst.id, inviteData);

    expect(result).toHaveProperty('message');
    expect(result.message).toBe('Invitation sent successfully');
    expect(result).toHaveProperty('invitationLink');
    expect(result.invitationLink).toContain('/auth/accept-invitation?token=');

    const userRepo = AppDataSource.getRepository(User);
    const dbProfessor = await userRepo.findOneBy({ email: inviteData.email });
    expect(dbProfessor).toBeDefined();
    expect(dbProfessor!.role).toBe(UserRole.PROFESSOR);
    expect(dbProfessor!.institutionId).toBe(inst.id);
    expect(dbProfessor!.firstName).toBe('Profesor');
    expect(dbProfessor!.lastName).toBe('Invitado');
  });

  it('should reject invitation if email is already registered', async () => {
    const inst = await institutionService.createInstitution({ name: 'Colegio San Jose' }, adminUser.id);
    const inviteData = { email: adminUser.email };

    await expect(
      institutionService.inviteProfessor(inst.id, inviteData)
    ).rejects.toThrow('Email already registered');
  });
});
