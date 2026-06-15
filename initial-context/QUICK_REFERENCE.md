# Quick Reference & Commands - EduManager MVP

---

## 🚀 SETUP RÁPIDO

### 1. Crear Monorepo
```bash
mkdir edumanager-mvp
cd edumanager-mvp
git init
npm init -y

# Crear estructura
mkdir -p packages/{backend,frontend,shared}
```

### 2. Backend Setup
```bash
cd packages/backend

# Inicializar
npm init -y

# Instalar dependencias
npm install express express-async-errors
npm install typeorm pg
npm install class-validator class-transformer
npm install jsonwebtoken bcryptjs
npm install speakeasy qrcode
npm install nodemailer
npm install dotenv cors helmet uuid papaparse

# Dev dependencies
npm install -D typescript @types/node @types/express
npm install -D ts-node ts-node-dev
npm install -D jest @types/jest ts-jest
npm install -D eslint @typescript-eslint/eslint-plugin
npm install -D prettier

# Create tsconfig.json + jest.config.js
```

### 3. Frontend Setup
```bash
cd packages/frontend

# Crear proyecto Angular
ng new frontend --skip-git --package-manager=npm

# Instalar Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4. Docker
```bash
# En raíz
cd ../..

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: edumanager_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: edumanager_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

docker-compose up -d
```

---

## 🗂️ ESTRUCTURA CARPETAS RÁPIDA

### Backend
```
backend/src/
├── config/
│   └── database.ts
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.dto.ts
│   │   └── auth.types.ts
│   ├── courses/
│   ├── grades/
│   └── ...
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   └── middleware/
└── main.ts
```

### Frontend
```
frontend/src/app/
├── core/
│   ├── services/
│   ├── guards/
│   └── interceptors/
├── shared/
│   ├── components/
│   └── shared.module.ts
├── features/
│   ├── auth/
│   ├── professor/
│   ├── student/
│   └── guardian/
└── app.module.ts
```

---

## 🔐 ENUMS & CONSTANTS

### User Roles
```typescript
// shared/enums/roles.enum.ts
export enum UserRole {
  ADMIN = 'admin',
  PROFESSOR = 'professor',
  STUDENT = 'student',
  GUARDIAN = 'guardian',
}
```

### Status
```typescript
export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export enum EnrollmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
```

### API Endpoints
```typescript
// shared/api/endpoints.ts
export const ENDPOINTS = {
  auth: {
    signup: '/api/v1/auth/signup',
    login: '/api/v1/auth/login',
    verify2fa: '/api/v1/auth/2fa/verify',
    refresh: '/api/v1/auth/refresh',
  },
  courses: {
    create: '/api/v1/courses',
    list: '/api/v1/courses',
    detail: (id: string) => `/api/v1/courses/${id}`,
  },
  grades: {
    create: '/api/v1/tasks/:taskId/grades',
    list: (courseId: string) => `/api/v1/courses/${courseId}/grades`,
  },
};
```

---

## 📋 ENTITIES BÁSICAS (TypeORM)

### User Entity
```typescript
import { Column, Entity, PrimaryUUID } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryUUID()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ nullable: true })
  institutionId: string;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

### Course Entity
```typescript
@Entity('courses')
export class Course {
  @PrimaryUUID()
  id: string;

  @Column()
  institutionId: string;

  @Column()
  professorId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  academicYear: string; // e.g., "2024"

  @Column()
  semester: number; // 1 o 2

  @OneToMany(() => StudentEnrollment, (enrollment) => enrollment.course)
  enrollments: StudentEnrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Grade Entity
```typescript
@Entity('grades')
export class Grade {
  @PrimaryUUID()
  id: string;

  @Column()
  taskId: string;

  @Column()
  studentId: string;

  @Column('decimal', { precision: 5, scale: 2 }) // 0-100
  score: number;

  @Column('decimal', { precision: 5, scale: 2 })
  percentage: number; // Calculado: (score/100)*100

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 🔌 ENDPOINTS ESENCIALES

### Auth
```
POST   /api/v1/auth/signup
       Body: { email, password, firstName, lastName }

POST   /api/v1/auth/login
       Body: { email, password }
       Response: { token, expiresIn, user }

POST   /api/v1/auth/2fa/setup
       Headers: Authorization: Bearer {token}
       Response: { qrCode, secret }

POST   /api/v1/auth/2fa/verify
       Body: { code }
       Response: { token }

POST   /api/v1/auth/refresh
       Body: { refreshToken }
       Response: { token }
```

### Instituciones
```
POST   /api/v1/institutions
       Body: { name }
       Response: { id, slug }

POST   /api/v1/institutions/:id/invite-professor
       Body: { email }
       Response: { message, invitationLink }

GET    /api/v1/institutions/:id
```

### Cursos
```
POST   /api/v1/courses
       Body: { name, description, academicYear, semester }

GET    /api/v1/courses
       Query: ?skip=0&take=10

GET    /api/v1/courses/:courseId

DELETE /api/v1/courses/:courseId
```

### Estudiantes
```
POST   /api/v1/courses/:courseId/students
       Body: { studentId }

POST   /api/v1/courses/:courseId/students/import-csv
       Form-data: file (CSV)
       Response: { created: 10, errors: [] }

GET    /api/v1/courses/:courseId/students

DELETE /api/v1/courses/:courseId/students/:studentId
```

### Calificaciones
```
POST   /api/v1/tasks/:taskId/grades
       Body: [{ studentId, score }, ...]

PATCH  /api/v1/tasks/:taskId/grades/:gradeId
       Body: { score }

GET    /api/v1/courses/:courseId/grades
       Response: tabla de notas

GET    /api/v1/students/:studentId/grades
```

---

## 🔧 SNIPPETS ÚTILES

### JWT Middleware
```typescript
// backend/src/common/middleware/jwt.middleware.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const jwtMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Password Hashing
```typescript
// backend/src/common/utils/crypto.ts
import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

### 2FA Setup
```typescript
// backend/src/common/utils/twofa.ts
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

export const generateSecret = (email: string) => {
  return speakeasy.generateSecret({
    name: `EduManager (${email})`,
    issuer: 'EduManager',
  });
};

export const generateQRCode = async (secret: string): Promise<string> => {
  return qrcode.toDataURL(secret);
};

export const verifyToken = (secret: string, token: string): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2,
  });
};
```

### Email Service
```typescript
// backend/src/common/services/email.service.ts
import nodemailer from 'nodemailer';

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT!),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async sendEmail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  }
}
```

### CSV Import
```typescript
// backend/src/common/utils/csv.ts
import Papa from 'papaparse';

export const parseCSV = (fileContent: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};

export const validateStudentCSV = (rows: any[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  rows.forEach((row, index) => {
    if (!row.email) errors.push(`Row ${index + 1}: Email required`);
    if (!row.name) errors.push(`Row ${index + 1}: Name required`);
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};
```

### Angular Auth Service
```typescript
// frontend/src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post('/api/v1/auth/login', { email, password });
  }

  signup(data: any): Observable<any> {
    return this.http.post('/api/v1/auth/signup', data);
  }

  verify2FA(code: string): Observable<any> {
    return this.http.post('/api/v1/auth/2fa/verify', { code });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  private loadUserFromStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }
}
```

### Angular Role Guard
```typescript
// frontend/src/app/core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];
    const user = this.getCurrentUser();

    if (user && user.role === requiredRole) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }

  private getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
```

---

## 📊 MIGRATION EXAMPLES

### Crear User Table
```bash
npm run typeorm migration:generate -- -n CreateUserTable
```

```typescript
// db/migrations/1234567890-CreateUserTable.ts
export class CreateUserTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password_hash', type: 'varchar' },
          { name: 'role', type: 'enum', enum: ['admin', 'professor', 'student', 'guardian'] },
          { name: 'institution_id', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

---

## 🧪 TEST TEMPLATES

### Backend Test (Jest)
```typescript
// backend/src/modules/auth/auth.service.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should hash password correctly', async () => {
    const password = 'test123';
    const hash = await service.hashPassword(password);
    const isMatch = await service.comparePassword(password, hash);
    expect(isMatch).toBe(true);
  });
});
```

### Frontend Test (Jasmine)
```typescript
// frontend/src/app/core/services/auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should login user', () => {
    service.login('test@example.com', 'password').subscribe((res) => {
      expect(res.token).toBeDefined();
    });

    const req = httpMock.expectOne('/api/v1/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'test-token' });
  });
});
```

---

## 🚀 DEPLOYMENT COMMANDS

### Build
```bash
# Backend
cd packages/backend
npm run build

# Frontend
cd packages/frontend
ng build --configuration production
```

### Docker
```bash
# Build image
docker build -t edumanager-backend:latest packages/backend

# Run
docker run -p 3000:3000 edumanager-backend:latest

# Compose
docker-compose up -d

# Logs
docker-compose logs -f backend
```

### Database
```bash
# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate migration from entities
npm run migration:generate -- -n <MigrationName>
```

---

## 📚 REFERENCES & DOCS

- TypeORM: https://typeorm.io/
- Express: https://expressjs.com/
- Angular: https://angular.io/
- PostgreSQL: https://www.postgresql.org/docs/
- Speakeasy (2FA): https://github.com/speakeasyjs/speakeasy
- Nodemailer: https://nodemailer.com/
- JWT: https://jwt.io/

---

## 🔍 DEBUGGING

### Logs Backend
```typescript
import { Logger } from 'typeorm';

const logger = new Logger();
logger.log('Info message');
logger.warn('Warning');
logger.error('Error');
```

### Logs Frontend
```typescript
console.log('Debug:', data);
console.error('Error:', error);

// Con timestamp
console.log(`[${new Date().toISOString()}]`, message);
```

### Chrome DevTools
```
Ctrl+Shift+I  (Windows/Linux)
Cmd+Option+I  (Mac)

Network tab: ver requests/responses
Console tab: errores JavaScript
Storage tab: localStorage/cookies
```

### Postman
```
1. Crear Collection
2. Add request → POST /api/v1/auth/login
3. Body → raw JSON
4. Headers → Content-Type: application/json
5. Tests → verificar status 200
```

---

## 💡 PRODUCTIVITY TIPS

### VSCode Extensions
- Thunder Client (API testing)
- Thunder Client (in-app)
- Database Clients (PostgreSQL)
- GitLens
- ESLint
- Prettier

### Shortcuts Útiles
```bash
# Restart docker
docker-compose down && docker-compose up -d

# Clear database
docker-compose exec postgres psql -U postgres -d edumanager_dev -c "TRUNCATE users CASCADE;"

# Tail logs
docker-compose logs -f backend

# Access DB shell
docker-compose exec postgres psql -U postgres -d edumanager_dev
```

### Git Aliases
```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.last 'log -1 HEAD'
```

---

**Versión:** 1.0  
**Última actualización:** Junio 2026  
**Status:** LISTO PARA USAR

