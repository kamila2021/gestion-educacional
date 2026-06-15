import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { UserRole } from '@edumanager/shared';

export class SignupDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid role' })
  role?: UserRole;
}

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @IsString()
  password!: string;
}

export class Verify2FaDto {
  @IsString()
  @MinLength(6, { message: 'Verification code must be 6 digits' })
  code!: string;

  @IsOptional()
  @IsUUID('4', { message: 'Invalid user ID' })
  userId?: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}

export class AcceptInvitationDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;
}

