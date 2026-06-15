# Plan de Arquitectura & Setup - EduManager MVP

---

## 1. ESTRUCTURA DE REPOSITORIOS

```
Opción A - Monorepo (recomendado para MVP)
edumanager-mvp/
├── packages/
│   ├── backend/          (Express + TypeScript)
│   ├── frontend/         (Angular)
│   └── shared/           (tipos compartidos)
├── docker-compose.yml
└── README.md

Opción B - Dos repos separados
edumanager-backend/
edumanager-frontend/
```

**Recomendación:** Empezar con Opción A (monorepo) porque:
- Cambios sincronizados
- Tipos compartidos fácilmente
- Deploy simplificado
- Ideal para MVP

---

## 2. ESTRUCTURA DE CARPETAS BACKEND

```
backend/
├── src/
│   ├── config/           # Configuración (db, env, etc)
│   ├── entities/         # TypeORM entities (User, Course, etc)
│   ├── modules/
│   │   ├── auth/         # Autenticación
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── middlewares/
│   │   │   ├── guards/
│   │   │   └── dtos/     # Data Transfer Objects
│   │   ├── institutions/
│   │   ├── courses/
│   │   ├── students/
│   │   ├── grades/
│   │   ├── tasks/
│   │   ├── notifications/
│   │   └── users/
│   ├── common/
│   │   ├── decorators/   # @IsOwner, @RateLimit, etc
│   │   ├── filters/      # Exception filters
│   │   ├── guards/       # Auth, Role guards
│   │   ├── interceptors/ # Error, logging
│   │   ├── middleware/   # Express middleware
│   │   └── utils/        # Funciones compartidas
│   ├── database/
│   │   ├── migrations/   # TypeORM migrations
│   │   ├── seeds/        # Data inicial
│   │   └── connection.ts
│   └── main.ts           # Entry point

├── test/
│   ├── unit/             # Servicios
│   ├── integration/      # Endpoints
│   └── fixtures/         # Test data

├── .env.example
├── .env.test
├── package.json
├── tsconfig.json
├── jest.config.js
├── Dockerfile
└── README.md
```

---

## 3. ESTRUCTURA DE CARPETAS FRONTEND

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/         # Servicios, guards, interceptors
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── api.service.ts
│   │   │   │   └── notification.service.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── interceptors/
│   │   │   └── models/  # Interfaces TypeScript
│   │   │
│   │   ├── shared/       # Componentes reutilizables
│   │   │   ├── components/
│   │   │   │   ├── navbar/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── loading/
│   │   │   │   ├── modal/
│   │   │   │   └── toast/
│   │   │   ├── directives/
│   │   │   ├── pipes/
│   │   │   └── shared.module.ts
│   │   │
│   │   ├── features/     # Módulos por rol/función
│   │   │   ├── auth/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── signup/
│   │   │   │   │   └── forgot-password/
│   │   │   │   ├── auth.module.ts
│   │   │   │   └── auth-routing.module.ts
│   │   │   │
│   │   │   ├── professor/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── courses/
│   │   │   │   │   ├── grades/
│   │   │   │   │   └── students/
│   │   │   │   ├── components/
│   │   │   │   └── professor.module.ts
│   │   │   │
│   │   │   ├── student/
│   │   │   ├── guardian/
│   │   │   ├── admin/
│   │   │   └── shared-features/ (cursos, perfil, etc)
│   │   │
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.routing.module.ts
│   │   └── app.module.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       └── tailwind.css
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   └── main.ts

├── cypress/              # E2E tests
├── .env.example
├── angular.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 4. TIPOS COMPARTIDOS (shared/)

```
shared/
├── src/
│   ├── types/
│   │   ├── user.types.ts      # User, UserRole, etc
│   │   ├── course.types.ts
│   │   ├── grade.types.ts
│   │   └── common.types.ts
│   ├── enums/
│   │   └── roles.enum.ts      # ADMIN, PROFESSOR, STUDENT, GUARDIAN
│   ├── api/
│   │   └── endpoints.ts       # URLs centralizadas
│   └── constants/
│       └── index.ts
└── package.json
```

---

## 5. CONFIGURACIÓN INICIAL

### 5.1 Variables de Entorno Backend (.env.example)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/edumanager_dev
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=edumanager_dev
DATABASE_SYNCHRONIZE=true        # Solo desarrollo
DATABASE_LOGGING=true

# Server
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Frontend
FRONTEND_URL=http://localhost:4200

# JWT
JWT_SECRET=your-super-secret-key-change-in-prod
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# 2FA
TWOFACTOR_SECRET=your-2fa-secret

# Email (Nodemailer - Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # App password, not real password
EMAIL_FROM=noreply@edumanager.com

# AWS S3 (opcional para MVP)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=

# Logging
LOG_LEVEL=debug
```

### 5.2 Variables de Entorno Frontend (.env.example)

```env
# Angular environment
NG_APP_API_URL=http://localhost:3000/api/v1
NG_APP_ENV=development
```

---

## 6. DEPENDENCIAS PRINCIPALES

### Backend (package.json)

```json
{
  "name": "@edumanager/backend",
  "version": "0.1.0",
  "description": "EduManager Backend - Express + TypeORM",
  "main": "dist/main.js",
  "scripts": {
    "dev": "ts-node-dev --respawn src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "typeorm": "typeorm",
    "migration:generate": "typeorm migration:generate",
    "migration:run": "typeorm migration:run",
    "migration:revert": "typeorm migration:revert",
    "seed": "ts-node src/database/seeds/index.ts",
    "lint": "eslint src --fix",
    "format": "prettier --write src"
  },
  "dependencies": {
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "typeorm": "^0.3.16",
    "pg": "^8.11.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "jsonwebtoken": "^9.1.0",
    "bcryptjs": "^2.4.3",
    "speakeasy": "^2.0.0",
    "qrcode": "^1.5.3",
    "nodemailer": "^6.9.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "uuid": "^9.0.0",
    "papaparse": "^5.4.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.3.1",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/bcryptjs": "^2.4.2",
    "@types/jest": "^29.5.1",
    "typescript": "^5.1.3",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "eslint": "^8.44.0",
    "prettier": "^3.0.0"
  }
}
```

### Frontend (package.json)

```json
{
  "name": "@edumanager/frontend",
  "version": "0.1.0",
  "description": "EduManager Frontend - Angular",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "test:headless": "ng test --watch=false --browsers=ChromeHeadless",
    "lint": "ng lint",
    "e2e": "cypress open",
    "e2e:headless": "cypress run"
  },
  "dependencies": {
    "@angular/animations": "^17.0.0",
    "@angular/common": "^17.0.0",
    "@angular/compiler": "^17.0.0",
    "@angular/core": "^17.0.0",
    "@angular/forms": "^17.0.0",
    "@angular/platform-browser": "^17.0.0",
    "@angular/platform-browser-dynamic": "^17.0.0",
    "@angular/router": "^17.0.0",
    "rxjs": "^7.8.1",
    "tslib": "^2.6.0",
    "zone.js": "^0.14.0",
    "tailwindcss": "^3.3.3"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^17.0.0",
    "@angular/cli": "^17.0.0",
    "@angular/compiler-cli": "^17.0.0",
    "@types/jasmine": "^5.1.0",
    "jasmine-core": "^5.0.0",
    "karma": "^6.4.0",
    "karma-chrome-launcher": "^3.2.0",
    "karma-coverage": "^2.2.1",
    "karma-jasmine": "^5.1.0",
    "karma-jasmine-html-reporter": "^2.1.0",
    "typescript": "^5.1.3",
    "cypress": "^13.0.0",
    "@cypress/webpack-dev-server": "^1.8.4",
    "prettier": "^3.0.0",
    "tailwindcss": "^3.3.3",
    "postcss": "^8.4.26",
    "autoprefixer": "^10.4.14"
  }
}
```

---

## 7. DOCKER & COMPOSE

### Dockerfile Backend

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

### docker-compose.yml

```yaml
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
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    container_name: edumanager_backend
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/edumanager_dev
      NODE_ENV: development
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend/src:/app/src
    command: npm run dev

volumes:
  postgres_data:
```

---

## 8. FLUJO DE DESARROLLO

### Setup Inicial

```bash
# 1. Clonar y setup
git clone https://github.com/tu-usuario/edumanager-mvp.git
cd edumanager-mvp

# 2. Instalar dependencias
npm install

# 3. Setup variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Iniciar servicios
docker-compose up -d

# 5. Correr migraciones
cd backend
npm run migration:run
npm run seed

# 6. Iniciar desarrollo
npm run dev

# 7. Otra terminal - Frontend
cd frontend
npm start
```

---

## 9. CONVENCIONES DE CÓDIGO

### TypeScript
- **Strict Mode:** Activado
- **Naming:** camelCase para variables/funciones, PascalCase para clases/interfaces
- **Interfaces:** Prefijo `I` opcional (pero recomendado en módulos compartidos)
- **Tipos:** Usar `type` para tipos simples, `interface` para objetos complejos

### Backend (Express + TypeORM)
- **Controllers:** Lógica de requests/responses
- **Services:** Lógica de negocio
- **DTOs:** Validación de entrada
- **Entities:** Representación de DB
- **Error Handling:** Custom exceptions y middleware global

### Frontend (Angular)
- **Smart Components:** Con lógica, conectados a servicios
- **Dumb Components:** Solo presentación, @Input/@Output
- **Services:** Comunicación API, state management simple
- **Modules:** Lazy loading por features

---

## 10. GIT WORKFLOW

```bash
# Branch naming
feature/auth-login
feature/grade-system
bugfix/validation-error
docs/api-setup

# Commits
git commit -m "feat: add 2FA login endpoint"
git commit -m "fix: correct grade calculation formula"
git commit -m "docs: update API documentation"

# PRs antes de merge a main
```

---

## 11. TESTING STRATEGY

### Backend (Jest)
```typescript
// Ejemplo estructura test
describe('GradeService', () => {
  let service: GradeService;
  let repo: Repository<Grade>;

  beforeEach(() => {
    // Setup
  });

  it('should calculate average correctly', () => {
    // Arrange, Act, Assert
  });
});
```

### Frontend (Jasmine)
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Setup
    });
  });

  it('should login user', () => {
    // Arrange, Act, Assert
  });
});
```

---

## 12. DEPLOYMENT CHECKLIST

- [ ] Environment variables configuradas (prod)
- [ ] Database migrations ejecutadas
- [ ] Tests pasando (coverage >70%)
- [ ] Build sin warnings
- [ ] Documentación API completa
- [ ] README con instrucciones
- [ ] Dockerfile testeado
- [ ] SSL/HTTPS configurado
- [ ] Backup strategy
- [ ] Monitoring/Logging

---

## 13. HERRAMIENTAS RECOMENDADAS

- **IDE:** VS Code + Remote Containers extension
- **API Testing:** Postman o Insomnia
- **Database:** DBeaver o TablePlus
- **Git UI:** GitKraken o GitHub Desktop
- **Monitoring:** Sentry (opcional para MVP)

---

**Estado:** LISTO PARA COMENZAR  
**Próximo paso:** Crear repositorio e inicializar proyectos
