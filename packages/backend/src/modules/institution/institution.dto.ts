import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateInstitutionDto {
  @IsString()
  @MinLength(3, { message: 'Institution name must be at least 3 characters long' })
  name!: string;
}

export class UpdateInstitutionDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Institution name must be at least 3 characters long' })
  name?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}

export class InviteProfessorDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;
}
