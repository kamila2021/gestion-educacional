import { AppDataSource } from '../../database/connection';
import { Institution } from '../../entities/Institution';
import { User } from '../../entities/User';
import { CreateInstitutionDto, UpdateInstitutionDto, InviteProfessorDto } from './institution.dto';
import { AppError } from '../../common/utils/errors';
import { UserRole } from '@edumanager/shared';
import { EmailService } from '../../common/services/email.service';
import { hashPassword } from '../../common/utils/crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export class InstitutionService {
  private institutionRepo = AppDataSource.getRepository(Institution);
  private userRepo = AppDataSource.getRepository(User);
  private emailService = new EmailService();

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async createInstitution(dto: CreateInstitutionDto, adminUserId: string) {
    const slug = this.generateSlug(dto.name);
    const existing = await this.institutionRepo.findOneBy({ slug });
    if (existing) {
      throw new AppError(400, 'Institution with this slug already exists');
    }

    const adminUser = await this.userRepo.findOneBy({ id: adminUserId });
    if (!adminUser) {
      throw new AppError(404, 'Admin user not found');
    }

    const institution = this.institutionRepo.create({
      name: dto.name,
      slug,
    });

    await this.institutionRepo.save(institution);

    adminUser.institutionId = institution.id;
    await this.userRepo.save(adminUser);

    return institution;
  }

  async getInstitutionById(id: string) {
    const institution = await this.institutionRepo.findOneBy({ id });
    if (!institution) {
      throw new AppError(404, 'Institution not found');
    }
    return institution;
  }

  async updateInstitution(id: string, dto: UpdateInstitutionDto) {
    const institution = await this.getInstitutionById(id);

    if (dto.name) {
      institution.name = dto.name;
      const slug = this.generateSlug(dto.name);
      const existing = await this.institutionRepo.findOne({
        where: { slug }
      });
      if (existing && existing.id !== id) {
        throw new AppError(400, 'Institution with this name/slug already exists');
      }
      institution.slug = slug;
    }

    if (dto.logoUrl !== undefined) {
      institution.logoUrl = dto.logoUrl;
    }

    return await this.institutionRepo.save(institution);
  }

  async inviteProfessor(institutionId: string, dto: InviteProfessorDto) {
    const institution = await this.getInstitutionById(institutionId);

    const existingUser = await this.userRepo.findOneBy({ email: dto.email });
    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    const tempPassword = uuidv4();
    const passwordHash = await hashPassword(tempPassword);

    const professor = this.userRepo.create({
      email: dto.email,
      firstName: 'Profesor',
      lastName: 'Invitado',
      role: UserRole.PROFESSOR,
      passwordHash,
      institutionId: institution.id,
    });

    await this.userRepo.save(professor);

    const invitationToken = jwt.sign(
      {
        userId: professor.id,
        email: professor.email,
        institutionId: institution.id,
        role: professor.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const invitationLink = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/auth/accept-invitation?token=${invitationToken}`;

    await this.emailService.sendInvitationEmail(dto.email, institution.name, invitationLink);

    return {
      message: 'Invitation sent successfully',
      invitationLink,
    };
  }

  async getAllInstitutions() {
    return await this.institutionRepo.find({
      order: { name: 'ASC' }
    });
  }
}
