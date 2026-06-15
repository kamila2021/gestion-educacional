import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../entities/User';
import { TwoFactorSecret } from '../entities/TwoFactorSecret';
import { RefreshToken } from '../entities/RefreshToken';
import { Institution } from '../entities/Institution';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: process.env.DATABASE_LOGGING === 'true',
  entities: [User, TwoFactorSecret, RefreshToken, Institution],
  migrations: [__dirname + '/migrations/*.ts'],
  subscribers: [],
});
